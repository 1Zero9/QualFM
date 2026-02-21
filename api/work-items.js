import crypto from 'node:crypto'
import { getSessionFromRequest, hasPermission, json, readJsonBody } from './auth/_auth.js'
import { query } from './_db.js'

function normalizeText(value) {
  return String(value ?? '').trim()
}

function normalizeProgress(value) {
  const n = Number(value)
  if (!Number.isFinite(n)) return 0
  return Math.max(0, Math.min(100, Math.round(n)))
}

function normalizeTags(value) {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeText(item)).filter(Boolean)
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((part) => normalizeText(part))
      .filter(Boolean)
  }

  return []
}

function normalizeStatus(value) {
  const status = normalizeText(value)
  return ['todo', 'in_progress', 'blocked', 'done'].includes(status) ? status : 'todo'
}

function normalizePriority(value) {
  const priority = normalizeText(value)
  return ['low', 'medium', 'high', 'critical'].includes(priority) ? priority : 'medium'
}

function normalizeDate(value) {
  const text = normalizeText(value)
  if (!text) return null
  return /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : null
}

function mapRow(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    priority: row.priority,
    category: row.category,
    owner: row.owner,
    dueDate: row.due_date,
    progress: row.progress,
    tags: row.tags || [],
    clientVisible: Boolean(row.client_visible),
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    completedAt: row.completed_at
  }
}

function dbErrorResponse(res, error) {
  const message = String(error?.message || '')
  if (message.includes('work_items')) {
    return json(res, 500, {
      error: 'Database table not initialized',
      hint: 'Run db/neon-init.sql in Neon SQL editor'
    })
  }

  console.error('work-items-db-error', { message })
  return json(res, 500, { error: 'Database error' })
}

export default async function handler(req, res) {
  const session = getSessionFromRequest(req)
  if (!session.ok) return json(res, 401, { error: 'Not authenticated' })

  const canView = hasPermission(session, 'work_items.view')
  const canManage = hasPermission(session, 'work_items.manage')

  if (req.method === 'GET') {
    if (!canView) return json(res, 403, { error: 'Permission denied' })
    try {
      const result = await query(
        `
          select *
          from public.work_items
          order by
            case
              when status = 'blocked' then 0
              when status = 'in_progress' then 1
              when status = 'todo' then 2
              else 3
            end,
            priority desc,
            due_date nulls last,
            created_at desc
        `
      )
      return json(res, 200, { items: result.rows.map(mapRow) })
    } catch (error) {
      return dbErrorResponse(res, error)
    }
  }

  if (req.method === 'POST') {
    if (!canManage) return json(res, 403, { error: 'Permission denied' })

    let body
    try {
      body = await readJsonBody(req)
    } catch {
      return json(res, 400, { error: 'Invalid JSON body' })
    }

    const title = normalizeText(body.title)
    if (!title) return json(res, 400, { error: 'title is required' })

    const description = normalizeText(body.description)
    const status = normalizeStatus(body.status)
    const priority = normalizePriority(body.priority)
    const category = normalizeText(body.category) || 'general'
    const owner = normalizeText(body.owner)
    const dueDate = normalizeDate(body.dueDate)
    const progress = normalizeProgress(body.progress)
    const tags = normalizeTags(body.tags)
    const clientVisible = body.clientVisible !== false
    const id = `JOB_${crypto.randomUUID()}`

    try {
      const inserted = await query(
        `
          insert into public.work_items (
            id, title, description, status, priority, category, owner, due_date, progress, tags, client_visible, created_by
          ) values (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10::text[], $11, $12
          )
          returning *
        `,
        [id, title, description, status, priority, category, owner, dueDate, progress, tags, clientVisible, session.username]
      )
      return json(res, 201, { item: mapRow(inserted.rows[0]) })
    } catch (error) {
      return dbErrorResponse(res, error)
    }
  }

  if (req.method === 'PUT') {
    if (!canManage) return json(res, 403, { error: 'Permission denied' })

    let body
    try {
      body = await readJsonBody(req)
    } catch {
      return json(res, 400, { error: 'Invalid JSON body' })
    }

    const id = normalizeText(body.id)
    const title = normalizeText(body.title)
    if (!id || !title) return json(res, 400, { error: 'id and title are required' })

    const description = normalizeText(body.description)
    const status = normalizeStatus(body.status)
    const priority = normalizePriority(body.priority)
    const category = normalizeText(body.category) || 'general'
    const owner = normalizeText(body.owner)
    const dueDate = normalizeDate(body.dueDate)
    const progress = normalizeProgress(body.progress)
    const tags = normalizeTags(body.tags)
    const clientVisible = body.clientVisible !== false
    const completedAt = status === 'done' ? 'now()' : 'null'

    try {
      const updated = await query(
        `
          update public.work_items
          set
            title = $2,
            description = $3,
            status = $4,
            priority = $5,
            category = $6,
            owner = $7,
            due_date = $8,
            progress = $9,
            tags = $10::text[],
            client_visible = $11,
            updated_at = now(),
            completed_at = ${completedAt}
          where id = $1
          returning *
        `,
        [id, title, description, status, priority, category, owner, dueDate, progress, tags, clientVisible]
      )

      if (updated.rowCount === 0) return json(res, 404, { error: 'Work item not found' })
      return json(res, 200, { item: mapRow(updated.rows[0]) })
    } catch (error) {
      return dbErrorResponse(res, error)
    }
  }

  res.setHeader('Allow', 'GET, POST, PUT')
  return json(res, 405, { error: 'Method not allowed' })
}

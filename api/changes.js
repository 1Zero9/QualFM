import crypto from 'node:crypto'
import { getSessionFromRequest, hasPermission, json, readJsonBody } from './auth/_auth.js'
import { query } from './_db.js'

function normalizeText(value) {
  return String(value ?? '').trim()
}

function mapRow(row) {
  return {
    id: row.id,
    blockId: row.block_id,
    page: row.page,
    section: row.section,
    currentText: row.current_text,
    newText: row.new_text,
    notes: row.notes,
    status: row.status,
    requester: row.requester,
    submittedAt: row.submitted_at,
    reviewedAt: row.reviewed_at || '',
    reviewedBy: row.reviewed_by || '',
    reviewNotes: row.review_notes || ''
  }
}

function dbErrorResponse(res, error) {
  const message = String(error?.message || '')
  if (message.includes('change_requests')) {
    return json(res, 500, {
      error: 'Database table not initialized',
      hint: 'Run db/neon-init.sql in Neon SQL editor'
    })
  }

  console.error('changes-api-db-error', { message })
  return json(res, 500, {
    error: 'Database error'
  })
}

export default async function handler(req, res) {
  const session = getSessionFromRequest(req)
  if (!session.ok) {
    return json(res, 401, { error: 'Not authenticated' })
  }

  if (req.method === 'GET') {
    if (!hasPermission(session, 'changes.view_all') && !hasPermission(session, 'changes.view_own')) {
      return json(res, 403, { error: 'Permission denied' })
    }

    try {
      const result = hasPermission(session, 'changes.view_all')
        ? await query(
            `
              select *
              from public.change_requests
              order by submitted_at desc
            `
          )
        : await query(
            `
              select *
              from public.change_requests
              where requester = $1
              order by submitted_at desc
            `,
            [session.username]
          )

      return json(res, 200, {
        items: result.rows.map(mapRow)
      })
    } catch (error) {
      return dbErrorResponse(res, error)
    }
  }

  if (req.method === 'POST') {
    if (!hasPermission(session, 'changes.create')) {
      return json(res, 403, { error: 'Permission denied' })
    }

    let body
    try {
      body = await readJsonBody(req)
    } catch {
      return json(res, 400, { error: 'Invalid JSON body' })
    }

    const blockId = normalizeText(body.blockId)
    const page = normalizeText(body.page)
    const section = normalizeText(body.section)
    const currentText = normalizeText(body.currentText)
    const newText = normalizeText(body.newText)
    const notes = normalizeText(body.notes)

    if (!blockId || !newText) {
      return json(res, 400, { error: 'blockId and newText are required' })
    }

    const id = `REQ_${crypto.randomUUID()}`

    try {
      const inserted = await query(
        `
          insert into public.change_requests (
            id,
            block_id,
            page,
            section,
            current_text,
            new_text,
            notes,
            status,
            requester,
            reviewed_by,
            review_notes
          )
          values ($1, $2, $3, $4, $5, $6, $7, 'pending', $8, '', '')
          returning *
        `,
        [
          id,
          blockId,
          page,
          section,
          currentText,
          newText,
          notes,
          session.username
        ]
      )

      return json(res, 201, { item: mapRow(inserted.rows[0]) })
    } catch (error) {
      return dbErrorResponse(res, error)
    }
  }

  if (req.method === 'PUT') {
    if (!hasPermission(session, 'changes.review')) {
      return json(res, 403, { error: 'Permission denied' })
    }

    let body
    try {
      body = await readJsonBody(req)
    } catch {
      return json(res, 400, { error: 'Invalid JSON body' })
    }

    const id = normalizeText(body.id)
    const status = normalizeText(body.status)
    const reviewNotes = normalizeText(body.reviewNotes)

    if (!id || !['pending', 'approved', 'rejected'].includes(status)) {
      return json(res, 400, { error: 'id and valid status are required' })
    }

    try {
      const updated = await query(
        `
          update public.change_requests
          set
            status = $2,
            review_notes = $3,
            reviewed_by = $4,
            reviewed_at = now()
          where id = $1
          returning *
        `,
        [id, status, reviewNotes, session.username]
      )

      if (updated.rowCount === 0) {
        return json(res, 404, { error: 'Request not found' })
      }

      return json(res, 200, { item: mapRow(updated.rows[0]) })
    } catch (error) {
      return dbErrorResponse(res, error)
    }
  }

  res.setHeader('Allow', 'GET, POST, PUT')
  return json(res, 405, { error: 'Method not allowed' })
}

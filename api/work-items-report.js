import { getSessionFromRequest, hasPermission, json } from './auth/_auth.js'
import { query } from './_db.js'

function dbErrorResponse(res, error) {
  const message = String(error?.message || '')
  if (message.includes('work_items')) {
    return json(res, 500, {
      error: 'Database table not initialized',
      hint: 'Run db/neon-init.sql in Neon SQL editor'
    })
  }

  console.error('work-items-report-db-error', { message })
  return json(res, 500, { error: 'Database error' })
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return json(res, 405, { error: 'Method not allowed' })
  }

  const session = getSessionFromRequest(req)
  if (!session.ok) return json(res, 401, { error: 'Not authenticated' })
  if (!hasPermission(session, 'reports.view')) return json(res, 403, { error: 'Permission denied' })

  try {
    const [{ rows: statusRows }, { rows: priorityRows }, totals, overdue] = await Promise.all([
      query(
        `
          select status, count(*)::int as count
          from public.work_items
          group by status
        `
      ),
      query(
        `
          select priority, count(*)::int as count
          from public.work_items
          group by priority
        `
      ),
      query(
        `
          select
            count(*)::int as total,
            count(*) filter (where status = 'done')::int as done
          from public.work_items
        `
      ),
      query(
        `
          select count(*)::int as overdue
          from public.work_items
          where due_date is not null
            and due_date < current_date
            and status <> 'done'
        `
      )
    ])

    const total = totals.rows[0]?.total ?? 0
    const done = totals.rows[0]?.done ?? 0
    const completionRate = total > 0 ? Math.round((done / total) * 100) : 0

    return json(res, 200, {
      generatedAt: new Date().toISOString(),
      summary: {
        total,
        done,
        completionRate,
        overdue: overdue.rows[0]?.overdue ?? 0
      },
      byStatus: statusRows,
      byPriority: priorityRows
    })
  } catch (error) {
    return dbErrorResponse(res, error)
  }
}

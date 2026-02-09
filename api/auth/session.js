import { clearSessionCookie, getSessionFromRequest, json } from './_auth.js'

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return json(res, 405, { error: 'Method not allowed' })
  }

  const session = getSessionFromRequest(req)
  if (!session.ok) {
    clearSessionCookie(res)
    return json(res, 401, { authenticated: false })
  }

  return json(res, 200, {
    authenticated: true,
    role: session.role,
    username: session.username,
    expiresAt: session.expiresAt
  })
}

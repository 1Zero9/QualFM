import {
  clearSessionCookie,
  getSecret,
  getSessionTokenFromRequest,
  json,
  verifySessionToken
} from './_auth.js'

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return json(res, 405, { error: 'Method not allowed' })
  }

  const secret = getSecret()
  if (!secret) {
    return json(res, 500, { error: 'Server auth configuration missing' })
  }

  const token = getSessionTokenFromRequest(req)
  const status = verifySessionToken(token, secret)

  if (!status.ok) {
    clearSessionCookie(res)
    return json(res, 401, { authenticated: false })
  }

  return json(res, 200, {
    authenticated: true,
    expiresAt: status.expiresAt
  })
}

import {
  createSessionToken,
  getSecret,
  json,
  readJsonBody,
  setSessionCookie,
  verifyCredentials
} from './_auth.js'

const attempts = new Map()
const MAX_ATTEMPTS = 10
const WINDOW_MS = 15 * 60 * 1000

function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.length > 0) return forwarded.split(',')[0].trim()
  return req.socket?.remoteAddress || 'unknown'
}

function getWindow(ip) {
  const now = Date.now()
  const current = attempts.get(ip)
  if (!current || now > current.start + WINDOW_MS) {
    const fresh = { start: now, count: 0 }
    attempts.set(ip, fresh)
    return fresh
  }
  return current
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return json(res, 405, { error: 'Method not allowed' })
  }

  const secret = getSecret()
  if (!secret) {
    return json(res, 500, {
      error: 'Server auth configuration missing',
      hint: 'Set ADMIN_SESSION_SECRET'
    })
  }

  const ip = clientIp(req)
  const windowState = getWindow(ip)
  if (windowState.count >= MAX_ATTEMPTS) {
    return json(res, 429, { error: 'Too many attempts. Try again later.' })
  }

  let body
  try {
    body = await readJsonBody(req)
  } catch {
    windowState.count += 1
    return json(res, 400, { error: 'Invalid JSON body' })
  }

  const username = String(body?.username || '')
  const password = String(body?.password || '')
  const expectedRole = body?.expectedRole === 'admin' || body?.expectedRole === 'client'
    ? body.expectedRole
    : undefined

  const auth = verifyCredentials(username, password)
  if (!auth.ok) {
    windowState.count += 1
    return json(res, 401, { error: 'Invalid credentials' })
  }

  if (expectedRole && auth.role !== expectedRole) {
    windowState.count += 1
    return json(res, 403, { error: 'Account does not have access to this area' })
  }

  attempts.delete(ip)
  const session = createSessionToken(secret, auth.role, auth.username)
  setSessionCookie(res, session.token, session.expiresAt)

  return json(res, 200, {
    ok: true,
    role: auth.role,
    username: auth.username,
    expiresAt: session.expiresAt
  })
}

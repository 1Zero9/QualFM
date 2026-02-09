import {
  createSessionToken,
  getClientIp,
  getPasswordHashHex,
  getPlainPassword,
  getSecret,
  json,
  setSessionCookie,
  sha256Hex,
  timingSafeEqualHex
} from './_auth.js'

const attempts = new Map()
const MAX_ATTEMPTS = 8
const WINDOW_MS = 15 * 60 * 1000

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function getAttemptState(ip) {
  const now = Date.now()
  const current = attempts.get(ip)
  if (!current || now > current.windowStart + WINDOW_MS) {
    const state = { count: 0, windowStart: now }
    attempts.set(ip, state)
    return state
  }
  return current
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return json(res, 405, { error: 'Method not allowed' })
  }

  const secret = getSecret()
  const passwordHash = getPasswordHashHex()
  const plainPassword = getPlainPassword()
  if (!secret || (!passwordHash && !plainPassword)) {
    return json(res, 500, {
      error: 'Server auth configuration missing',
      hint: 'Set ADMIN_SESSION_SECRET plus ADMIN_PASSWORD or ADMIN_PASSWORD_SHA256'
    })
  }

  const ip = getClientIp(req)
  const state = getAttemptState(ip)
  if (state.count >= MAX_ATTEMPTS) {
    return json(res, 429, { error: 'Too many attempts. Try again later.' })
  }

  let body
  try {
    if (typeof req.body === 'string') {
      body = JSON.parse(req.body)
    } else if (req.body && typeof req.body === 'object') {
      body = req.body
    } else {
      const raw = await readRawBody(req)
      body = raw ? JSON.parse(raw) : {}
    }
  } catch {
    state.count += 1
    return json(res, 400, { error: 'Invalid JSON body' })
  }

  const password = String(body?.password || '')
  const passwordTrimmed = password.trim()
  const candidateHash = sha256Hex(passwordTrimmed)

  const matchesPlain = plainPassword
    ? timingSafeEqualHex(passwordTrimmed, plainPassword)
    : false

  const matchesHash = passwordHash
    ? timingSafeEqualHex(candidateHash, passwordHash)
    : false

  const ok = matchesPlain || matchesHash

  if (!ok) {
    state.count += 1
    return json(res, 401, { error: 'Invalid credentials' })
  }

  attempts.delete(ip)
  const session = createSessionToken(secret)
  setSessionCookie(res, session.token, session.expiresAt)

  return json(res, 200, {
    ok: true,
    expiresAt: session.expiresAt
  })
}

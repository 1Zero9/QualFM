import crypto from 'node:crypto'

const SESSION_COOKIE = 'qualfm_portal_session'
const SESSION_HOURS = 8

function base64UrlEncode(input) {
  return Buffer.from(input)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

function base64UrlDecode(input) {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((input.length + 3) % 4)
  return Buffer.from(padded, 'base64').toString('utf8')
}

export function json(res, status, payload) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(payload))
}

export function parseCookies(header) {
  const source = header || ''
  return source.split(';').reduce((acc, part) => {
    const [key, ...rest] = part.trim().split('=')
    if (!key) return acc
    acc[key] = decodeURIComponent(rest.join('=') || '')
    return acc
  }, {})
}

export function getSecret() {
  return (process.env.ADMIN_SESSION_SECRET || '').trim()
}

function hashHex(value) {
  return crypto.createHash('sha256').update(value).digest('hex')
}

function secureEqual(a, b) {
  const left = Buffer.from(String(a), 'utf8')
  const right = Buffer.from(String(b), 'utf8')
  if (left.length !== right.length) return false
  return crypto.timingSafeEqual(left, right)
}

function readCredential(role) {
  if (role === 'admin') {
    const username = (process.env.ADMIN_USERNAME || 'admin').trim()
    const password = (process.env.ADMIN_PASSWORD || '').trim()
    const hash = (process.env.ADMIN_PASSWORD_SHA256 || '').trim().toLowerCase()
    return { username, password, hash }
  }

  const username = (process.env.CLIENT_USERNAME || 'client').trim()
  const password = (process.env.CLIENT_PASSWORD || '').trim()
  const hash = (process.env.CLIENT_PASSWORD_SHA256 || '').trim().toLowerCase()
  return { username, password, hash }
}

export function verifyCredentials(username, password) {
  const usernameTrimmed = String(username || '').trim()
  const passwordTrimmed = String(password || '').trim()
  if (!usernameTrimmed || !passwordTrimmed) return { ok: false }

  for (const role of ['admin', 'client']) {
    const credential = readCredential(role)
    if (!credential.username) continue
    if (!secureEqual(usernameTrimmed, credential.username)) continue

    const candidateHash = hashHex(passwordTrimmed)
    const hashMatch = credential.hash ? secureEqual(candidateHash, credential.hash) : false
    const plainMatch = credential.password ? secureEqual(passwordTrimmed, credential.password) : false

    if (hashMatch || plainMatch) {
      return { ok: true, role, username: credential.username }
    }
  }

  return { ok: false }
}

export function createSessionToken(secret, role, username) {
  const issuedAt = Date.now()
  const expiresAt = issuedAt + SESSION_HOURS * 60 * 60 * 1000
  const payload = {
    iat: issuedAt,
    exp: expiresAt,
    role,
    username,
    nonce: crypto.randomBytes(10).toString('hex')
  }

  const payloadEncoded = base64UrlEncode(JSON.stringify(payload))
  const signature = crypto
    .createHmac('sha256', secret)
    .update(payloadEncoded)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')

  return {
    token: `${payloadEncoded}.${signature}`,
    expiresAt
  }
}

export function verifySessionToken(token, secret) {
  if (!token || !secret || !token.includes('.')) return { ok: false }

  const [payloadEncoded, signature] = token.split('.')
  if (!payloadEncoded || !signature) return { ok: false }

  const expected = crypto
    .createHmac('sha256', secret)
    .update(payloadEncoded)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')

  if (!secureEqual(signature, expected)) return { ok: false }

  try {
    const payload = JSON.parse(base64UrlDecode(payloadEncoded))
    if (typeof payload.exp !== 'number' || Date.now() >= payload.exp) return { ok: false }
    if (payload.role !== 'admin' && payload.role !== 'client') return { ok: false }
    return { ok: true, role: payload.role, username: payload.username, expiresAt: payload.exp }
  } catch {
    return { ok: false }
  }
}

export function setSessionCookie(res, token, expiresAt) {
  const maxAgeSeconds = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000))
  res.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=${encodeURIComponent(token)}; Max-Age=${maxAgeSeconds}; Path=/; HttpOnly; Secure; SameSite=Strict`
  )
}

export function clearSessionCookie(res) {
  res.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE}=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Strict`
  )
}

export function getSessionFromRequest(req) {
  const cookies = parseCookies(req.headers?.cookie)
  const token = cookies[SESSION_COOKIE] || ''
  return verifySessionToken(token, getSecret())
}

export async function readJsonBody(req) {
  if (typeof req.body === 'string') return JSON.parse(req.body)
  if (req.body && typeof req.body === 'object') return req.body

  const raw = await new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })

  return raw ? JSON.parse(raw) : {}
}

export function ensureRole(session, role) {
  return session.ok && session.role === role
}

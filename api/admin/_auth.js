import crypto from 'node:crypto'

const SESSION_COOKIE = 'qualfm_admin_session'
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

export function getSecret() {
  return (process.env.ADMIN_SESSION_SECRET || '').trim()
}

export function getPasswordHashHex() {
  const explicitHash = (process.env.ADMIN_PASSWORD_SHA256 || '').trim()
  if (explicitHash && explicitHash.length === 64) return explicitHash.toLowerCase()

  const plain = (process.env.ADMIN_PASSWORD || '').trim()
  if (!plain) return ''

  return crypto.createHash('sha256').update(plain).digest('hex')
}

export function getPlainPassword() {
  return (process.env.ADMIN_PASSWORD || '').trim()
}

export function sha256Hex(value) {
  return crypto.createHash('sha256').update(value).digest('hex')
}

export function timingSafeEqualHex(a, b) {
  const left = Buffer.from(String(a), 'utf8')
  const right = Buffer.from(String(b), 'utf8')
  if (left.length !== right.length) return false
  return crypto.timingSafeEqual(left, right)
}

export function createSessionToken(secret) {
  const issuedAt = Date.now()
  const expiresAt = issuedAt + SESSION_HOURS * 60 * 60 * 1000
  const payload = {
    iat: issuedAt,
    exp: expiresAt,
    nonce: crypto.randomBytes(12).toString('hex')
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

  if (!timingSafeEqualHex(signature, expected)) return { ok: false }

  try {
    const payload = JSON.parse(base64UrlDecode(payloadEncoded))
    if (typeof payload.exp !== 'number' || Date.now() >= payload.exp) return { ok: false }
    return { ok: true, expiresAt: payload.exp }
  } catch {
    return { ok: false }
  }
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

export function getSessionTokenFromRequest(req) {
  const cookies = parseCookies(req.headers?.cookie)
  return cookies[SESSION_COOKIE] || ''
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

export function json(res, status, payload) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(payload))
}

export function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim()
  }
  return req.socket?.remoteAddress || 'unknown'
}

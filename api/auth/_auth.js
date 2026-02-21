import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const SESSION_COOKIE = 'qualfm_portal_session'
const SESSION_HOURS = 8
const ROLE_ALIASES = {
  admin: 'owner',
  client: 'client_admin',
  owner: 'owner',
  client_admin: 'client_admin',
  customer: 'customer'
}
const VALID_ROLES = new Set(['owner', 'client_admin', 'customer'])
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROLE_PERMISSIONS_PATH = path.resolve(__dirname, '../../config/role-permissions.json')

function loadRolePermissions() {
  try {
    const raw = fs.readFileSync(ROLE_PERMISSIONS_PATH, 'utf8')
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || !parsed.permissions) return {}
    return parsed.permissions
  } catch {
    return {}
  }
}

const ROLE_PERMISSIONS = loadRolePermissions()

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
    const rawValue = rest.join('=') || ''
    try {
      acc[key] = decodeURIComponent(rawValue)
    } catch {
      acc[key] = rawValue
    }
    return acc
  }, {})
}

function shouldUseSecureCookie(req) {
  if ((process.env.COOKIE_SECURE || '').trim().toLowerCase() === 'false') return false
  if ((process.env.NODE_ENV || '').trim() === 'production') return true
  const forwardedProto = req?.headers?.['x-forwarded-proto']
  if (typeof forwardedProto === 'string') {
    return forwardedProto.split(',')[0].trim().toLowerCase() === 'https'
  }
  return false
}

function cookieValue(name, value, maxAgeSeconds, secure) {
  const securePart = secure ? '; Secure' : ''
  return `${name}=${encodeURIComponent(value)}; Max-Age=${maxAgeSeconds}; Path=/; HttpOnly; SameSite=Strict${securePart}`
}

export function getSecret() {
  return (process.env.ADMIN_SESSION_SECRET || '').trim()
}

function hashHex(value) {
  return crypto.createHash('sha256').update(value).digest('hex')
}

function normalizeRole(role) {
  const normalized = ROLE_ALIASES[String(role || '').trim()]
  return VALID_ROLES.has(normalized) ? normalized : null
}

function firstNonEmpty(...values) {
  for (const value of values) {
    const text = String(value || '').trim()
    if (text) return text
  }
  return ''
}

function secureEqual(a, b) {
  const left = Buffer.from(String(a), 'utf8')
  const right = Buffer.from(String(b), 'utf8')
  if (left.length !== right.length) return false
  return crypto.timingSafeEqual(left, right)
}

function readCredential(role) {
  if (role === 'owner') {
    const username = firstNonEmpty(process.env.OWNER_USERNAME, process.env.ADMIN_USERNAME, 'admin')
    const password = firstNonEmpty(process.env.OWNER_PASSWORD, process.env.ADMIN_PASSWORD)
    const hash = firstNonEmpty(process.env.OWNER_PASSWORD_SHA256, process.env.ADMIN_PASSWORD_SHA256).toLowerCase()
    return { username, password, hash }
  }

  if (role === 'client_admin') {
    const username = firstNonEmpty(process.env.CLIENT_ADMIN_USERNAME, process.env.CLIENT_USERNAME, 'client')
    const password = firstNonEmpty(process.env.CLIENT_ADMIN_PASSWORD, process.env.CLIENT_PASSWORD)
    const hash = firstNonEmpty(
      process.env.CLIENT_ADMIN_PASSWORD_SHA256,
      process.env.CLIENT_PASSWORD_SHA256
    ).toLowerCase()
    return { username, password, hash }
  }

  const username = firstNonEmpty(process.env.CUSTOMER_USERNAME)
  const password = firstNonEmpty(process.env.CUSTOMER_PASSWORD)
  const hash = firstNonEmpty(process.env.CUSTOMER_PASSWORD_SHA256).toLowerCase()
  return { username, password, hash }
}

export function verifyCredentials(username, password) {
  const usernameTrimmed = String(username || '').trim()
  const passwordTrimmed = String(password || '').trim()
  if (!usernameTrimmed || !passwordTrimmed) return { ok: false }

  for (const role of ['owner', 'client_admin', 'customer']) {
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
    const role = normalizeRole(payload.role)
    if (!role) return { ok: false }
    return { ok: true, role, username: payload.username, expiresAt: payload.exp }
  } catch {
    return { ok: false }
  }
}

export function setSessionCookie(req, res, token, expiresAt) {
  const maxAgeSeconds = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000))
  const secure = shouldUseSecureCookie(req)
  res.setHeader('Set-Cookie', cookieValue(SESSION_COOKIE, token, maxAgeSeconds, secure))
}

export function clearSessionCookie(req, res) {
  const secure = shouldUseSecureCookie(req)
  const cookies = [
    cookieValue(SESSION_COOKIE, '', 0, secure),
    cookieValue(SESSION_COOKIE, '', 0, !secure)
  ]
  res.setHeader('Set-Cookie', cookies)
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
  if (!session.ok) return false
  if (Array.isArray(role)) return role.includes(session.role)
  return session.role === role
}

export function getPermissionsForRole(role) {
  const normalized = normalizeRole(role)
  if (!normalized) return new Set()
  return new Set(Array.isArray(ROLE_PERMISSIONS[normalized]) ? ROLE_PERMISSIONS[normalized] : [])
}

export function hasPermission(session, permission) {
  if (!session?.ok) return false
  return getPermissionsForRole(session.role).has(permission)
}

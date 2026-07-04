import { json, readJsonBody } from './_http.js'

const attempts = new Map()
const WINDOW_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 8
const MAX_TRACKED_IPS = 10000

function normalizeText(value) {
  return String(value ?? '').trim()
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

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

function pruneAttempts(now) {
  for (const [ip, entry] of attempts.entries()) {
    if (now > entry.start + WINDOW_MS) attempts.delete(ip)
  }

  if (attempts.size <= MAX_TRACKED_IPS) return
  const ordered = Array.from(attempts.entries()).sort((a, b) => a[1].start - b[1].start)
  const overflow = ordered.length - MAX_TRACKED_IPS
  for (let i = 0; i < overflow; i += 1) attempts.delete(ordered[i][0])
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return json(res, 405, { error: 'Method not allowed' })
  }

  const apiKey = normalizeText(process.env.RESEND_API_KEY)
  if (!apiKey) {
    return json(res, 500, { error: 'Email service not configured', hint: 'Set RESEND_API_KEY' })
  }

  pruneAttempts(Date.now())
  const ip = clientIp(req)
  const windowState = getWindow(ip)
  if (windowState.count >= MAX_ATTEMPTS) {
    return json(res, 429, { error: 'Too many requests. Try again later.' })
  }

  let body
  try {
    body = await readJsonBody(req)
  } catch {
    windowState.count += 1
    return json(res, 400, { error: 'Invalid JSON body' })
  }

  const name = normalizeText(body?.name)
  const email = normalizeText(body?.email).toLowerCase()
  const message = normalizeText(body?.message)
  const subject = normalizeText(body?.subject) || `Website enquiry from ${name || 'Unknown sender'}`

  if (!name || !email || !message) {
    windowState.count += 1
    return json(res, 400, { error: 'name, email and message are required' })
  }
  if (!isValidEmail(email)) {
    windowState.count += 1
    return json(res, 400, { error: 'Provide a valid email address' })
  }
  if (message.length < 20) {
    windowState.count += 1
    return json(res, 400, { error: 'Message must be at least 20 characters' })
  }

  const toEmail = normalizeText(process.env.CONTACT_TO_EMAIL) || 'service@qualfm.ie'
  const fromEmail =
    normalizeText(process.env.CONTACT_FROM_EMAIL) || 'QualFM Website <onboarding@resend.dev>'
  const submittedAt = new Date().toISOString()

  const payload = {
    from: fromEmail,
    to: [toEmail],
    reply_to: email,
    subject,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      `Submitted: ${submittedAt}`,
      '',
      'Message:',
      message
    ].join('\n')
  }

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    const data = await resendResponse.json().catch(() => null)
    if (!resendResponse.ok) {
      windowState.count += 1
      const resendError =
        data && typeof data === 'object' && typeof data.message === 'string'
          ? data.message
          : `Unable to send message (Resend HTTP ${resendResponse.status})`
      console.error('contact-resend-error', {
        status: resendResponse.status,
        response: data,
        fromEmail,
        toEmail
      })
      return json(res, 502, { error: resendError })
    }

    attempts.delete(ip)
    return json(res, 200, {
      ok: true,
      id: data && typeof data === 'object' ? data.id : null
    })
  } catch (error) {
    windowState.count += 1
    console.error('contact-send-failed', { message: String(error?.message || error) })
    return json(res, 502, { error: 'Unable to send message right now. Please try again shortly.' })
  }
}

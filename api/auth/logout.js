import { clearSessionCookie, json } from './_auth.js'

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return json(res, 405, { error: 'Method not allowed' })
  }

  clearSessionCookie(req, res)
  return json(res, 200, { ok: true })
}

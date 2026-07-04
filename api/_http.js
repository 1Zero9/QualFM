export function json(res, status, payload) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(payload))
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

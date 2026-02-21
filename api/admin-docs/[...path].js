import fs from 'node:fs/promises'
import path from 'node:path'
import { getSessionFromRequest, hasPermission, json } from '../auth/_auth.js'

const DOCS_ROOT = path.resolve(process.cwd(), 'public/admin-docs')

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.gz': 'application/gzip'
}

function normalizeSegments(rawPath) {
  if (!rawPath) return []
  const parts = Array.isArray(rawPath) ? rawPath : [rawPath]

  return parts
    .flatMap((item) => String(item).split('/'))
    .map((part) => {
      try {
        return decodeURIComponent(part)
      } catch {
        return part
      }
    })
    .filter(Boolean)
}

function getFilePath(rawPath) {
  const segments = normalizeSegments(rawPath)
  const relativePath = segments.length > 0 ? segments.join('/') : 'index.html'
  const normalizedPath = relativePath.endsWith('/') ? `${relativePath}index.html` : relativePath

  if (normalizedPath.includes('..')) return null

  const resolvedPath = path.resolve(DOCS_ROOT, normalizedPath)
  if (!resolvedPath.startsWith(DOCS_ROOT)) return null
  return resolvedPath
}

function setContentType(res, filePath) {
  const ext = path.extname(filePath).toLowerCase()
  res.setHeader('Content-Type', MIME_TYPES[ext] || 'application/octet-stream')
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD')
    return json(res, 405, { error: 'Method not allowed' })
  }

  const session = getSessionFromRequest(req)
  if (!hasPermission(session, 'docs.view')) {
    res.statusCode = 302
    res.setHeader('Location', '/admin')
    res.setHeader('Cache-Control', 'no-store')
    return res.end('Redirecting to /admin')
  }

  const filePath = getFilePath(req.query?.path)
  if (!filePath) {
    return json(res, 400, { error: 'Invalid path' })
  }

  try {
    const stat = await fs.stat(filePath)
    if (!stat.isFile()) {
      return json(res, 404, { error: 'Not found' })
    }

    setContentType(res, filePath)
    res.setHeader('Cache-Control', 'private, no-store')

    if (req.method === 'HEAD') {
      res.statusCode = 200
      return res.end()
    }

    const content = await fs.readFile(filePath)
    res.statusCode = 200
    return res.end(content)
  } catch {
    return json(res, 404, { error: 'Not found' })
  }
}

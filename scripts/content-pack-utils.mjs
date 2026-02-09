import fs from 'node:fs/promises'
import path from 'node:path'

export const CONTENT_FILE = path.resolve(process.cwd(), 'content/site-content.json')
export const EXPORT_FILE = path.resolve(process.cwd(), 'content/client-content-pack.csv')
export const GUIDE_FILE = path.resolve(process.cwd(), 'content/client-content-pack.md')

export async function loadContent() {
  const raw = await fs.readFile(CONTENT_FILE, 'utf8')
  return JSON.parse(raw)
}

export async function saveContent(content) {
  await fs.writeFile(CONTENT_FILE, `${JSON.stringify(content, null, 2)}\n`, 'utf8')
}

function toToken(value) {
  return String(value)
    .replace(/\[id=([^\]]+)\]/g, '.$1')
    .replace(/[^A-Za-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toUpperCase()
}

export function makeStableId(contentPath) {
  const tokens = contentPath
    .split('.')
    .map((part) => toToken(part))
    .filter(Boolean)

  return tokens.join('.')
}

export function flattenContent(content) {
  const rows = []

  function walk(node, basePath = '') {
    if (typeof node === 'string') {
      const parts = basePath.split('.').filter(Boolean)
      const page = parts[0] ? toToken(parts[0]) : 'GENERAL'
      const section = parts[1] ? toToken(parts[1]) : 'GENERAL'
      const label = parts[parts.length - 1] ? toToken(parts[parts.length - 1]) : 'TEXT'

      rows.push({
        id: makeStableId(basePath),
        page,
        section,
        label,
        current_text: node,
        content_path: basePath
      })
      return
    }

    if (Array.isArray(node)) {
      node.forEach((item, index) => {
        if (item && typeof item === 'object' && typeof item.id === 'string') {
          walk(item, `${basePath}[id=${item.id}]`)
          return
        }

        walk(item, `${basePath}[index=${index}]`)
      })
      return
    }

    if (node && typeof node === 'object') {
      Object.entries(node).forEach(([key, value]) => {
        if (key === 'id') return
        const nextPath = basePath ? `${basePath}.${key}` : key
        walk(value, nextPath)
      })
    }
  }

  walk(content)
  return rows
}

export function stringifyCsv(rows) {
  const headers = [
    'id',
    'page',
    'section',
    'label',
    'current_text',
    'client_new_text',
    'status',
    'notes',
    'content_path'
  ]

  const escapeCell = (value) => {
    const raw = String(value ?? '')
    if (/[,"\n]/.test(raw)) {
      return `"${raw.replace(/"/g, '""')}"`
    }
    return raw
  }

  const lines = [headers.join(',')]
  for (const row of rows) {
    lines.push(
      headers
        .map((header) => {
          if (header === 'client_new_text') return ''
          if (header === 'status') return 'KEEP'
          if (header === 'notes') return ''
          return escapeCell(row[header] ?? '')
        })
        .join(',')
    )
  }

  lines.push('APPENDIX.NEW_01,APPENDIX,NEW_REQUEST,TEXT,,,NEW_REQUEST,,')
  lines.push('APPENDIX.NEW_02,APPENDIX,NEW_REQUEST,TEXT,,,NEW_REQUEST,,')

  return `${lines.join('\n')}\n`
}

export function parseCsv(csvText) {
  const rows = []
  let row = []
  let cell = ''
  let inQuotes = false

  for (let i = 0; i < csvText.length; i += 1) {
    const char = csvText[i]
    const next = csvText[i + 1]

    if (inQuotes) {
      if (char === '"' && next === '"') {
        cell += '"'
        i += 1
      } else if (char === '"') {
        inQuotes = false
      } else {
        cell += char
      }
      continue
    }

    if (char === '"') {
      inQuotes = true
      continue
    }

    if (char === ',') {
      row.push(cell)
      cell = ''
      continue
    }

    if (char === '\n') {
      row.push(cell)
      rows.push(row)
      row = []
      cell = ''
      continue
    }

    if (char === '\r') {
      continue
    }

    cell += char
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell)
    rows.push(row)
  }

  if (rows.length === 0) return []

  const headers = rows[0]
  return rows.slice(1).map((cells) => {
    const mapped = {}
    headers.forEach((header, index) => {
      mapped[header] = cells[index] ?? ''
    })
    return mapped
  })
}

export function setValueAtContentPath(content, contentPath, value) {
  const segments = contentPath.split('.').filter(Boolean)
  if (segments.length === 0) return false

  let cursor = content

  for (let i = 0; i < segments.length; i += 1) {
    const segment = segments[i]
    const match = /^([^.\[]+)(?:\[(id|index)=([^\]]+)\])?$/.exec(segment)
    if (!match) return false

    const [, key, selectorType, selectorValue] = match
    const isLast = i === segments.length - 1

    if (isLast) {
      if (!(key in cursor)) return false
      if (typeof cursor[key] !== 'string') return false
      cursor[key] = value
      return true
    }

    if (!(key in cursor)) return false
    let next = cursor[key]

    if (selectorType === 'id') {
      if (!Array.isArray(next)) return false
      next = next.find((item) => item && item.id === selectorValue)
      if (!next) return false
    }

    if (selectorType === 'index') {
      if (!Array.isArray(next)) return false
      const idx = Number(selectorValue)
      next = next[idx]
      if (!next) return false
    }

    if (!next || typeof next !== 'object') return false
    cursor = next
  }

  return false
}

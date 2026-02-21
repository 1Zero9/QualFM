import fs from 'node:fs/promises'
import path from 'node:path'

export const CONTENT_FILE = path.resolve(process.cwd(), 'content/site-content.json')
export const EXPORT_FILE = path.resolve(process.cwd(), 'content/builder-content-pack.csv')
export const GUIDE_FILE = path.resolve(process.cwd(), 'content/builder-content-pack.md')

const EDITABLE_ROOTS = new Set([
  'home',
  'about',
  'services',
  'contact',
  'privacyPolicy',
  'termsConditions',
  'clients'
])

const NON_EDITABLE_LEAF_KEYS = new Set([
  'websiteUrl',
  'logoSrc',
  'subjectTemplate',
  'subjectFallback'
])

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
    .replace(/\[index=([^\]]+)\]/g, '.IDX_$1')
    .replace(/[^A-Za-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toUpperCase()
}

function rootSegment(contentPath) {
  const parts = String(contentPath).split('.').filter(Boolean)
  return parts.length > 0 ? parts[0] : ''
}

function lastSegment(contentPath) {
  const parts = String(contentPath).split('.').filter(Boolean)
  return parts.length > 0 ? parts[parts.length - 1] : ''
}

function cleanLeafName(segment) {
  const match = /^([^[.]+)/.exec(segment)
  return match ? match[1] : segment
}

function blockPathFromContentPath(contentPath) {
  const parts = String(contentPath).split('.').filter(Boolean)
  if (parts.length <= 1) return String(contentPath)
  return parts.slice(0, -1).join('.')
}

function blockLabel(blockPath) {
  return String(blockPath)
    .split('.')
    .filter(Boolean)
    .slice(1)
    .map((part) => part.replace(/\[(id|index)=([^\]]+)\]/g, ' $2'))
    .join(' > ')
    .replace(/\s+/g, ' ')
    .trim()
}

function isEditablePath(contentPath) {
  const root = rootSegment(contentPath)
  if (!EDITABLE_ROOTS.has(root)) return false

  if (String(contentPath).startsWith('pageRegistry.')) return false

  const leaf = cleanLeafName(lastSegment(contentPath))
  if (NON_EDITABLE_LEAF_KEYS.has(leaf)) return false

  return true
}

export function makeStableId(contentPath) {
  const tokens = String(contentPath)
    .split('.')
    .map((part) => toToken(part))
    .filter(Boolean)

  return tokens.join('.')
}

export function flattenContent(content) {
  const rows = []

  function walk(node, basePath = '') {
    if (typeof node === 'string') {
      if (!isEditablePath(basePath)) return

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

function buildKeyedFields(rows) {
  const raw = rows
    .slice()
    .sort((a, b) => a.content_path.localeCompare(b.content_path))
    .map((row) => ({
      keyBase: toToken(lastSegment(row.content_path)),
      currentText: row.current_text,
      contentPath: row.content_path
    }))

  const counts = raw.reduce((acc, item) => {
    acc[item.keyBase] = (acc[item.keyBase] || 0) + 1
    return acc
  }, {})

  const seen = {}

  return raw.map((item) => {
    seen[item.keyBase] = (seen[item.keyBase] || 0) + 1
    const suffix = counts[item.keyBase] > 1 ? `_${String(seen[item.keyBase]).padStart(2, '0')}` : ''

    return {
      key: `${item.keyBase}${suffix}`,
      currentText: item.currentText,
      contentPath: item.contentPath
    }
  })
}

function blockRowsFromFlatRows(flatRows) {
  const grouped = new Map()

  flatRows.forEach((row) => {
    const blockPath = blockPathFromContentPath(row.content_path)
    if (!grouped.has(blockPath)) grouped.set(blockPath, [])
    grouped.get(blockPath).push(row)
  })

  return Array.from(grouped.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([path, rows]) => {
      const keyedFields = buildKeyedFields(rows)
      const currentLines = keyedFields.map((field) => `${field.key}: ${field.currentText}`)

      return {
        id: `BLOCK:${path}`,
        page: rows[0]?.page ?? 'GENERAL',
        section: rows[0]?.section ?? 'GENERAL',
        block: blockLabel(path) || (rows[0]?.section ?? 'GENERAL'),
        current_block_text: currentLines.join('\n')
      }
    })
}

export function stringifyCsv(flatRows) {
  const rows = blockRowsFromFlatRows(flatRows)
  const headers = [
    'id',
    'page',
    'section',
    'block',
    'current_block_text',
    'client_new_block_text',
    'notes'
  ]

  const escapeCell = (value) => {
    const raw = String(value ?? '')
    if (/[,"\n]/.test(raw)) {
      return `"${raw.replace(/"/g, '""')}"`
    }
    return raw
  }

  const lines = [headers.join(',')]
  rows.forEach((row) => {
    lines.push(
      [
        row.id,
        row.page,
        row.section,
        row.block,
        row.current_block_text,
        '',
        ''
      ]
        .map((value) => escapeCell(value))
        .join(',')
    )
  })

  lines.push('APPENDIX.NEW_01,APPENDIX,NEW_REQUEST,New request,,,')
  lines.push('APPENDIX.NEW_02,APPENDIX,NEW_REQUEST,New request,,,')

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

    if (char === '\r') continue

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
    const match = /^([^[.]+)(?:\[(id|index)=([^]]+)\])?$/.exec(segment)
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

function parseBlockText(blockText) {
  const values = {}
  let activeKey = ''

  String(blockText).split(/\r?\n/).forEach((line) => {
    const match = /^([A-Z0-9_]+):\s*(.*)$/.exec(line)
    if (match) {
      activeKey = match[1]
      values[activeKey] = match[2]
      return
    }

    if (activeKey) {
      values[activeKey] = `${values[activeKey]}\n${line}`
    }
  })

  return values
}

export function applyClientCsv(content, csvRows) {
  let updates = 0
  const skipped = []
  const appendix = []

  const flatRows = flattenContent(content)
  const blockMap = new Map()

  flatRows.forEach((row) => {
    const blockPath = blockPathFromContentPath(row.content_path)
    if (!blockMap.has(blockPath)) blockMap.set(blockPath, [])
    blockMap.get(blockPath).push(row)
  })

  csvRows.forEach((row) => {
    const id = (row.id ?? '').trim()
    if (!id) return

    if (id.startsWith('APPENDIX.')) {
      const notes = (row.notes ?? '').trim()
      const text = (row.client_new_block_text ?? '').trim()
      if (text || notes) {
        appendix.push({ id, text, notes })
      }
      return
    }

    if (!id.startsWith('BLOCK:')) {
      skipped.push({ id, reason: 'unsupported id format' })
      return
    }

    const blockText = (row.client_new_block_text ?? '').trim()
    if (!blockText) return

    const blockPath = id.slice('BLOCK:'.length)
    const blockRows = blockMap.get(blockPath) || []

    if (blockRows.length === 0) {
      skipped.push({ id, reason: 'block not found' })
      return
    }

    const keyedFields = buildKeyedFields(blockRows)
    const keyToPath = keyedFields.reduce((acc, field) => {
      acc[field.key] = field.contentPath
      return acc
    }, {})

    const editedValues = parseBlockText(blockText)
    Object.entries(editedValues).forEach(([key, value]) => {
      const contentPath = keyToPath[key]
      if (!contentPath) {
        skipped.push({ id, reason: `unknown key ${key}` })
        return
      }

      if (!setValueAtContentPath(content, contentPath, String(value).trim())) {
        skipped.push({ id, reason: `unable to map ${contentPath}` })
        return
      }

      updates += 1
    })
  })

  return { updates, skipped, appendix }
}

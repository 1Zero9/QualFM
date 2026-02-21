import type { SiteContent } from '../content/siteContent'

export type FlatContentRow = {
  id: string
  page: string
  section: string
  label: string
  current_text: string
  content_path: string
}

type CsvRow = Record<string, string>

type KeyedField = {
  key: string
  currentText: string
  contentPath: string
}

export type BlockRow = {
  id: string
  page: string
  section: string
  block: string
  current_block_text: string
}

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

function toToken(value: string) {
  return value
    .replace(/\[id=([^\]]+)\]/g, '.$1')
    .replace(/\[index=([^\]]+)\]/g, '.IDX_$1')
    .replace(/[^A-Za-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toUpperCase()
}

function lastSegment(contentPath: string) {
  const parts = contentPath.split('.').filter(Boolean)
  return parts.length > 0 ? parts[parts.length - 1] : ''
}

function blockPathFromContentPath(contentPath: string) {
  const parts = contentPath.split('.').filter(Boolean)
  if (parts.length <= 1) return contentPath
  return parts.slice(0, -1).join('.')
}

function rootSegment(contentPath: string) {
  const parts = contentPath.split('.').filter(Boolean)
  return parts.length > 0 ? parts[0] : ''
}

function cleanLeafName(segment: string) {
  const match = /^([^[.]+)/.exec(segment)
  return match ? match[1] : segment
}

function isEditablePath(contentPath: string) {
  const root = rootSegment(contentPath)
  if (!EDITABLE_ROOTS.has(root)) return false

  if (contentPath.startsWith('pageRegistry.')) return false

  const leaf = cleanLeafName(lastSegment(contentPath))
  if (NON_EDITABLE_LEAF_KEYS.has(leaf)) return false

  return true
}

function blockLabel(blockPath: string) {
  return blockPath
    .split('.')
    .filter(Boolean)
    .slice(1)
    .map((part) => part.replace(/\[(id|index)=([^\]]+)\]/g, ' $2'))
    .join(' > ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function makeStableId(contentPath: string) {
  return contentPath
    .split('.')
    .map((part) => toToken(part))
    .filter(Boolean)
    .join('.')
}

function buildKeyedFields(rows: FlatContentRow[]): KeyedField[] {
  const raw = rows
    .slice()
    .sort((a, b) => a.content_path.localeCompare(b.content_path))
    .map((row) => ({
      keyBase: toToken(lastSegment(row.content_path)),
      currentText: row.current_text,
      contentPath: row.content_path
    }))

  const counts = raw.reduce<Record<string, number>>((acc, item) => {
    acc[item.keyBase] = (acc[item.keyBase] || 0) + 1
    return acc
  }, {})

  const seen: Record<string, number> = {}

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

function rowsForBlockPath(content: SiteContent, blockPath: string) {
  return flattenContent(content).filter((row) => blockPathFromContentPath(row.content_path) === blockPath)
}

export function flattenContent(content: SiteContent): FlatContentRow[] {
  const rows: FlatContentRow[] = []

  const walk = (node: unknown, basePath = '') => {
    if (typeof node === 'string') {
      if (!isEditablePath(basePath)) return

      const parts = basePath.split('.').filter(Boolean)
      const page = parts[0] ? toToken(parts[0]) : 'GENERAL'
      const section = parts[1] ? toToken(parts[1]) : 'GENERAL'
      const lastPart = parts.length > 0 ? parts[parts.length - 1] : ''
      const label = lastPart ? toToken(lastPart) : 'TEXT'

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
        if (item && typeof item === 'object' && 'id' in item && typeof item.id === 'string') {
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

function blockRowsFromFlatRows(flatRows: FlatContentRow[]): BlockRow[] {
  const grouped = new Map<string, FlatContentRow[]>()

  flatRows.forEach((row) => {
    const blockPath = blockPathFromContentPath(row.content_path)
    if (!grouped.has(blockPath)) grouped.set(blockPath, [])
    grouped.get(blockPath)?.push(row)
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

export function getEditableBlocks(flatRows: FlatContentRow[]): BlockRow[] {
  return blockRowsFromFlatRows(flatRows)
}

export function toClientPackCsv(flatRows: FlatContentRow[]) {
  const blockRows = blockRowsFromFlatRows(flatRows)
  const headers = [
    'id',
    'page',
    'section',
    'block',
    'current_block_text',
    'client_new_block_text',
    'notes'
  ]

  const escapeCell = (value: string) => {
    if (/[,"\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`
    return value
  }

  const lines = [headers.join(',')]

  blockRows.forEach((row) => {
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

export function parseCsv(csvText: string): CsvRow[] {
  const rows: string[][] = []
  let row: string[] = []
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
    const mapped: CsvRow = {}
    headers.forEach((header, index) => {
      mapped[header] = cells[index] ?? ''
    })
    return mapped
  })
}

function setValueAtPath(content: SiteContent, contentPath: string, value: string): boolean {
  const segments = contentPath.split('.').filter(Boolean)
  let cursor: unknown = content

  for (let i = 0; i < segments.length; i += 1) {
    const segment = segments[i]
    const match = /^([^[.]+)(?:\[(id|index)=([^]]+)\])?$/.exec(segment)
    if (!match || !cursor || typeof cursor !== 'object') return false

    const [, key, selectorType, selectorValue] = match
    const current = cursor as Record<string, unknown>
    const isLast = i === segments.length - 1

    if (isLast) {
      if (!(key in current) || typeof current[key] !== 'string') return false
      current[key] = value
      return true
    }

    if (!(key in current)) return false
    let next: unknown = current[key]

    if (selectorType === 'id') {
      if (!Array.isArray(next)) return false
      next = next.find((item) => item && typeof item === 'object' && 'id' in item && (item as { id: string }).id === selectorValue)
    }

    if (selectorType === 'index') {
      if (!Array.isArray(next)) return false
      next = next[Number(selectorValue)]
    }

    cursor = next
  }

  return false
}

function parseBlockText(blockText: string) {
  const values: Record<string, string> = {}
  let activeKey = ''

  blockText.split(/\r?\n/).forEach((line) => {
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

export function applyClientCsv(content: SiteContent, csvRows: CsvRow[]) {
  let updates = 0
  const skipped: string[] = []
  const appendix: string[] = []

  csvRows.forEach((row) => {
    const id = (row.id ?? '').trim()
    if (!id) return

    if (id.startsWith('APPENDIX.')) {
      const notes = (row.notes ?? '').trim()
      const text = (row.client_new_block_text ?? '').trim()
      if (text || notes) {
        appendix.push(`${id}: ${text || '(no text)'}${notes ? ` | Notes: ${notes}` : ''}`)
      }
      return
    }

    if (!id.startsWith('BLOCK:')) {
      skipped.push(`${id} (unsupported id format)`)
      return
    }

    const blockText = (row.client_new_block_text ?? '').trim()
    if (!blockText) return

    const blockPath = id.slice('BLOCK:'.length)
    const blockRows = rowsForBlockPath(content, blockPath)

    if (blockRows.length === 0) {
      skipped.push(`${id} (block not found)`)
      return
    }

    const keyedFields = buildKeyedFields(blockRows)
    const keyToPath = keyedFields.reduce<Record<string, string>>((acc, field) => {
      acc[field.key] = field.contentPath
      return acc
    }, {})

    const editedValues = parseBlockText(blockText)
    Object.entries(editedValues).forEach(([key, value]) => {
      const contentPath = keyToPath[key]
      if (!contentPath) {
        skipped.push(`${id} (unknown key ${key})`)
        return
      }

      if (!setValueAtPath(content, contentPath, value.trim())) {
        skipped.push(`${id} (${contentPath})`)
        return
      }

      updates += 1
    })
  })

  return { updates, skipped, appendix }
}

export function buildClientGuide(rowCount: number) {
  return `# QualFM Content Builder Pack\n\nThis CSV is grouped by editable content blocks.\n\nHow clients should edit:\n1. Work one block row at a time.\n2. Copy current_block_text into client_new_block_text.\n3. Edit only the wording after each KEY: label.\n4. Do not change KEY labels (TITLE:, BODY:, TEXT_01:, etc).\n5. For new pages/sections/removals, use APPENDIX.NEW_* rows and notes.\n\nRows available: ${rowCount}\n`
}

export function buildImportReport(updates: number, skipped: string[], appendix: string[]) {
  const lines = [
    '# Import Report',
    '',
    `Updated entries: ${updates}`,
    `Skipped entries: ${skipped.length}`,
    `Appendix requests: ${appendix.length}`,
    ''
  ]

  if (skipped.length > 0) {
    lines.push('## Skipped')
    skipped.forEach((item) => lines.push(`- ${item}`))
    lines.push('')
  }

  if (appendix.length > 0) {
    lines.push('## Appendix Requests')
    appendix.forEach((item) => lines.push(`- ${item}`))
    lines.push('')
  }

  return `${lines.join('\n')}\n`
}

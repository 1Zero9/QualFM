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

function toToken(value: string) {
  return value
    .replace(/\[id=([^\]]+)\]/g, '.$1')
    .replace(/[^A-Za-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toUpperCase()
}

export function makeStableId(contentPath: string) {
  return contentPath
    .split('.')
    .map((part) => toToken(part))
    .filter(Boolean)
    .join('.')
}

export function flattenContent(content: SiteContent): FlatContentRow[] {
  const rows: FlatContentRow[] = []

  const walk = (node: unknown, basePath = '') => {
    if (typeof node === 'string') {
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

export function toClientPackCsv(rows: FlatContentRow[]) {
  const headers = ['id', 'page', 'section', 'label', 'current_text', 'client_new_text', 'status', 'notes', 'content_path']

  const escapeCell = (value: string) => {
    if (/[,"\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`
    return value
  }

  const lines = [headers.join(',')]

  rows.forEach((row) => {
    lines.push(
      [
        row.id,
        row.page,
        row.section,
        row.label,
        row.current_text,
        '',
        'KEEP',
        '',
        row.content_path
      ]
        .map((value) => escapeCell(value))
        .join(',')
    )
  })

  lines.push('APPENDIX.NEW_01,APPENDIX,NEW_REQUEST,TEXT,,,NEW_REQUEST,,')
  lines.push('APPENDIX.NEW_02,APPENDIX,NEW_REQUEST,TEXT,,,NEW_REQUEST,,')

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
    const match = /^([^.\[]+)(?:\[(id|index)=([^\]]+)\])?$/.exec(segment)
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

export function applyClientCsv(content: SiteContent, csvRows: CsvRow[]) {
  let updates = 0
  const skipped: string[] = []
  const appendix: string[] = []

  csvRows.forEach((row) => {
    const id = (row.id ?? '').trim()
    const contentPath = (row.content_path ?? '').trim()
    const status = (row.status ?? '').trim().toUpperCase()
    const newText = (row.client_new_text ?? '').trim()

    if (!id) return

    if (id.startsWith('APPENDIX.') || status === 'NEW_REQUEST' || !contentPath) {
      if (newText || (row.notes ?? '').trim()) {
        appendix.push(`${id}: ${newText || '(no text)'}${row.notes ? ` | Notes: ${row.notes}` : ''}`)
      }
      return
    }

    if (!newText || newText === (row.current_text ?? '').trim()) return

    if (!setValueAtPath(content, contentPath, newText)) {
      skipped.push(`${id} (${contentPath})`)
      return
    }

    updates += 1
  })

  return { updates, skipped, appendix }
}

export function buildClientGuide(rowCount: number) {
  return `# QualFM Client Content Pack\n\n1. Edit only the client_new_text column for rows you want changed.\n2. Keep id and content_path unchanged.\n3. Use APPENDIX.NEW_* rows for net-new page/section requests.\n4. You can also use the Page Registry tab in Admin for planned/removed pages.\n\nRows available: ${rowCount}\n`
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

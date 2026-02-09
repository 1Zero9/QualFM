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

type BlockField = {
  key: string
  currentText: string
  contentPath: string
}

type BlockRow = {
  id: string
  page: string
  section: string
  block: string
  current_block_text: string
  field_map: string
}

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

function blockRowsFromFlatRows(flatRows: FlatContentRow[]): BlockRow[] {
  const grouped = new Map<string, { page: string; section: string; fields: BlockField[] }>()

  flatRows.forEach((row) => {
    const blockPath = blockPathFromContentPath(row.content_path)
    if (!grouped.has(blockPath)) {
      grouped.set(blockPath, {
        page: row.page,
        section: row.section,
        fields: []
      })
    }

    const group = grouped.get(blockPath)
    if (!group) return

    group.fields.push({
      key: toToken(lastSegment(row.content_path)),
      currentText: row.current_text,
      contentPath: row.content_path
    })
  })

  return Array.from(grouped.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([path, group]) => {
      const fieldMap: Record<string, string> = {}
      const currentLines: string[] = []

      group.fields.forEach((field, index) => {
        const suffix = group.fields.filter((item) => item.key === field.key).length > 1 ? `_${String(index + 1).padStart(2, '0')}` : ''
        const key = `${field.key}${suffix}`
        fieldMap[key] = field.contentPath
        currentLines.push(`${key}: ${field.currentText}`)
      })

      return {
        id: `BLOCK.${makeStableId(path)}`,
        page: group.page,
        section: group.section,
        block: blockLabel(path) || group.section,
        current_block_text: currentLines.join('\n'),
        field_map: JSON.stringify(fieldMap)
      }
    })
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
    'status',
    'notes',
    'field_map'
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
        'KEEP',
        '',
        row.field_map
      ]
        .map((value) => escapeCell(value))
        .join(',')
    )
  })

  lines.push('APPENDIX.NEW_01,APPENDIX,NEW_REQUEST,New request,,,,NEW_REQUEST,,')
  lines.push('APPENDIX.NEW_02,APPENDIX,NEW_REQUEST,New request,,,,NEW_REQUEST,,')

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
    const status = (row.status ?? '').trim().toUpperCase()

    if (!id) return

    if (id.startsWith('APPENDIX.') || status === 'NEW_REQUEST') {
      const newText = (row.client_new_block_text ?? row.client_new_text ?? '').trim()
      if (newText || (row.notes ?? '').trim()) {
        appendix.push(`${id}: ${newText || '(no text)'}${row.notes ? ` | Notes: ${row.notes}` : ''}`)
      }
      return
    }

    const blockText = (row.client_new_block_text ?? '').trim()
    if (!blockText) return

    let fieldMap: Record<string, string>
    try {
      fieldMap = JSON.parse(row.field_map ?? '{}') as Record<string, string>
    } catch {
      skipped.push(`${id} (invalid field_map)`)
      return
    }

    const editedValues = parseBlockText(blockText)
    Object.entries(editedValues).forEach(([key, value]) => {
      const path = fieldMap[key]
      if (!path) {
        skipped.push(`${id} (unknown key ${key})`)
        return
      }

      if (!setValueAtPath(content, path, value.trim())) {
        skipped.push(`${id} (${path})`)
        return
      }

      updates += 1
    })
  })

  return { updates, skipped, appendix }
}

export function buildClientGuide(rowCount: number) {
  return `# QualFM Client Content Pack (Block Format)\n\nThis version is grouped by section blocks to make editing easier.\n\nHow to edit:\n1. Review one row (block) at a time.\n2. Copy current_block_text into client_new_block_text.\n3. Edit only the text after each KEY: label.\n4. Keep KEY labels unchanged (example: TITLE:, BODY:, TEXT_01:).\n5. Use APPENDIX.NEW_* rows for new pages/sections or removals.\n\nRows available: ${rowCount}\n`}

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

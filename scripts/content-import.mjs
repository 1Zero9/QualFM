import fs from 'node:fs/promises'
import path from 'node:path'
import {
  EXPORT_FILE,
  parseCsv,
  loadContent,
  saveContent,
  setValueAtContentPath
} from './content-pack-utils.mjs'

const csvPath = process.argv[2]
  ? path.resolve(process.cwd(), process.argv[2])
  : EXPORT_FILE

const csvText = await fs.readFile(csvPath, 'utf8')
const rows = parseCsv(csvText)
const content = await loadContent()

let updates = 0
const skipped = []
const appendix = []

for (const row of rows) {
  const id = (row.id ?? '').trim()
  const status = (row.status ?? '').trim().toUpperCase()
  const newText = row.client_new_text ?? ''
  const currentText = row.current_text ?? ''
  const contentPath = (row.content_path ?? '').trim()

  if (!id) continue

  if (id.startsWith('APPENDIX.') || status === 'NEW_REQUEST' || !contentPath) {
    if (newText.trim() || (row.notes ?? '').trim()) {
      appendix.push({ id, text: newText.trim(), notes: (row.notes ?? '').trim() })
    }
    continue
  }

  if (!newText.trim() || newText === currentText) {
    continue
  }

  const ok = setValueAtContentPath(content, contentPath, newText)
  if (!ok) {
    skipped.push({ id, reason: `Unable to map content_path: ${contentPath}` })
    continue
  }

  updates += 1
}

await saveContent(content)

const reportLines = [
  '# Content Import Report',
  '',
  `CSV file: ${csvPath}`,
  `Updated entries: ${updates}`,
  `Skipped entries: ${skipped.length}`,
  `Appendix requests: ${appendix.length}`,
  ''
]

if (skipped.length > 0) {
  reportLines.push('## Skipped')
  skipped.forEach((item) => reportLines.push(`- ${item.id}: ${item.reason}`))
  reportLines.push('')
}

if (appendix.length > 0) {
  reportLines.push('## Appendix Requests')
  appendix.forEach((item) => {
    const summary = item.text || '(no text provided)'
    const notes = item.notes ? ` | Notes: ${item.notes}` : ''
    reportLines.push(`- ${item.id}: ${summary}${notes}`)
  })
  reportLines.push('')
}

const reportPath = path.resolve(process.cwd(), 'content/last-import-report.md')
await fs.writeFile(reportPath, `${reportLines.join('\n')}\n`, 'utf8')

console.log(`Applied ${updates} updates to content/site-content.json`)
console.log(`Skipped ${skipped.length} updates`)
console.log(`Captured ${appendix.length} appendix requests`)
console.log(`Wrote report to ${reportPath}`)

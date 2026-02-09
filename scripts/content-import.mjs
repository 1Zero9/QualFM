import fs from 'node:fs/promises'
import path from 'node:path'
import {
  EXPORT_FILE,
  parseCsv,
  loadContent,
  saveContent,
  applyClientCsv
} from './content-pack-utils.mjs'

const csvPath = process.argv[2]
  ? path.resolve(process.cwd(), process.argv[2])
  : EXPORT_FILE

const csvText = await fs.readFile(csvPath, 'utf8')
const rows = parseCsv(csvText)
const content = await loadContent()

const summary = applyClientCsv(content, rows)

await saveContent(content)

const reportLines = [
  '# Content Import Report',
  '',
  `CSV file: ${csvPath}`,
  `Updated entries: ${summary.updates}`,
  `Skipped entries: ${summary.skipped.length}`,
  `Appendix requests: ${summary.appendix.length}`,
  ''
]

if (summary.skipped.length > 0) {
  reportLines.push('## Skipped')
  summary.skipped.forEach((item) => reportLines.push(`- ${item.id}: ${item.reason}`))
  reportLines.push('')
}

if (summary.appendix.length > 0) {
  reportLines.push('## Appendix Requests')
  summary.appendix.forEach((item) => {
    const summaryText = item.text || '(no text provided)'
    const notes = item.notes ? ` | Notes: ${item.notes}` : ''
    reportLines.push(`- ${item.id}: ${summaryText}${notes}`)
  })
  reportLines.push('')
}

const reportPath = path.resolve(process.cwd(), 'content/last-import-report.md')
await fs.writeFile(reportPath, `${reportLines.join('\n')}\n`, 'utf8')

console.log(`Applied ${summary.updates} updates to content/site-content.json`)
console.log(`Skipped ${summary.skipped.length} updates`)
console.log(`Captured ${summary.appendix.length} appendix requests`)
console.log(`Wrote report to ${reportPath}`)

import fs from 'node:fs/promises'
import {
  EXPORT_FILE,
  GUIDE_FILE,
  flattenContent,
  loadContent,
  stringifyCsv
} from './content-pack-utils.mjs'

const content = await loadContent()
const rows = flattenContent(content)

await fs.writeFile(EXPORT_FILE, stringifyCsv(rows), 'utf8')

const guide = `# QualFM Content Builder Pack

This file pair supports client-safe text updates without site access.

## Files
- \`builder-content-pack.csv\`: grouped block edit template for clients.
- \`site-content.json\`: source content file (internal use only).

## Client Instructions
1. Edit only \`client_new_block_text\` in rows you want changed.
2. Keep each \`KEY:\` label unchanged inside the block text.
3. Use \`notes\` for context where needed.
4. Use \`APPENDIX.NEW_*\` rows for new pages/sections/removals.

## Row Meaning
- \`id\`: block ID used for import mapping.
- \`block\`: readable section/block name.
- \`current_block_text\`: current live text for that block.
- \`client_new_block_text\`: revised block text from client.

Generated rows: ${rows.length}
`

await fs.writeFile(GUIDE_FILE, guide, 'utf8')

console.log(`Exported ${rows.length} editable entries to ${EXPORT_FILE}`)
console.log(`Wrote guide to ${GUIDE_FILE}`)

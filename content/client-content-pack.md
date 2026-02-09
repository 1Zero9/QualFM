# QualFM Client Content Pack

This file pair supports text-only updates without site access.

## Files
- `client-content-pack.csv`: edit this in Excel, Google Sheets, or Word table view.
- `site-content.json`: system source file (do not edit directly as a client).

## Client Instructions
1. Edit only `client_new_text` for rows you want changed.
2. Leave `status` as `KEEP` for no change.
3. Use `status=CHANGE` when updating an existing row.
4. Use the `APPENDIX.NEW_*` rows for any new section/content requests, new pages, or page removals.
5. Add context in `notes` where needed.

## Row Meaning
- `id`: stable content ID.
- `current_text`: current live text.
- `client_new_text`: proposed replacement.
- `content_path`: internal mapping key used for automated updates.

Generated rows: 225

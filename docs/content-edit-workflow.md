# Client Content Workflow (No Site Access)

This workflow lets clients propose text changes without editing the live site.

## Source Of Truth
- All editable website content now lives in `content/site-content.json`.
- React pages read from that file through `src/content/siteContent.ts`.

## Export Client Pack
Run:

```bash
npm run content:export
```

This generates:
- `content/client-content-pack.csv`
- `content/client-content-pack.md`

## Send To Client
Send the CSV plus a short instruction:
- Edit only `client_new_text` for existing content updates.
- Keep `id` and `content_path` unchanged.
- Use `APPENDIX.NEW_*` rows for brand-new section requests.

## Import Client Changes
After receiving the edited CSV, run:

```bash
npm run content:import
```

Optional custom CSV path:

```bash
npm run content:import -- ./path/to/edited-pack.csv
```

Import output:
- Updates `content/site-content.json` for mapped edits.
- Writes `content/last-import-report.md` with:
  - applied changes
  - skipped rows
  - appendix requests

## Delivery Process
1. `npm run content:export`
2. Send `content/client-content-pack.csv` to client.
3. Receive edited CSV.
4. `npm run content:import -- <edited-file>`
5. Review `content/last-import-report.md`.
6. Build and deploy.

## Admin Panel Option
- The `/admin` panel now includes:
- `Content Pack` tab:
- Download client pack CSV and guide.
- Upload returned CSV and export an updated `site-content.json` plus report.
- `Page Registry` tab:
- Track page lifecycle (`active`, `planned`, `removed`).
- Add new page requests and export the updated page registry JSON.
- Admin auth now uses server API routes with signed HttpOnly sessions.
- Set server environment variables:
- `ADMIN_SESSION_SECRET` (required, long random secret).
- `ADMIN_PASSWORD_SHA256` (preferred), or `ADMIN_PASSWORD` (fallback).

## ID Stability Rules
- Existing row IDs are stable and should not be changed.
- Reordering array items with IDs in `site-content.json` is safe.
- Removing IDs from repeatable items will break import mapping.

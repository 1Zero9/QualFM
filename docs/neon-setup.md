# Neon Database Setup

This project stores customer content-change requests in Neon Postgres via `api/changes`.

## 1. Create/confirm Neon project
Use your Neon project (for example: `square-butterfly-64439905`) and open the SQL editor.

## 2. Run schema SQL
Copy/paste and run the SQL from:

- `db/neon-init.sql`

This creates table `public.change_requests` and indexes.

## 3. Add Vercel environment variables
In Vercel project settings, set:

- `DATABASE_URL` = Neon pooled connection string (recommended)

Fallback accepted by code:

- `NEON_DATABASE_URL`

## 4. Redeploy
After setting env vars, redeploy the site so serverless functions load them.

## 5. Verify API connectivity
Run:

```bash
curl -i https://qual-fm.vercel.app/api/changes
```

Expected without login:

- `401 Not authenticated` (this confirms API is alive)

After logging in as owner/client admin, requests should persist and survive redeploys.

### Completion Record
- Neon setup completed and verified on **February 21, 2026**.
- End-to-end smoke test passed against live Neon:
  - client admin login
  - `POST /api/changes` submit
  - owner login
  - `PUT /api/changes` approve
  - `GET /api/changes` confirmed persisted `approved` status
- Verification timestamp (UTC): `2026-02-21T20:37:12.466Z`

## 6. Optional local testing
Create `.env.local` (not committed) with:

```bash
DATABASE_URL=postgresql://...
ADMIN_SESSION_SECRET=...
OWNER_USERNAME=owner
OWNER_PASSWORD=...
CLIENT_ADMIN_USERNAME=client_admin
CLIENT_ADMIN_PASSWORD=...
```

Then run `npm run dev`.

# Client Portal + Builder Playbook

This playbook explains how the QualFM project was transformed from static content updates into a role-based client portal with admin review and Neon persistence.

Use this as a repeatable blueprint for another website.

## 1. Goals

- Let clients request content changes without editing code/CMS.
- Keep admins in control with approve/reject workflow.
- Maintain secure login with role-based access (`admin`, `client`).
- Persist change requests in Postgres (Neon), not in-memory.
- Preserve optional export/import for offline workflows.

## 2. Final Architecture

### Frontend (React + Vite)

- `Admin` area at `/admin` for:
  - reviewing client requests
  - approving/rejecting requests
  - optional builder CSV export/import
  - page planning registry
- `Client Portal` at `/portal` for:
  - submitting changes directly per section/block
  - tracking request status
- Builder visual markers shown on site pages when logged in.

### Backend (Vercel Serverless Functions)

- Auth endpoints:
  - `POST /api/auth/login`
  - `GET /api/auth/session`
  - `POST /api/auth/logout`
- Change request endpoints:
  - `GET /api/changes`
  - `POST /api/changes`
  - `PUT /api/changes`
- DB layer with pooled Postgres connection:
  - `api/_db.js`

### Database (Neon Postgres)

- Table: `public.change_requests`
- Schema file: `db/neon-init.sql`

## 3. Data Model Strategy

Content remains source-of-truth in `content/site-content.json`, but the UI exposes **blocks** (not raw key paths) to clients.

Key idea:

- Human-facing: page + section + current text.
- System-facing: stable block IDs (e.g. `BLOCK:home.hero`) for mapping.

This keeps UX simple while preserving deterministic update mapping.

Customer-facing selector model:

- Page -> Section -> Paragraph
- Technical keys are hidden from clients (`GROUP_03`, `POINT_07`, etc.).
- Paragraph options include short preview text to reduce mistakes.

## 4. Security Model

### Session

- Cookie: HttpOnly + SameSite=Strict
- `Secure` is enabled in production/HTTPS and can be disabled for local HTTP dev (`COOKIE_SECURE=false`).
- Session token signed with HMAC SHA-256
- Role included in signed payload (`admin` or `client`)
- Session validated server-side on each API call

### Credentials

Supported env patterns:

- Admin:
  - `ADMIN_USERNAME` (default `admin`)
  - `ADMIN_PASSWORD_SHA256` (recommended) or `ADMIN_PASSWORD`
- Client:
  - `CLIENT_USERNAME` (default `client`)
  - `CLIENT_PASSWORD_SHA256` (recommended) or `CLIENT_PASSWORD`

### Hardening done

- Removed obsolete `/api/admin/*` endpoints to reduce attack surface.
- Removed raw DB error leakage from API responses.
- Added `.gitignore` rules for `.env*` and generated content artifacts.
- Added malformed-cookie parsing fallback to prevent auth handler crashes.
- Added login-attempt map pruning/cap to avoid unbounded in-memory growth.

## 5. API Design

### `POST /api/auth/login`

Request:

```json
{
  "username": "client",
  "password": "...",
  "expectedRole": "client"
}
```

Behavior:

- Validates credentials.
- Enforces optional role match.
- Sets signed session cookie.

### `GET /api/auth/session`

Returns active role/username if cookie is valid.

### `POST /api/auth/logout`

Clears session cookie.

### `GET /api/changes`

- Admin: returns all requests.
- Client: returns only their own requests.

### `POST /api/changes`

Creates request with status `pending`.

### `PUT /api/changes`

Admin-only status transition: `pending` -> `approved`/`rejected`.

### `GET /api/admin-docs/*`

- Admin-only documentation gateway.
- Serves files from `public/admin-docs` only when signed admin session is valid.
- Redirects unauthorized requests to `/admin`.

## 5.1 Quality Hardening Update (2026-02-21)

### Reliability + UX

- Added `try/catch` handling for admin/client request fetch and submit paths.
- Replaced fixed-index rendering in content-heavy pages with safe `.map()` rendering.

### SEO + Routing

- Removed duplicate app-route branching that bypassed SEO updates.
- Ensured `SeoManager` runs for all routes, including `/admin` and `/portal`.
- Added `noindex` metadata for `/portal`.
- Added `Disallow: /portal` in `robots.txt`.

### Tooling

- Added ESLint v9 flat config (`eslint.config.js`) so `npm run lint` is active again.
- Resolved baseline lint issues in content pack utilities and error boundary.

## 6. Neon Integration

### Code

- `api/_db.js` creates/reuses pooled `pg` connection.
- `api/changes.js` uses SQL queries for CRUD.

### SQL bootstrap

Run once in Neon SQL editor:

- `db/neon-init.sql`

### Required env

- `DATABASE_URL` (recommended pooled Neon connection string)
- Fallback: `NEON_DATABASE_URL`

## 7. Frontend UX Decisions

### Why clients avoid CSV by default

CSV was too technical and too granular.

Portal UX replaced this with:

- choose page
- choose section (plain language labels)
- choose paragraph (numbered + preview)
- see current text
- submit replacement text

### Dropdown simplification

- Replaced raw block dropdown with two-step selection:
  - `Section` selector
  - `Paragraph` selector
- Added section search using user-friendly section names.
- Removed technical path labels from customer UI.

### Portal session safety

- Client portal session shows a visible countdown timer.
- Auto-logout runs after 10 minutes of inactivity.
- Warning appears in final 2 minutes with:
  - `Add 10 Minutes`
  - `Log Out Now`

### Builder markers

- Visible only for active admin/client session.
- Show block mapping reference on pages.
- Includes “Copy ID” action for internal use.

## 8. Implementation Sequence (Reusable)

For another site, follow this order:

1. Normalize content into a structured source (JSON/CMS blocks).
2. Introduce stable block IDs for editable regions.
3. Build server-side auth endpoints with signed session cookie.
4. Add `admin` + `client` roles.
5. Create client portal submit flow.
6. Create admin review queue.
7. Add DB persistence (Neon table + queries).
8. Add optional export/import as fallback.
9. Add visual builder indicators for internal mapping.
10. Remove legacy auth routes and sensitive error output.

## 9. Environment Variable Checklist

Set in Vercel:

- `ADMIN_SESSION_SECRET`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD_SHA256` or `ADMIN_PASSWORD`
- `CLIENT_USERNAME`
- `CLIENT_PASSWORD_SHA256` or `CLIENT_PASSWORD`
- `DATABASE_URL`

Optional for local dev:

- `COOKIE_SECURE=false` (only for local HTTP development)

## 10. Verification Checklist

### Auth

- `/api/auth/session` returns 401 when logged out.
- Admin login works only for admin credentials.
- Client login works only for client credentials.

### Portal

- Client can submit request.
- Client sees only their requests.
- Client can select content using `Page -> Section -> Paragraph` without technical IDs.

### Admin

- Admin sees all requests.
- Admin can approve/reject.

### Persistence

- Requests survive refresh/redeploy (Neon-backed).

### Security

- No secrets in repo.
- No `.env` files committed.
- No raw backend error details sent to browser.
- `/admin` and `/portal` are marked as non-indexable.
- `/admin-docs/*` is routed through server-side admin-role validation.

## 11. Known Limitation / Next Step

Currently approved requests are staged in admin draft flow, not auto-writing production content source.

For next iteration on another site, add:

- `content_versions` table
- publish action that commits approved changes into canonical content store
- audit trail (who approved, when, old/new payload snapshots)

## 12. Files Added/Changed (Reference)

Core implementation files:

- `api/auth/_auth.js`
- `api/auth/login.js`
- `api/auth/session.js`
- `api/auth/logout.js`
- `api/_db.js`
- `api/changes.js`
- `db/neon-init.sql`
- `src/pages/ClientPortal.tsx`
- `src/pages/ClientPortal.css`
- `src/pages/Admin.tsx`
- `src/admin/AdminSessionContext.tsx`
- `src/admin/contentPack.ts`
- `src/components/BuilderMarker.tsx`
- `docs/admin-security.md`
- `docs/neon-setup.md`

---

If you replicate this on another project, start by copying the auth + DB layers first, then adapt the block mapping to that site’s content structure.

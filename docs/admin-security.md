# Admin Security

Authentication is server-side.

## Endpoints
- `POST /api/auth/login` validates credentials and sets signed HttpOnly cookie.
- `GET /api/auth/session` verifies current session + role.
- `POST /api/auth/logout` clears session cookie.
- `GET/POST/PUT /api/changes` customer change submission + admin review queue.
- `GET /api/admin-docs/*` serves docs assets only for authenticated `owner` role.

## Environment Variables
- `ADMIN_SESSION_SECRET` (required): long random secret for signing session cookies.
- `OWNER_USERNAME` (preferred) or `ADMIN_USERNAME` (legacy fallback).
- `OWNER_PASSWORD_SHA256` (preferred) or `ADMIN_PASSWORD_SHA256` (legacy fallback).
- `OWNER_PASSWORD` (fallback plain-text) or `ADMIN_PASSWORD` (legacy fallback).
- `CLIENT_ADMIN_USERNAME` (preferred) or `CLIENT_USERNAME` (legacy fallback).
- `CLIENT_ADMIN_PASSWORD_SHA256` (preferred) or `CLIENT_PASSWORD_SHA256` (legacy fallback).
- `CLIENT_ADMIN_PASSWORD` (fallback plain-text) or `CLIENT_PASSWORD` (legacy fallback).
- `CUSTOMER_USERNAME` / `CUSTOMER_PASSWORD[_SHA256]` (optional future customer role).
- `DATABASE_URL` (recommended): Neon Postgres connection string.
- `NEON_DATABASE_URL` (fallback): alternate env name for DB connection.

## Security Controls
- HttpOnly + SameSite=Strict session cookie (`Secure` in production/HTTPS; local override supported for HTTP dev).
- Signed token (HMAC SHA-256) with expiry.
- Rate limiting for login attempts (per function instance/IP window).
- Constant-time credential comparison.
- Admin docs access is server-gated via `/api/admin-docs/*` and not directly public.

## Data Storage
- Change requests are persisted in Neon table `public.change_requests`.
- Initialize schema with `db/neon-init.sql`.

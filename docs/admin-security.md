# Admin Security

Authentication is server-side.

## Endpoints
- `POST /api/auth/login` validates credentials and sets signed HttpOnly cookie.
- `GET /api/auth/session` verifies current session + role.
- `POST /api/auth/logout` clears session cookie.
- `GET/POST/PUT /api/changes` customer change submission + admin review queue.

## Environment Variables
- `ADMIN_SESSION_SECRET` (required): long random secret for signing session cookies.
- `ADMIN_USERNAME` (optional, default `admin`)
- `ADMIN_PASSWORD_SHA256` (recommended): SHA-256 hash for admin login.
- `ADMIN_PASSWORD` (fallback): plain admin password.
- `CLIENT_USERNAME` (optional, default `client`)
- `CLIENT_PASSWORD_SHA256` (recommended): SHA-256 hash for client login.
- `CLIENT_PASSWORD` (fallback): plain client password.
- `DATABASE_URL` (recommended): Neon Postgres connection string.
- `NEON_DATABASE_URL` (fallback): alternate env name for DB connection.

## Security Controls
- HttpOnly + Secure + SameSite=Strict session cookie.
- Signed token (HMAC SHA-256) with expiry.
- Rate limiting for login attempts (per function instance/IP window).
- Constant-time credential comparison.

## Data Storage
- Change requests are persisted in Neon table `public.change_requests`.
- Initialize schema with `db/neon-init.sql`.

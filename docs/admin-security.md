# Admin Security

Admin authentication is now server-side.

## Endpoints
- `POST /api/admin/login` validates password and sets signed HttpOnly cookie.
- `GET /api/admin/session` verifies current admin session.
- `POST /api/admin/logout` clears admin session cookie.

## Environment Variables
- `ADMIN_SESSION_SECRET` (required): long random secret for signing session cookies.
- `ADMIN_PASSWORD_SHA256` (recommended): SHA-256 hex hash of admin password.
- `ADMIN_PASSWORD` (optional fallback): plain password if hash is not supplied.
- Runtime accepts either method. If both are set, either can authenticate.
- Leading/trailing whitespace in env values is trimmed automatically.

## Security Controls
- HttpOnly + Secure + SameSite=Strict session cookie.
- Signed token (HMAC SHA-256) with expiry.
- Rate limiting for login attempts (per function instance/IP window).
- Constant-time hash comparison.

## Notes
- Admin tools still run in browser, but auth is validated on the server.
- For full enterprise controls (IP allowlist, MFA, audit trail), add an identity provider or backend auth layer.

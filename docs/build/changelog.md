# Changelog

All notable changes to the QualFM website project.

---

## [Unreleased]

### Added
- Admin-only docs gateway endpoint: `GET /api/admin-docs/*`

### Changed
- Vercel rewrites now route `/admin-docs/*` through the admin-authenticated API gateway.
- Admin docs tab now loads from `/admin-docs` (protected path).
- Neon-backed request workflow verification completed on February 21, 2026.
- Introduced role naming foundation for scale: `owner`, `client_admin`, and `customer` (with backward compatibility for legacy `admin`/`client` names).
- Added `/client-admin` route as the primary client-admin portal path (`/portal` kept as legacy alias).

### Fixed
- Public direct access to documentation assets under `/admin-docs/*` is now blocked for non-admin sessions.
- Verified end-to-end persistence flow (`client submit -> admin approve -> persisted status`) against live Neon.

---

## [0.3.0] - 2026-02-21

### Added
- ESLint v9 flat config (`eslint.config.js`) to restore project linting.
- Playbook hardening notes for routing, SEO, auth cookie behavior, and reliability.
- Optional local dev env toggle: `COOKIE_SECURE=false` for HTTP-only local sessions.

### Changed
- Unified app route rendering so SEO/meta updates apply to all routes.
- Added `/portal` non-indexing controls (`robots` meta + `robots.txt` disallow).
- Updated content workflow docs to builder pack format (`client_new_block_text`).
- Replaced fixed-index content rendering in key pages with `.map()` rendering for safer content edits.

### Fixed
- Session cookies now work in local HTTP development while staying secure in production/HTTPS.
- Defensive cookie parsing now handles malformed cookie values without throwing.
- Login rate-limit tracking now prunes stale entries and caps map growth.
- Added async error handling for admin/client request operations to prevent silent failures.

## [0.2.0] - 2026-01-25

### Added
- Glass morphism design system (`src/styles/glass.css`)
  - Card variants (light, medium, heavy, dark, solid)
  - Brand color variants (navy, green)
  - Button styles
  - Input styles
  - Animation utilities
  - Stagger delay classes
- Contact page modal overlay
  - Blurred backdrop showing home page
  - Glassmorphic card styling
  - Cascading slide-up animations
  - Small logo in form
- MkDocs documentation structure
  - Project documentation
  - Design documentation
  - Build changelog
  - Time logging system

### Changed
- App.tsx routing - Home now always renders, Contact as overlay
- Contact page styling - from basic form to glassmorphic modal

### Fixed
- Unused imports causing TypeScript build error
- CSS @import order (must be first)

---

## [0.1.0] - 2026-01-XX (Prior to this session)

### Added
- Initial React + TypeScript + Vite setup
- Home page with hero and background
- Basic contact page
- Logo assets
- Brand color CSS variables
- Deployment to Vercel

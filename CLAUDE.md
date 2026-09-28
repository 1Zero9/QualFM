# QualFM Project Guidelines

QualFM Ltd is an Irish facilities-management company (founder Richard Seaver, est. Feb 2025). This repo is its **live production website** at https://www.qualfm.ie — a lead-generation brochure site whose key conversion is a contact enquiry (phone call or form). Deployed on Vercel from `main`; repo is **public** (github.com/1Zero9/QualFM), so never commit secrets or client-private material.

## Production rules

- This is a live client site. Do not push to `main`, deploy, run migrations, seed, or write to the production database without the owner's explicit say-so in that session.
- `.env.local` holds production credentials (Neon, Resend, Blob). Never run `db:seed`, `db:migrate` or anything that touches the DB unless asked. Do not print env values.
- Verify against the live site (www.qualfm.ie), not just the local build.
- Read `docs/audit-2026-07.md` (launch audit) and `docs/review-2026-09.md` (latest review, with the open-issue list) before proposing work.

## Tech Stack

- Next.js 16 (App Router, Turbopack), React 19, TypeScript 5
- Tailwind CSS v4 (tokens in `app/globals.css`, `@theme` style — no `tailwind.config`)
- Neon Postgres via `@neondatabase/serverless` + Drizzle ORM (`lib/db/schema.ts`, migrations in `db/migrations`)
- Vercel Blob for admin image uploads; Vercel Web Analytics
- Resend (HTTP API) for contact-form and magic-link email
- `marked` renders Markdown bodies for news and projects
- Hosted on Vercel. (The old Vite SPA was retired 6 July 2026 — any Vite/react-router reference is obsolete.)

## Commands

```bash
npm run dev          # local dev
npm run build        # production build (run before any PR)
npm run lint         # eslint
npm run db:generate  # drizzle-kit generate (schema -> SQL)
npm run db:migrate   # applies to whatever DATABASE_URL points at — i.e. production
npm run db:seed      # writes to the DB — do not run casually
```

No test suite and no CI exist yet.

## Structure

```
app/(site)/        public pages: /, /services, /about, /contact, /news, /projects (+[slug]), /privacy-policy, /terms
app/admin/         owner admin (magic-link login at /admin; protected area in (protected)/)
app/api/           contact + auth (request-link, verify, logout) route handlers
components/site/   header, hero, footer, cards, JSON-LD, legal page
lib/db/            Drizzle schema + client
lib/auth/          magic link, HMAC session cookie, in-memory rate limit
lib/admin/actions.ts  all admin server actions (create/edit/publish/delete + Blob upload)
lib/public-queries.ts DB reads for public pages, with fallbacks to static copy
lib/content.ts + content/site-content.json  static page copy (edited in code, not admin)
lib/indexnow.ts    pings search engines on every admin publish
```

Content has two sources: static copy in `content/site-content.json` (hero defaults, services, about, legal, contact) and DB content editable in `/admin` (hero override, news, projects/jobs, testimonials, FAQs, client logos). Empty DB sections hide themselves on the public site.

## Environment variables

`DATABASE_URL` (and optional `DATABASE_URL_UNPOOLED` for drizzle-kit), `SESSION_SECRET`, `ADMIN_EMAILS` (comma list, the admin allow-list), `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`, Blob token (`BLOB_READ_WRITE_TOKEN`), `SITE_URL` (fixed origin for server-generated links, e.g. the magic-link email — falls back to the request Host header if unset). See `.env.example`.

## Brand Color Palette

| Color | Hex | Token | Usage |
|-------|-----|-------|-------|
| Navy Blue | `#2B2D5F` | `--color-navy`, `--color-ink` | Headers, footer, primary text |
| Forest Green | `#3D7C3F` | `--color-forest` | Accents, CTAs, links, highlights |
| Soft green | `#F0F7F0` | `--color-teal-soft` | Tinted section backgrounds (forest text on this is 4.64:1 — keep ≥ AA) |
| Page | `#F6F8F6` | `--color-page` | Page background |
| Light Gray | `#C8C8C8` | — | Dividers, secondary text |
| White | `#FFFFFF` | — | Cards, breathing room |

Colours live in `app/globals.css` (Tailwind v4 theme variables), not `src/index.css`.

### Usage Guidelines

- Headers/navigation/footer: navy with white text
- CTAs: forest green with white text
- Body text: navy on white
- Contrast: WCAG AA minimum for all text
- Don't introduce off-brand colours (the magic-link email template currently uses stray `#173a54`/`#15745d` — fix, don't copy)

## Design Approach

**Mobile first.** The primary audience browses on phones (audits weight mobile 80% / desktop 20%).

- Design and build for mobile screens first, enhance with `min-width` breakpoints (Tailwind `md:`/`lg:`)
- Tap-to-call must stay prominent; tap targets ≥ 44px
- Core functionality must work on mobile; desktop may add extra information
- Keep client JS and image weights small; use `next/image`; logos should be SVG or small PNGs

## Conventions (1Zero9 / Project OS)

- **Build credit:** footer carries the 1Zero9 mark + "Built by 1Zero9 Studio" linking to https://www.1zero9.com. Mark renders at **28×28px** (`h-7 w-7`), white variant (`109-logo-circle-white2.png`) since the footer is navy. Verify the rendered size and that the file loads after any footer redesign.
- Verify the canonical URL without a query string after a release, not just a cache-busted one.
- "Deploy succeeded" is not verified. Check the live page.

## SEO / structured data

- Canonical host is `https://www.qualfm.ie` (apex redirects to www). Canonical, sitemap and JSON-LD all use www — keep them consistent.
- Sitemap is dynamic (`app/sitemap.ts`); JSON-LD in `app/layout.tsx` and `components/site/json-ld.tsx`.
- Search Console and Bing verification tags are in `app/layout.tsx`; don't remove them.
- Headings: exactly one `<h1>` per page; no skipped levels.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# QualFM

Production website for QualFM Ltd (Irish facilities management), live at
[www.qualfm.ie](https://www.qualfm.ie). Next.js 16 App Router, Neon Postgres
via Drizzle, Vercel Blob, Resend. See `CLAUDE.md` for the full stack, brand
and production-safety notes, and `docs/review-2026-09.md` for the current
issue list.

## Local setup

```bash
npm install
cp .env.example .env.local   # fill in real values — see .env.example for what each is
npm run dev
```

`.env.local` points at real infrastructure (Neon, Resend, Blob). Prefer a
separate dev database/branch over pointing local dev at production.

## Commands

```bash
npm run dev          # local dev server
npm run build         # production build
npm run lint          # eslint
npm run db:generate    # drizzle-kit generate — schema change -> SQL migration
npm run db:migrate     # applies pending migrations to DATABASE_URL
npm run db:seed        # seeds hero/notices/testimonials — writes to the DB, don't run casually
```

No test suite or CI exists yet.

## Deploys

Vercel, deploying from `main`. This is a live client site — see the
production-safety rules in `CLAUDE.md` before pushing to `main` or running
any `db:*` command.

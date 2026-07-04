# QualFM Site Review — 2026-07-04

**Scope:** Live site (qualfm.ie / www.qualfm.ie), post-fix state. Client portal + exposed admin docs were removed and deployed *during* this audit (commit `7f3c963`); scores reflect the site as deployed today after that fix.
**Purpose:** Lead-gen brochure site for QualFM Ltd, an Irish facilities management company (founded Feb 2025 by Richard Seaver). Key conversion: contact enquiries.
**Assumption flagged:** Content was reviewed via the repo at HEAD (identical to the deployed bundle) because the site is client-rendered and copy is not visible to a plain fetch.

---

## 1. Discovery Pass — Factual Inventory

| Area | Finding |
|---|---|
| Routes | `/`, `/about`, `/services`, `/contact`, `/privacy-policy`, `/terms` (+ alias routes). Portal routes removed 2026-07-04. |
| Stack | React 18.3, TypeScript 5.6, Vite 6, react-router-dom 7.12 (imported but routing is a hand-rolled if-chain in `App.tsx`), Vercel static + 1 serverless function (`api/contact.js`, Resend email). |
| Content model | All copy centralized in `content/site-content.json`, typed via `src/content/siteContent.ts`. 6 pages, 3 testimonials, 4 client logos. |
| Content freshness | Bulk of copy last touched 2026-02-08/21; contact flow 2026-03-01; SEO metadata 2026-07-04. Internal `pageRegistry` says all pages "lastUpdated 2026-02-08". |
| SEO setup | Meta/OG/Twitter tags in shell + per-route via JS (`SeoManager`). Sitemap with lastmod, robots.txt clean (post-fix), LocalBusiness/ProfessionalService JSON-LD with offer catalog (deployed today). **No prerendering — page copy invisible without JS execution.** |
| Domain | Apex `qualfm.ie` **307**-redirects to `www.qualfm.ie`, but sitemap, canonical tags, and schema all use non-www. Conflicting canonical signals. |
| Security headers | HSTS ✓. Missing: CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy. `access-control-allow-origin: *` on static responses. |
| Dependencies | `npm audit`: 12 vulns (7 high) — vite/rollup (dev-time), react-router-dom (runtime). All fixable via `npm audit fix`. |
| Performance | JS 219 KB (70 KB gz), CSS 28 KB (5.9 KB gz) — fine. **Assets are not:** 6.1 MB autoplay hero video, 5 MB `qualfm-mainlogo.png` (also the og:image), 2.1 MB + 1.7 MB service/about PNGs. ~15 MB of *unused* images also ship in the deploy. |
| Accessibility | Semantic headings (one h1 per page), alt text present on all imgs, `aria-hidden` on decorative elements, tel: links. Not browser-tested for keyboard nav/contrast in this audit. |
| Forms | Contact form → `/api/contact` → Resend. Server-side validation, in-memory IP rate limiting (8/15 min per instance). No spam honeypot/CAPTCHA. |
| Fixed during audit | Public exposure of internal MkDocs docs at `/admin-docs/` (requirements, competitor research, time logs); obsolete portal auth/API/DB code; `pg` dependency. |

## 2. Benchmark Pass

| Site | Better than QualFM | Worse / absent | Worth stealing |
|---|---|---|---|
| **Bidvest Noonan** | Sector-vertical pages (9+), dated news/insights, research reports as trust assets, clear SERP-targeted title | Generic corporate tone; scale message irrelevant to SME buyers | **Sector landing pages** — one page per sector you already name (healthcare, pharma, telecoms) |
| **Grosvenor Services** | Wall of accreditation logos (ISO 9001/14001/45001, SafeContractor, CHAS), 60-year heritage line, quote-request CTA form | No fresh content signals either; dated design | **Accreditation logo strip** — QualFM claims Safe Electric QC + F-Gas in text only; show the badges |
| **ABM Ireland** (acquired Momentum Support) | Case studies, industry taxonomy, careers/leadership pages, news | Enterprise-heavy; impersonal | **Case studies** — even 2–3 short project write-ups (the €1.5m fitout capability begs for photos + numbers) |
| **IMAC Group** (closest size peer) | 18+ enumerated services, client logo wall (UCD, Tesco), PSA/Safe Electric/ISO badges | Static content, weak SEO, no schema — beatable | **Enumerated service list depth** — their long service list wins long-tail searches QualFM's 6 pillars can't |

Takeaway: QualFM's schema markup is already ahead of IMAC and Grosvenor. The gap is **content depth** (no sector pages, no case studies, no visible accreditation badges) and **content freshness** (nothing dated anywhere on the site).

## 3. Five-Persona Review

### Security Auditor — Score: 6/10
*(would have been 3/10 this morning)*

**Strengths:** Exposed internal docs + obsolete portal removed and verified gone today; contact endpoint has method checks, validation, and rate limiting; HMAC session code (now deleted) used timing-safe compares; HSTS enabled; no secrets in repo.

**Problems (ranked):**
1. **Old Vercel deployments still serve the admin docs.** Deployments are immutable and remain reachable at their unique URLs. Delete old deployments or enable Deployment Protection.
2. Internal docs remain in the repo (`docs/`, `site/`) and full git history — treat their contents (time logs, competitor research) as public.
3. No CSP / X-Frame-Options / X-Content-Type-Options / Referrer-Policy headers (`vercel.json` has no `headers` block).
4. 12 npm vulnerabilities, 7 high; react-router-dom is the runtime one.
5. Contact-form rate limiting is per-instance in-memory; trivially bypassed across instances. Acceptable risk for a brochure site, but no honeypot either — spam will find it.

**Move the score most:** Delete/protect old deployments (closes the residual docs leak).

### SEO/Growth Consultant — Score: 4/10

**Strengths:** Today's LocalBusiness/ProfessionalService schema with offer catalog is genuinely good; clean sitemap + robots; keyword-conscious titles/descriptions per route.

**Problems (ranked):**
1. **Client-side rendering only.** Every word of copy requires JS execution. Google copes, slowly; other crawlers and link previews don't. For a 6-page brochure site, prerendering is cheap and transformative.
2. **Canonical confusion:** site lives at `www`, but canonical/sitemap/schema all say non-www, and the apex redirect is a 307 (temporary). Signals split between two hosts.
3. **No content to rank.** 6 pages, no sector pages, no service-detail pages, no case studies, no FAQ. Competitors win every long-tail query ("legionella risk management Dublin", "retail fitout contractor Ireland").
4. **5 MB og:image** — social/WhatsApp previews will frequently fail to load it.
5. Core Web Vitals at risk on mobile: 6.1 MB autoplay video in the hero band.

**Move the score most:** Prerender the 6 routes (or migrate to a static-capable framework) + fix the www canonical mismatch.

### Staff Software Engineer — Score: 6/10

**Strengths:** Centralized typed content model (`site-content.json` + `SiteContent` type) is a genuinely good pattern; small clean components; TS + ESLint on a modern toolchain; build is fast and green.

**Problems (ranked):**
1. **Zero tests, no CI.** Nothing runs on push; a broken build reaches production via git integration.
2. Hand-rolled if-chain routing in `App.tsx` while shipping react-router-dom — you pay the bundle cost and get none of the features (no 404 route: every unknown URL silently renders Home with a 200).
3. Orphaned tooling left after portal removal: `scripts/content-*.mjs`, `content/` export workflow, `docs/` + `site/` MkDocs tree, `mkdocs.yml`.
4. 15 MB of unreferenced images in `public/` ship with every deploy.
5. Dependency vulns unaddressed (`npm audit fix` is available and low-risk).

**Move the score most:** A minimal CI (build + lint + audit on PR) — everything else can regress silently without it.

### Product/UX Critic — Score: 6/10

*(Caveat: reviewed via code and fetches; no live browser session was run.)*

**Strengths:** Simple 4-item nav, phone number is a tap-to-call link in the hero, contact page offers both a form and direct contact details, mobile-first CSS discipline.

**Problems (ranked):**
1. **6.1 MB autoplay video** greets every mobile visitor — on 4G that's seconds of jank at the exact moment they decide whether to stay.
2. No 404 page — typos silently show the homepage, disorienting.
3. Unknown testimonial provenance (see Content) undermines the trust section for any visitor who Googles the named companies.
4. Certifications ("Safe Electric QC", "F-Gas") are plain text spans — badges/links would carry far more weight with facilities buyers who audit suppliers.
5. The footer still felt portal-shaped until today; worth a visual pass now that "Portal Access" is gone.

**Move the score most:** Replace/defer the hero video on mobile (static poster + optional play).

### Content Strategist — Score: 4/10

**Strengths:** Copy is consistent in tone and honest about company scale; founding story (Feb 2025, Richard Seaver, 25 years experience) is coherent everywhere it appears; content model makes updates trivially easy.

**Problems (ranked):**
1. **The three testimonials name companies ("Northpoint Business Campus", "CareWell Health Group", "Connacht Retail Estates") that don't match the actual client list and look placeholder.** If they're not real, this is a legal/credibility risk (Consumer Protection Act) and the single worst thing on the site. **Needs owner verification.**
2. Nothing on the site is dated — no news, no case studies, no "last updated". Sitemap says pages change "weekly"; git says the copy hasn't changed since February.
3. Client logos are hotlinked from third-party servers (therapieclinic.com, surgicube.com, an S3 bucket) — they'll silently break, and one already renders from a foreign Next.js image proxy.
4. No answer content for what buyers actually search (compliance obligations, maintenance planning, fitout process) — zero long-tail coverage.
5. Legal pages are five thin sections each; fine for now, but no cookie/analytics statement if analytics are ever added.

**Move the score most:** Verify or replace the testimonials with real, attributable quotes.

## Consolidated Scorecard

| Persona | Score | One-line verdict |
|---|---|---|
| Security Auditor | 6/10 | Big leak fixed today; residual history + missing headers remain |
| SEO/Growth | 4/10 | Good schema on an invisible (client-rendered), thin site |
| Staff Engineer | 6/10 | Clean small codebase, zero safety net |
| Product/UX | 6/10 | Simple and honest, but heavyweight media hurts mobile |
| Content Strategist | 4/10 | Frozen since February; testimonial provenance is the red flag |

**Where personas agree (real signal):** content thinness/staleness, oversized media, and the missing trust artifacts (badges, case studies, real testimonials) — all point at the same root: the site was built well and then stopped.
**Where they disagree:** engineering rates the codebase health above what SEO/content see — the code is better than the content it serves.

**Composite: 5/10** — not an average but a judgment: a competent, now-secure shell that under-delivers on the two things a lead-gen site exists for: being found, and being believed.

## 4. Roadmap

### Phase 0 — Stop the Bleeding (this week)
- [x] Remove exposed `/admin-docs` + obsolete portal (deployed `7f3c963`, verified live 2026-07-04)
- [ ] Delete old Vercel deployments (or enable Deployment Protection) — they still serve the docs
- [ ] **Verify testimonials with Richard** — real (keep, tighten attribution) or placeholder (replace/remove)
- [ ] `npm audit fix` (clears react-router-dom runtime vuln + most of the rest)

### Phase 1 — Quick Wins (this month)
- [ ] Add `headers` block to `vercel.json`: CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy
- [ ] Compress `qualfm-mainlogo.png` 5 MB → <100 KB; make a dedicated 1200×630 og-image
- [ ] Convert fitout PNGs to WebP (~200 KB each); delete ~15 MB unused images from `public/`
- [ ] Hero video: poster image + `preload="none"`/mobile-off, or replace with static image
- [ ] Resolve www vs non-www: pick `www.qualfm.ie` everywhere (canonical, sitemap, schema, redirects) or make apex primary
- [ ] Add a real 404 route
- [ ] Self-host the 4 client logos
- [ ] Remove orphaned content-pack scripts, `mkdocs.yml`, `docs/`, `site/` (or move docs to a private repo)
- [ ] Honeypot field on the contact form

### Phase 2 — Structural (this quarter)
- [ ] Prerender the 6 routes at build time (e.g. `vite-prerender-plugin`) — or migrate this small site to a static-first framework; kills the CSR/SEO problem permanently
- [ ] CI on PR/push: build + lint + `npm audit` + link check + Lighthouse budget
- [ ] Use react-router's actual `<Routes>` (or drop the dependency)
- [ ] Sector pages (healthcare, pharma, telecoms, retail) and 2–3 service-detail pages targeting long-tail keywords
- [ ] Accreditation badge strip (Safe Electric, F-Gas) with registration numbers

### Phase 3 — Enhancement (ongoing)
- [ ] 2–3 case studies with photos and numbers (the €1.5m fitout capability is the headline asset)
- [ ] Testimonial collection loop: ask every completed job for a one-liner + permission
- [ ] Google Business Profile aligned with LocalBusiness schema
- [ ] Quarterly "news" item minimum (project completed, cert renewed) so the site is visibly alive

### Staleness Prevention
1. **`CONTENT-AUDIT.md`** — one line per page: route, owner, last-verified date. Update on any copy change; anything >6 months old is flagged.
2. **CI check** (Phase 2 pipeline) fails on: broken links, images >300 KB, Lighthouse performance <80, outdated major deps.
3. **Quarterly scheduled re-run** of `site-review-prompt.md` against this file (Claude Code scheduled task or calendar reminder), diffing the scorecard.

**Re-run this audit on 2026-10-04 and diff against today's scorecard.**

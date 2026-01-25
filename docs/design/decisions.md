# Design Decisions

This document records key design decisions made during the QualFM project.

---

## DD-001: Glass Morphism Design System

**Date:** 25 January 2026

**Decision:** Implement a custom glass morphism design system using vanilla CSS.

**Context:** Client requested a modern, glassmorphic design inspired by the rvrmatchday project.

**Alternatives Considered:**
1. Tailwind CSS with custom utilities
2. CSS-in-JS (styled-components)
3. Vanilla CSS with custom utilities (chosen)

**Rationale:**
- Project already uses vanilla CSS
- Keeps bundle size small
- No additional dependencies
- Easy to maintain and extend
- Reusable across components

**Implementation:** Created `src/styles/glass.css` with reusable utility classes.

---

## DD-002: Contact Page as Modal Overlay

**Date:** 25 January 2026

**Decision:** Implement contact page as a modal overlay rather than a separate page.

**Context:** Client wanted a glassmorphic popup where the main site is visible but blurred behind.

**Alternatives Considered:**
1. Separate route with no background (original)
2. Modal overlay with blurred backdrop (chosen)
3. Slide-in panel

**Rationale:**
- Creates more engaging user experience
- Shows context of the main site
- Smooth entry/exit animations possible
- Clicking backdrop dismisses (intuitive UX)

**Implementation:**
- Home page always renders
- Contact renders conditionally based on route
- Backdrop uses blur filter and semi-transparent overlay

---

## DD-003: Mobile-First Responsive Approach

**Date:** 25 January 2026

**Decision:** Design and build mobile-first, progressively enhancing for larger screens.

**Context:** Project guidelines specify mobile-first approach as primary user base is mobile.

**Implementation:**
- Base styles target mobile
- Use `min-width` media queries for larger screens
- Touch-friendly tap targets (44px minimum)
- Mobile navigation with hamburger menu

---

## DD-004: Animation Strategy

**Date:** 25 January 2026

**Decision:** Use CSS animations with staggered delays for engaging micro-interactions.

**Alternatives Considered:**
1. Framer Motion (React library)
2. CSS animations (chosen)
3. GSAP

**Rationale:**
- No additional dependencies
- Good browser support
- Sufficient for planned interactions
- Respects `prefers-reduced-motion`

**Note:** Consider Framer Motion if more complex animations needed later.

---

## DD-005: Site Information Architecture

**Date:** 25 January 2026

**Decision:** Structure site with 4 main sections: Home, About, Services, Sectors.

**Context:** Based on competitor research, these are the essential sections for an FM company website.

**Rationale:**
- Matches industry standard patterns
- Clear navigation for users
- Scalable for future content
- Supports SEO strategy

---

## DD-006: Demo Content Strategy

**Date:** 25 January 2026

**Decision:** Create realistic demo content that reflects typical FM services.

**Context:** Client needs demo data for the site before real content is available.

**Services to Feature:**
1. Facilities Management
2. Building Maintenance
3. HVAC Services
4. Cleaning Services
5. Security Solutions
6. Energy Management

**Sectors to Target:**
1. Commercial & Office
2. Healthcare
3. Education
4. Retail
5. Industrial
6. Government

**Rationale:** These are the most common services and sectors based on competitor research (OCS, FKM, Moore Environmental).

---

## Template for Future Decisions

```markdown
## DD-XXX: [Title]

**Date:** DD Month YYYY

**Decision:** [What was decided]

**Context:** [Background and why this decision was needed]

**Alternatives Considered:**
1. Option A
2. Option B (chosen)
3. Option C

**Rationale:** [Why this option was chosen]

**Implementation:** [How it was/will be implemented]
```

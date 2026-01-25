# Changelog

All notable changes to the QualFM website project.

---

## [Unreleased]

### Planned
- Navigation component
- Home page hero section
- Services page and cards
- Sectors page
- About page
- Footer component

---

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

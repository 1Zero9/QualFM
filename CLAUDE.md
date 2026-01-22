# QualFM Project Guidelines

## Brand Color Palette

### Primary Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Navy Blue | `#2B2D5F` | Headers, primary text, key UI elements |
| Forest Green | `#3D7C3F` | Accents, CTAs, highlighting important features |

### Supporting Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Light Gray | `#C8C8C8` | Backgrounds, dividers, secondary text |
| White | `#FFFFFF` | Backgrounds, cards, breathing room |

### CSS Variables

Colors are defined as CSS custom properties in `src/index.css`:

```css
:root {
  --navy-blue: #2B2D5F;
  --forest-green: #3D7C3F;
  --light-gray: #C8C8C8;
  --white: #FFFFFF;
}
```

### Usage Guidelines

- **Headers/Navigation**: Navy blue background with white text
- **Call-to-Action Buttons**: Forest green with white text
- **Body Text**: Navy blue on white background
- **Backgrounds**: White primary, light gray for sections/cards
- **Links/Highlights**: Forest green
- **Borders/Dividers**: Light gray

## Design Approach

### Mobile First

This site is built with a **mobile-first approach**. The primary user base accesses the site from mobile devices.

- Design and build for mobile screens first
- Use `min-width` media queries to progressively enhance for larger screens
- Core functionality must work seamlessly on mobile
- Desktop views can include additional information and features not shown on mobile
- Touch-friendly tap targets (minimum 44px)
- Consider mobile performance and data usage

### Responsive Breakpoints

```css
/* Mobile first - base styles */

/* Tablet */
@media (min-width: 768px) { }

/* Desktop */
@media (min-width: 1024px) { }

/* Large desktop */
@media (min-width: 1440px) { }
```

## Tech Stack

- React 18
- TypeScript
- Vite
- Deployed on Vercel

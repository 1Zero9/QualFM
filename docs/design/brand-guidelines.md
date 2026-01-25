# Brand Guidelines

## Color Palette

### Primary Colors

| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| Navy Blue | `#2B2D5F` | rgb(43, 45, 95) | Headers, primary text, key UI elements |
| Forest Green | `#3D7C3F` | rgb(61, 124, 63) | Accents, CTAs, success states |

### Supporting Colors

| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| Light Gray | `#C8C8C8` | rgb(200, 200, 200) | Backgrounds, dividers, secondary text |
| White | `#FFFFFF` | rgb(255, 255, 255) | Backgrounds, cards, breathing room |

### Extended Palette (for UI states)

| Color | Hex | Usage |
|-------|-----|-------|
| Green Hover | `#2d5a2f` | Button hover states |
| Green Light | `rgba(61, 124, 63, 0.1)` | Light backgrounds |
| Navy Light | `rgba(43, 45, 95, 0.1)` | Light backgrounds |

## Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
```

### Scale
- **H1:** 2.5rem (40px) - Page titles
- **H2:** 2rem (32px) - Section headers
- **H3:** 1.5rem (24px) - Sub-sections
- **H4:** 1.25rem (20px) - Card titles
- **Body:** 1rem (16px) - Paragraph text
- **Small:** 0.875rem (14px) - Captions, labels

### Weights
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

## Spacing

Based on 8px grid system:

| Token | Value |
|-------|-------|
| xs | 4px (0.25rem) |
| sm | 8px (0.5rem) |
| md | 16px (1rem) |
| lg | 24px (1.5rem) |
| xl | 32px (2rem) |
| 2xl | 48px (3rem) |
| 3xl | 64px (4rem) |

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| sm | 4px | Small elements, tags |
| md | 8px | Buttons, inputs |
| lg | 16px | Cards, modals |
| xl | 24px | Large cards |
| full | 9999px | Pills, avatars |

## Shadows

```css
/* Subtle */
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

/* Medium */
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

/* Large */
box-shadow: 0 8px 32px rgba(43, 45, 95, 0.15);

/* Glass */
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
```

## Logo Usage

- Use transparent PNG version for overlays
- Maintain aspect ratio
- Minimum size: 80px width
- Clear space: Equal to logo height on all sides

## Imagery Style

- Professional, modern photography
- Facilities and building imagery
- People at work (if applicable)
- Clean, well-lit environments
- Avoid stock photo clichés

# Technical Notes

## Project Setup

### Technology Stack
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **CSS** - Styling (no preprocessor)
- **Vercel** - Hosting and deployment

### Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Deployment

Automatic deployment via Vercel on push to `main` branch.

---

## File Structure

```
src/
├── App.tsx          # Main app component
├── App.css          # App-level styles
├── index.css        # Global styles, CSS variables
├── main.tsx         # Entry point
├── pages/
│   ├── Home.tsx
│   ├── Home.css
│   ├── Contact.tsx
│   └── Contact.css
└── styles/
    └── glass.css    # Glass morphism utilities

public/
└── images/
    ├── qualfm-mainlogo-trans.png
    └── van-background-bg1.png

docs/                # MkDocs documentation
├── index.md
├── project/
├── design/
├── build/
└── time-logs/
```

---

## CSS Architecture

### Global Styles (`index.css`)
- CSS custom properties (variables)
- Reset/normalize styles
- Base typography

### Glass Utilities (`styles/glass.css`)
- Reusable glass morphism classes
- Animation keyframes
- Utility classes

### Component Styles (`pages/*.css`)
- Component-specific styles
- Use global variables
- Reference glass utilities via animation names

---

## Routing Strategy

Using React Router but with a custom approach for the contact modal:

```tsx
// App.tsx
function App() {
  const location = useLocation()
  const showContact = location.pathname === '/contact'

  return (
    <div className="app">
      <Home />
      {showContact && <Contact />}
    </div>
  )
}
```

This allows Home to always be visible (blurred) behind the Contact modal.

---

## Glass Morphism Implementation

### Key Properties

```css
/* Glass card example */
.glass {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px); /* Safari support */
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
}
```

### Browser Support
- Chrome: Full support
- Firefox: Full support
- Safari: Requires `-webkit-` prefix
- Edge: Full support

### Performance Considerations
- `backdrop-filter` can be expensive
- Use sparingly on mobile
- Test on lower-end devices

---

## Animation System

### Keyframes Defined
- `glass-fade-in` - Opacity + blur
- `glass-slide-up` - Translate Y + opacity
- `glass-scale-in` - Scale + translate + opacity
- `glass-float` - Subtle floating effect

### Stagger Pattern
Use `.stagger-1` through `.stagger-8` classes with `animation-fill-mode: both` to create cascading effects.

```css
.element {
  animation: glass-slide-up 0.4s ease-out both;
}
.element.stagger-1 { animation-delay: 0.1s; }
.element.stagger-2 { animation-delay: 0.15s; }
/* etc. */
```

---

## Known Issues

### Resolved
1. ~~Unused imports in App.tsx causing build failure~~ - Fixed in 96a159c
2. ~~CSS @import not at top of file~~ - Fixed by moving import

### Outstanding
- Legacy pages retained intentionally for later cleanup:
  - `src/pages/Sectors.tsx`
  - `src/pages/SectorDetail.tsx`
  - `src/pages/ServiceDetail.tsx` (now compatibility/redirect-style content)
- Current route behavior consolidates legacy paths:
  - `/services/*` renders consolidated `Services`
  - `/sectors*` renders `About`

---

## Future Considerations

### Performance
- Consider lazy loading for images
- Optimize glass effects on mobile
- Add loading states

### Accessibility
- Add `prefers-reduced-motion` media query
- Ensure proper focus management in modal
- Test with screen readers

### SEO
- Add meta tags
- Implement proper heading hierarchy
- Add alt text to all images

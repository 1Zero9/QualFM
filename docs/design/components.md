# Component Library

## Glass Morphism System

Located in `src/styles/glass.css`

### Card Variants

| Class | Description | Use Case |
|-------|-------------|----------|
| `.glass-light` | 10% white, 8px blur | Layered content, subtle |
| `.glass` | 15% white, 12px blur | Default cards |
| `.glass-heavy` | 25% white, 16px blur | Primary content |
| `.glass-dark` | 40% black, 12px blur | Dark backgrounds |
| `.glass-solid` | 85% white, 20px blur | High readability |
| `.glass-navy` | 70% navy, 12px blur | Brand accent |
| `.glass-green` | 70% green, 12px blur | Brand accent |

### Button Variants

| Class | Description |
|-------|-------------|
| `.glass-btn` | White glass button |
| `.glass-btn-primary` | Green glass button |

### Input Variants

| Class | Description |
|-------|-------------|
| `.glass-input` | Dark theme input |
| `.glass-input-light` | Light theme input |

### Animation Classes

| Class | Effect |
|-------|--------|
| `.animate-glass-fade` | Fade in with blur |
| `.animate-glass-slide` | Slide up |
| `.animate-glass-scale` | Bouncy scale in |
| `.animate-glass-float` | Floating effect |
| `.stagger-1` to `.stagger-8` | Animation delays |

---

## Planned Components

### Navigation
- Desktop header with logo, links, CTA
- Mobile hamburger menu
- Full-screen mobile nav overlay

### Hero Section
- Background image/gradient
- Headline and subtext
- CTA button(s)
- Optional overlay

### Service Card
```jsx
<ServiceCard
  icon="🔧"
  title="Facilities Management"
  description="Comprehensive FM solutions..."
  href="/services/facilities-management"
/>
```

### Sector Card
```jsx
<SectorCard
  image="/images/sectors/healthcare.jpg"
  title="Healthcare"
  description="Supporting healthcare facilities..."
  href="/sectors/healthcare"
/>
```

### Testimonial Card
```jsx
<TestimonialCard
  quote="QualFM transformed our facility operations..."
  author="John Smith"
  role="Facilities Director"
  company="ABC Healthcare"
/>
```

### CTA Banner
```jsx
<CTABanner
  headline="Ready to transform your facilities?"
  subtext="Get in touch with our team today."
  buttonText="Contact Us"
  buttonLink="/contact"
/>
```

### Footer
- Multi-column layout
- Quick links
- Services list
- Contact info
- Social links
- Copyright

---

## CSS Variables Reference

```css
:root {
  --navy-blue: #2B2D5F;
  --forest-green: #3D7C3F;
  --light-gray: #C8C8C8;
  --white: #FFFFFF;
}
```

# Site Structure

## Information Architecture

```
QualFM Website
├── Home
├── About Us
│   └── Our Story, Values, Team (single page sections)
├── Services
│   ├── Overview (main services page)
│   ├── Facilities Management
│   ├── Building Maintenance
│   ├── HVAC Services
│   ├── Cleaning Services
│   ├── Security Solutions
│   └── Energy Management
├── Sectors
│   ├── Overview (main sectors page)
│   ├── Commercial & Office
│   ├── Healthcare
│   ├── Education
│   ├── Retail
│   ├── Industrial
│   └── Government
└── Contact (modal overlay)
```

## Navigation

### Primary Navigation
```
[Logo] Home | About | Services | Sectors | [Contact Us Button]
```

### Mobile Navigation
- Hamburger menu
- Full-screen overlay
- Same items as desktop
- Contact as prominent CTA

### Footer Navigation
- Quick Links (Home, About, Services, Sectors)
- Services (list of main services)
- Contact Info (address, phone, email)
- Social Links (if applicable)
- Legal (Privacy Policy, Terms)

## Page Layouts

### Home Page
```
┌─────────────────────────────────────┐
│           NAVIGATION                │
├─────────────────────────────────────┤
│                                     │
│         HERO SECTION                │
│    Headline + Subtext + CTA         │
│                                     │
├─────────────────────────────────────┤
│                                     │
│      SERVICES OVERVIEW              │
│    Grid of 6 service cards          │
│                                     │
├─────────────────────────────────────┤
│                                     │
│      WHY CHOOSE US                  │
│    3-4 key differentiators          │
│                                     │
├─────────────────────────────────────┤
│                                     │
│      SECTORS WE SERVE               │
│    Grid/carousel of sectors         │
│                                     │
├─────────────────────────────────────┤
│                                     │
│      TESTIMONIALS                   │
│    Client quotes                    │
│                                     │
├─────────────────────────────────────┤
│                                     │
│      CTA BANNER                     │
│    "Ready to get started?"          │
│                                     │
├─────────────────────────────────────┤
│           FOOTER                    │
└─────────────────────────────────────┘
```

### About Page
```
┌─────────────────────────────────────┐
│           NAVIGATION                │
├─────────────────────────────────────┤
│         PAGE HERO                   │
│    "About QualFM"                   │
├─────────────────────────────────────┤
│         OUR STORY                   │
│    Company background               │
├─────────────────────────────────────┤
│         OUR VALUES                  │
│    Core values grid                 │
├─────────────────────────────────────┤
│         WHY US                      │
│    Key differentiators              │
├─────────────────────────────────────┤
│         CTA BANNER                  │
├─────────────────────────────────────┤
│           FOOTER                    │
└─────────────────────────────────────┘
```

### Services Page
```
┌─────────────────────────────────────┐
│           NAVIGATION                │
├─────────────────────────────────────┤
│         PAGE HERO                   │
│    "Our Services"                   │
├─────────────────────────────────────┤
│       SERVICES GRID                 │
│    Cards linking to detail pages    │
├─────────────────────────────────────┤
│       SERVICE APPROACH              │
│    How we deliver                   │
├─────────────────────────────────────┤
│         CTA BANNER                  │
├─────────────────────────────────────┤
│           FOOTER                    │
└─────────────────────────────────────┘
```

### Sectors Page
```
┌─────────────────────────────────────┐
│           NAVIGATION                │
├─────────────────────────────────────┤
│         PAGE HERO                   │
│    "Sectors We Serve"               │
├─────────────────────────────────────┤
│       SECTORS GRID                  │
│    Industry cards                   │
├─────────────────────────────────────┤
│       CROSS-SECTOR VALUE            │
│    Why we work across sectors       │
├─────────────────────────────────────┤
│         CTA BANNER                  │
├─────────────────────────────────────┤
│           FOOTER                    │
└─────────────────────────────────────┘
```

## Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 768px | Single column, stacked |
| Tablet | 768px - 1023px | 2 columns, adjusted spacing |
| Desktop | 1024px - 1439px | Full layout, 3-4 columns |
| Large | ≥ 1440px | Max-width container, larger spacing |

## Component Patterns

### Cards
- Glass morphism styling
- Hover lift effect
- Consistent padding (24px)
- 16px border radius

### Buttons
- Primary: Forest Green background
- Secondary: Outlined, Navy Blue
- Ghost: Text only with hover effect

### Section Spacing
- Desktop: 80px vertical padding
- Tablet: 64px vertical padding
- Mobile: 48px vertical padding

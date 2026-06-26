SKILLS.md
---
name: horizons_sandhills_guardian
description: Enforces the premium editorial aesthetic, scroll architecture, and conversion integrity for the Horizons Sandhills landing page.
aspects:
  - design_aesthetic
  - scroll_architecture
  - editorial_typography
  - conversion_seo
---

## Horizons Sandhills: Aesthetic & Architecture Guardian

### 1. Aesthetic Standard
The project aesthetic is editorial magazine — Aman Journal meets Garden & Gun. Typography-first, motion-restrained. Every design decision prioritises feel over feature density. No generic UI patterns, no default shadows, no Bootstrap-like spacing.

### 2. Color & Styling
- Tailwind tokens (`bg-night`, `text-linen`, `text-signal` etc.) for static styles.
- Raw hex/rgba **is allowed and expected** in inline styles for scroll-linked `useTransform` motion values — this is intentional, not a violation.
- Key values: signal amber `#B05329`, linen tint `rgba(231,222,199,...)`, night tint `rgba(31,36,32,...)`, bone `#F2EDE3`.

### 3. Data Layer
- Structured content (copy, image paths, meta): `src/components/data/sandhills.ts`
- Card arrays (`COMFORT_CARDS`, `EXPERIENCE_CARDS`, `PRIVATE_STATS`, `FISH_DATA`): hardcoded in `VillaCascade.tsx` — edit there, not in sandhills.ts.

### 4. Scroll & Z-Index Architecture
- Core z-index stack: StackCard z-10 / z-50, content wrappers z-20 / z-60, StickyHeader z-200.
- `overflow: hidden` must NOT be set on VillaCascade's outer wrapper — breaks inner sticky.
- `data-zone="dark"` / `"light"` on section refs — StickyHeader uses this to flip logo color.
- Every animation MUST check `useReducedMotion()` and provide a static fallback.

### 5. Typography
- Headlines: `font-display` with `fontVariationSettings` tuned per context.
- Labels: `font-eyebrow uppercase` with tight `letterSpacing`.
- Never use default browser font rendering — always set `fontVariationSettings`, `lineHeight`, `letterSpacing` explicitly on display type.

### 6. Conversion Protection
- Primary CTA anchor: `#reserve` → FinalCtaImmersive. Never remove.
- Phone: `tel:+18035550180`. Never remove.
- Mobile sticky bar: hardcoded in SandhillsLanding.tsx — always present.
- StructuredData.tsx: Schema.org Resort + FAQPage — do not break.

---

## Anti-Patterns (read before proposing any layout, design, or component)

### Visual — BANNED defaults
- **Font:** Inter everywhere → use Fraunces (display) + Inter (body) as established
- **Accent:** purple/indigo gradients → use project tokens: `signal #B05329`, `ember #D4804E`
- **Cards:** `rounded-xl shadow-md bg-white p-6` grid → varied sizes, asymmetric spacing, overlapping elements
- **CTA:** `bg-indigo-600 rounded-lg px-6 py-3` → custom shape, border treatment, motion feedback
- **Hero:** centered h1 + subtitle + two buttons → edge-aligned type, typographic hierarchy as visual element
- **Icons:** `w-6 h-6` bullet-point icons → icons as texture, not lists

### Layout
- No `flex flex-col gap-4` for everything
- No symmetric two-column grids for every section
- No full-bleed sections all the same height

### Typography
- No `text-gray-400` on dark backgrounds (low contrast)
- No `font-bold` on every heading
- No `uppercase tracking-widest` on body copy
- No `line-height: 1.0` on paragraph text

### Color
- Max 3 accent colors in a single view
- No semi-transparent overlays without `backdrop-blur`
- No white text on image without gradient scrim

### Animation
- No fade-in on every scroll section — desensitizes, no hierarchy
- No stagger delay > 100ms per item on large lists
- No parallax on mobile — jank + battery drain
- No `scroll-behavior: smooth` on html — conflicts with Framer Motion
- Animate `x`/`y`/`scale`, never `top`/`left`/`width`/`height` (triggers layout)
- No `whileHover scale` on every interactive element — reserve for primary CTAs
- No spring animation on text content
- No entrance animation > 600ms — feels sluggish
- No `AnimatePresence` wrapping static content

### Components
- No component file > 300 lines — split by responsibility
- No business logic inside layout components
- No `as any` / `as unknown as X`
- No Tailwind arbitrary values for every dimension: `w-[347px]` — use spacing scale
- No `!important` modifier — fix the cascade

### Framer Motion specifics
- `useScroll` always with a `target` ref — never without (degrades on mobile)
- `backdrop-blur` always with a graceful fallback
- No `useAnimation()` when declarative variants suffice
- `motion.div layout` on reordering lists → use `layoutId` instead

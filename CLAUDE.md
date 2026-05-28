# Horizons Sandhills — CLAUDE.md

Premium luxury villa landing page for **Horizons Sandhills** — 126-acre private nature retreat at 423 Woodmen Rd, Patrick SC 29584. Single-page marketing site, no backend, no auth. Aesthetic: editorial magazine (Aman Journal, Garden & Gun). Every design decision prioritises feel over feature density.

---

## Commands

```
npm run dev        # Vite dev server on :5173 (use -- --port 5174 if busy)
npm run build      # tsc -b && vite build
npm run lint       # eslint
npm run preview    # preview production build
```

---

## Stack

- **React 19** + TypeScript ~6 + Vite 8
- **Framer Motion 12** — all scroll animations (`useScroll`, `useTransform`, `useMotionValueEvent`)
- **Tailwind CSS 3.4** — design tokens in `tailwind.config.ts`; raw `rgba`/hex used in inline styles for motion values only
- **Lucide React** — utility icons (chevrons, close, etc.)
- **@phosphor-icons/react** — decorative duotone icons in HeroImmersive GLANCE block only; use `Icon` suffix (e.g. `TreeEvergreenIcon`)
- **React Router 7** — two routes: `/` → `SandhillsLanding`, `/stays/:slug` → `StayDetail`

---

## Data Layer

All copy, image paths, and structured content: `src/components/data/sandhills.ts` → exported as `sandhillsData`.

**Exception:** Card arrays are hardcoded **in `VillaCascade.tsx`**, not in `sandhills.ts`:
- `COMFORT_CARDS` (5 items) — Brooklinen, Marshall, Nespresso/SMEG, Weber, firepit
- `EXPERIENCE_CARDS` (8 items) — sauna, lake, trails, fishing, e-bikes, peach orchard, apiary, farm tours
- `FISH_DATA` (6 species) — used in ExperienceModal
- `PRIVATE_STATS` (3 items) — shown in Act 5 logic section

**sandhills.ts shape:**
```
meta, hero, chapters[4], storyIntro, stats[7],
stays[2] (Forest Villa + The House — each has rooms[4]: Exterior/Interior/Terrace/Sauna),
included[12], dayScenes[3], dining, activities[5], sustainability,
directions[3], gallery[16], reviews[3], pressQuote, nearby[4], faq[7], finalCta
```

**Cloudbeds integration pending** — replace placeholders at top of `sandhills.ts`:
- `CLOUDBEDS_PROPERTY_ID`
- `REPLACE_WITH_FOREST_VILLA_ROOM_TYPE_ID`
- `REPLACE_WITH_THE_HOUSE_ROOM_TYPE_ID`

---

## Page Structure & Z-Index Stack

`src/pages/SandhillsLanding.tsx` orchestrates all blocks:

| z-index | Element |
|---------|---------|
| 200 | StickyHeader |
| 100 | Mobile sticky booking bar (fixed bottom-0, hardcoded in SandhillsLanding) |
| 60 | Footer (RoundedEntry z-60) |
| 50 | StackCard → FinalCtaImmersive (`id="reserve"`) |
| 40 | *(commented out — Worth It content)* |
| 30 | *(commented out — Worth It ChapterOpener)* |
| 20 | VillaCascade + RoundedEntry(z-20) wrapping STAYS content |
| 12 | HeroImmersive traveling wordmark (internal) |
| 10 | StackCard → ChapterOpener STAYS (`id="stays"`) |

**Active sections (top → bottom):**
1. `<StructuredData />` — JSON-LD schemas (Resort + FAQPage)
2. `<StickyHeader />`
3. `<HeroImmersive />`
4. `<StackCard z=10>` → `<ChapterOpener id="stays" />`
5. `<VillaCascade />` (z-20 wrapper)
6. `<RoundedEntry z=20>` — LAND chapter: `ChapterOpener id="land"` + `LandStory` + `AtAGlance`
7. `<StackCard z=50>` → `<FinalCtaImmersive />`
8. `<Footer />` (z-60)
9. Mobile sticky bar (fixed z-100)

**Commented out:**
- `DayScenes`
- `NearbyGrid`
- Entire Worth It chapter: StackCard z-30 + RoundedEntry z-40 containing `DiningEditorial`, `MapBlock`, `GalleryMasonry`, `ProofSocial`, `FaqAccordion`
- Inside STAYS RoundedEntry: `IncludedList`, `ActivitiesGrid`, `NearbyGrid`

---

## VillaCascade — Core Component

`src/components/blocks/VillaCascade.tsx` is the main content engine (~1,500 lines).

### Background Crossfade System

Five `motion.div` layers at `z-index: 0`, each driven by an opacity motion value (`o1`–`o5`) derived from act-specific `useScroll` refs:

| Layer | Background | When visible |
|-------|-----------|-------------|
| o1 | `bgComfort` — near-black `#090706` + radial gradients | Act 1–2 (default) |
| o2 | `bgRooms` — dark forest green `#111A11` + radials | Act 2 overlay |
| o3 | `bgTerritory` — **light bone** `#F2EDE3` + warm radials | Act 3 (stays, no fade-out) |
| o4 | `bgDiscovery` — dark forest green, fades in over Act 3 | Act 4 |
| o5 | very dark, for Act 5 | Act 5 |

**Heading color transitions (Acts 3–4):** `motion.h2`/`motion.p` use `act3HeadingColor`, `act3SubColor`, `act4HeadingColor`, `act4SubColor` — `useTransform` values that flip between linen and ink tones as background changes.

### Acts

**Intro strip** — beige banner: "Where the longleaf pines run out of road"

**Act 1 — The Villa**
- Left: hero photo (temp: `/qGBP68_WYGc6iPdsayAE4_EqosgDho.jpg`, future: `villa.rooms[0].photos[0]`)
- Right: specs (guests/beds/baths/price), description, gallery CTA
- Modal: GalleryModal (all villa rooms)

**Act 2 — Comfort** (`bgComfort`, dark)
- Grid 3 cols: 1 "What's included" stub card + 5 COMFORT_CARDS
- Card height: `clamp(192px, 31vh, 308px)`
- Modal: ComfortModal (carousel)

**Act 3 — Territory** (`bgTerritory`, light bone)
- Heading: "126 acres. All of it yours." — dark ink color on light bg
- Grid **5 cols × 2 rows**: 2 placeholder slots + 8 EXPERIENCE_CARDS
  - Slot 0 (top-left placeholder): "No tab. No clock. / Everything here is already yours."
  - Slot 6 (bottom row, pos 2): "Coming soon / Still in the works"
  - Card height: `clamp(220px, 35vh, 360px)`; placeholder height: `clamp(259px, calc(35vh + 39px), 399px)`
- Badge bars above each card: 33px, dark tint on light bg, display italic signal color
- Modal: ExperienceModal (carousel + fish species grid for fishing card)

**Act 4 — Discovery** (`bgDiscovery`, dark)
- Heading: "Thirty minutes from here, the world opens up." — color transitions dark→dark
- 4 POI cards from `sandhillsData.nearby`
- Modal: NearbyModal (carousel with stats)

**Act 5 — The Sandhills Logic** (dark)
- 2-col card: left (kicker, h2 "The beach got busy. / The pines stayed quiet.", sub, PRIVATE_STATS 3-col grid), right (SVG map + contrast table Beach vs. Sandhills)
- Footer note: absolutely positioned bottom-left, `hidden lg:block`
- Left column `paddingBottom: clamp(52px, 7vh, 84px)` to prevent proof strip overlapping footer note

### Modals
All via `createPortal` to `document.body`. Pattern: `useState<number|null>` for active index, `AnimatePresence` + slide/fade motion.

---

## Scroll Stacking Primitives

**`StackCard`** (`src/components/primitives/StackCard.tsx`)
- Makes child `position: sticky; top: 0` at given z-index
- Animates `borderRadius` (48→0) and `boxShadow` (80px→none) as it snaps in

**`RoundedEntry`** (`src/components/primitives/RoundedEntry.tsx`)
- Like StackCard but only top corners round (top-left + top-right radius)
- Accepts optional `radius`, `className`, `style` props

**`RevealOnScroll`** (`src/components/primitives/RevealOnScroll.tsx`)
- Variants: `'fade'` (default), `'stagger-parent'`, `'stagger-child'`
- `whileInView`, `viewport={{ once: true, margin: '-80px' }}`, ease `[0.22, 1, 0.36, 1]`

**`Button`** (`src/components/primitives/Button.tsx`)
- Variants: `'primary'` (bg-signal), `'secondary'` (border-ink), `'ghost-light'` (border-linen/60)
- Renders `<a>` when `href` provided, `<button>` otherwise

---

## LandStory — Interactive Timer

`src/components/blocks/LandStory.tsx` — editorial section with a running "hours since your last real rest" counter. `requestAnimationFrame` loop driven by scroll speed (`accRef`, `speedRef`). Thresholds at 300/480/720/1200/2400 hours change copy. At 2400h: CTA appears. Modal: name + phone + date picker, validates, success state.

---

## HeroImmersive

- Height: `260dvh` (scrolls 3× viewport)
- Desktop photo: `/images/sandhills/desktop.webp`; mobile: `/images/sandhills/mobile.webp`
- Wordmark travels from center → top-left as hero scrolls out
- GLANCE block (5 stats) + PRESS block (4 pubs) fade in as wordmark exits
- Postmark: `clamp(293px, 26vw, 455px)`, `rotate(13deg)`, `z-index: 8`
- Sandhills wordmark color: `#8C3F1E`, no shadow
- Wordmark `top: 92`
- stickyBg overlay: `rgba(10,8,5,1)` → `rgba(234,227,211,0.42)`
- `data-zone` updates at 68% of hero height → StickyHeader uses this to flip logo color

---

## Design Tokens (`tailwind.config.ts`)

```
Neutrals:  bone #F2EDE3 · boneWarm #EAE3D3 · surface #E6DECC · dune #D4C8B4
           linen #E7DEC7 · linen2 #D4C8A8 · divider #D9CEB8
Darks:     ink #1F2420 · ink2 #5A5650 · night #1A1F1B · nightWarm #232924
           pineDeep #2A3A2A · longleaf #3E4F3A
Accents:   honey #A67C52 · honeyDark #3D2F1F · wiregrass #C9A96E
           signal #B05329 · signal2 #9A4722 · ember #D4804E

Fonts:  display → Fraunces, Canela, Georgia, serif  (headlines)
        eyebrow → Inter Tight, Inter  (small-caps labels, .eyebrow class)
        body    → Inter, system-ui

maxWidth: content 1400px · text 680px
keyframes: bounceCue (translateY 0→10px + opacity pulse, 2.4s infinite)
```

---

## Image Assets

```
public/
  images/
    sandhills/     16 main property photos + house.webp
    villa/         01_Exterior/ 02_Interior_Casita/ 03_Terrace/ 04_Sauna/
    nearby/        4 POI photos
    comfort/       brooklinen · marshall · appliences · weber · firepit
    fish/          6 species (both .png and .webp)
    press/         4 publication logos
  postmark.jpg
  bikes.webp / bikes.jpg
  f-orest.webp / f-orest.png
  airbnb_logo · booking_logo (.webp + .png)

Root (temp, to be moved):
  /qGBP68_WYGc6iPdsayAE4_EqosgDho.jpg  — Act 1 villa hero
  /qaYcANUQR-PNzw3QPCqKA_uEzp7Ijh.jpg  — The Lake card
```

**Missing (placeholders in EXPERIENCE_CARDS):**
- `/images/sandhills/orchard.webp`
- `/images/sandhills/apiary.webp`
- `/images/sandhills/farm_tour.webp`

---

## Key Constraints

- `prefers-reduced-motion` — every animation block checks `useReducedMotion()`; fallback renders static JSX
- `overflow: hidden` must **NOT** be set on VillaCascade's outer wrapper — breaks inner sticky positioning
- `mixBlendMode: 'screen'` intentionally removed everywhere
- `data-zone="dark"` / `"light"` attributes on section refs — StickyHeader reads these to flip logo
- Conversion anchor: `#reserve` → FinalCtaImmersive; phone: `tel:+18035550180`
- Mobile sticky bar: hardcoded in SandhillsLanding.tsx (bottom-0 fixed z-100)

---

## Build Config

Vite code splitting:
- `framer-motion` → `motion` chunk
- `react` + `react-router` → `react-vendor` chunk

SEO: `StructuredData.tsx` injects Resort schema + FAQPage schema. All URLs hardcoded to `https://horizonssandhills.com`.

# Horizons Sandhills — Landing Page

Private nature retreat marketing site. 126 acres, 6 villas, McBee SC.

---

## Quick Start

```bash
npm install
npm run dev        # localhost:5173
npm run build      # production build → dist/
npm run preview    # preview dist/
npm run lint       # ESLint
```

---

## Stack

| Layer | Tool |
|-------|------|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Styling | Tailwind CSS 3.4 |
| Animation | Framer Motion 12 |
| Routing | React Router 7 |
| Icons | Lucide React + Phosphor Icons |

---

## Project Structure

```
src/
  pages/
    SandhillsLanding.tsx   # main page — orchestrates all blocks
    StayDetail.tsx         # /stays/:slug detail pages
  components/
    blocks/                # full-width page sections
    primitives/            # Button, StackCard, RoundedEntry, RevealOnScroll, Eyebrow
    data/
      sandhills.ts         # all copy, image paths, structured content
    StructuredData.tsx     # JSON-LD (Resort + FAQPage schemas)

public/
  images/
    sandhills/             # main property photos
    villa/                 # room photos (Exterior / Interior / Terrace / Sauna)
    nearby/                # POI photos
    comfort/               # product photos (linens, speakers, etc.)
    fish/                  # fish species
    press/                 # publication logos
  postmark.jpg
  bikes.webp
```

---

## Content Editing

**All copy and image paths** live in `src/components/data/sandhills.ts` as a single typed object `sandhillsData`.

**Exception:** Card arrays are hardcoded in `VillaCascade.tsx`:
- `COMFORT_CARDS` — what's in the villa
- `EXPERIENCE_CARDS` — activities and experiences
- `PRIVATE_STATS` — the three proof numbers in Act 5
- `FISH_DATA` — fish species for the fishing modal

---

## Before Going Live

- [ ] Replace Cloudbeds placeholders in `sandhills.ts`:
  - `CLOUDBEDS_PROPERTY_ID`
  - `REPLACE_WITH_FOREST_VILLA_ROOM_TYPE_ID`
  - `REPLACE_WITH_THE_HOUSE_ROOM_TYPE_ID`
- [ ] Move temp images from project root to `public/images/`:
  - `qGBP68_WYGc6iPdsayAE4_EqosgDho.jpg` → villa hero (Act 1)
  - `qaYcANUQR-PNzw3QPCqKA_uEzp7Ijh.jpg` → lake card
- [ ] Add missing images:
  - `/images/sandhills/orchard.webp`
  - `/images/sandhills/apiary.webp`
  - `/images/sandhills/farm_tour.webp`
- [ ] Update phone number if needed: `tel:+18035550180`
- [ ] Verify all URLs in `StructuredData.tsx` point to `horizonssandhills.com`
- [ ] Re-enable commented-out sections when ready (Worth It chapter, NearbyGrid)

---

## Design

Aesthetic: editorial magazine — Aman Journal meets Garden & Gun. Typography-first, motion-restrained, every detail intentional.

**Color tokens** (defined in `tailwind.config.ts`):
- `signal` (#B05329) — amber accent
- `linen` (#E7DEC7) — warm off-white text
- `night` (#1A1F1B) — near-black background
- `bone` (#F2EDE3) — light background (Act 3 territory section)
- `ink` (#1F2420) — dark text on light bg

**Fonts:** Fraunces (display/headlines) · Inter Tight (eyebrow labels) · Inter (body)

---

## Key Mechanic — Scroll Stacking

`StackCard` wrappers make chapter opener cards sticky at z-10 / z-50. Content sections at higher z-indexes scroll over them, creating a "new layer surfaces" effect as you move down the page.

`prefers-reduced-motion` is respected throughout — all animations have static fallbacks.

CLAUDE.md
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.
Project Identity
Premium glamping landing page for Horizons Sandhills — a private nature retreat at 423 Woodmen Rd, Patrick, SC 29584. Single-page marketing site, no backend, no auth. The aesthetic is editorial/magazine (Aman Journal, Garden & Gun). Every design decision prioritises feel over feature density.
Commands
npm run dev        # dev server on :5173 (use -- --port 5174 if needed)
npm run build      # tsc -b && vite build
npm run lint       # eslint
npm run preview    # preview production build


Architecture
Single page: src/pages/SandhillsLanding.tsx orchestrates all blocks in order. No router.
Data layer: All copy, images paths, and structured content live in src/components/data/sandhills.ts as one typed object (sandhillsData). This is the only file that needs editing for content changes — components are purely presentational.
Component layers:
src/components/blocks/ — full-width page sections (one per scroll zone)
src/components/primitives/ — reusable atoms: Button, Eyebrow, RevealOnScroll, StackCard
Scroll stacking (key mechanic): Three StackCard wrappers at z-index 10/30/50 create the "card naплывает" effect. Each StackCard wraps only a ChapterOpener (the transition card). Content sections after each card get position: relative at z-index 20/40/60 so they scroll over the stuck opener. The sticky header sits at z-index 200.
Parallax depth stack inside HeroImmersive and ChapterOpener:
Layer 0 (bg photo): moves at 20% scroll speed via bgY
Layer 1 (display type): static, z-index 10
Layer 2 (foreground/mask): moves at 7% scroll speed via fgY, z-index 20
Design Tokens
All colors, fonts, and spacing are defined in tailwind.config.ts. Never use raw hex — always use token names (bg-night, text-linen, text-signal).
Conversion Points
Primary CTA: href="#reserve" → FinalCtaImmersive
Secondary CTA: href="#story" → StoryIntro
Mobile sticky booking bar: hardcoded in SandhillsLanding.tsx
Phone CTA: tel:+18035550180
Key Constraints
prefers-reduced-motion: animations check useReducedMotion()
mixBlendMode: 'screen' was intentionally removed

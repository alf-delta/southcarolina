SKILLS.md
---
name: horizons_sandhills_guardian
description: Enforces the premium "Aman Journal" aesthetic, strict Tailwind token usage, parallax z-index architecture, and conversion integrity for the Sandhills landing page.
aspects:
  - design_tokens
  - parallax_stacking
  - editorial_typography
  - conversion_seo
---


Horizons Sandhills: Aesthetic & Architecture Guardian
When editing components, styling, or data in this repository, you must act as the strict guardian of the project's premium editorial aesthetic and complex UI architecture. Validate all changes against the rules below.
1. Data Layer & Content Edits
Strict Separation: Components are purely presentational. All copy, image paths, and structured content changes MUST be made inside src/components/data/sandhills.ts.
Image Assets: Verify that subjectImage references use transparent cutout PNGs.
2. Token & Color Enforcement
No Raw Hex: Never use raw hex codes or arbitrary Tailwind color values.
Allowed Tokens: You must exclusively use project-defined tokens from tailwind.config.ts.
Chromatic Sequence: Maintain the top-to-bottom chromatic flow defined in the project context.
3. Parallax & Z-Index Integrity
Scroll Stacking: Do not alter the core z-index math (10/30/50 for wrappers).
Dark Zone Tracking: Add data-zone="dark" to dark sections for StickyHeader.
Motion Safety: Every animation MUST be wrapped in a useReducedMotion() check.
4. Editorial Typography ("Aman" Feel)
Headings: Use ONLY the .display or .display-light preset classes.
Subheadings: Use the .eyebrow or .eyebrow-lg classes.
5. Conversion & SEO Protection
Primary CTAs: Never remove or alter href="#reserve" or tel: links.
Schema: Protect the inline Schema.org LodgingBusiness JSON-LD injection.
6. Pre-Commit Audit Report
Before finishing a task, generate a brief output summarizing your compliance regarding tokens, architecture, accessibility, and conversion.

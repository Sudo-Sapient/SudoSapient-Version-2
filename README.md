# Sudo Sapient Website

Marketing website for **Sudo Sapient**, built with **Next.js 15**, **React 19**, **TypeScript**, and **Tailwind CSS**.

This repository has been organized so a new developer can understand it quickly, update content safely, and ship changes without reverse engineering the project.

## Quick start

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Scripts

- `npm run dev` — start local development
- `npm run build` — production build
- `npm run start` — run built app
- `npm run lint` — run ESLint
- `npm run lint:fix` — auto-fix lint issues where possible
- `npm run typecheck` — TypeScript validation

## Stack

- Next.js App Router (React 19)
- TypeScript
- Tailwind CSS
- Framer Motion + GSAP (ScrollTrigger, DrawSVG)
- OGL — WebGL blueprint background (homepage hero)
- Fonts: Fraunces (display/headings), Space Grotesk (body), Space Mono (labels)
- Radix UI primitives

## Project structure

```text
app/
  (marketing)/
    about/page.tsx
    contact/page.tsx
    services/page.tsx
    work/page.tsx
    work/[slug]/page.tsx
    layout.tsx
    page.tsx
  api/contact/route.ts
  globals.css
  layout.tsx

components/
  blueprint/    # visual system: frames, labels, diagrams, grid + WebGL background
  cursor/       # custom blueprint crosshair cursor (desktop only)
  figures/      # stick-figure system (shared 40x70 rig + flipbook poses)
  interactive/  # interaction wrappers (e.g. shoot-the-stickman easter egg)
  layout/       # Nav, Footer, FooterWordmark, Container
  motion/       # text-reveal animation primitive (AnimatedText)
  scenes/       # GSAP scroll-driven figure scenes (hero, process, ladder)
  sections/     # page sections used by marketing pages
  system/       # app-wide client guards (ClientErrorGuard — stale-chunk recovery)
  ui/           # shared form/button primitives

lib/
  projects.ts  # case study data source
  utils.ts     # className helpers / shared utilities

public/
  case-studies/  # site-served case study images

case-study-sources/  # raw/original case study images (not served)
archive/             # reference-only material, excluded from the app build
```

## Routing map

- `/` — home page
- `/about` — about page
- `/services` — services page
- `/work` — work index
- `/work/[slug]` — individual case studies
- `/contact` — project intake page
- `/api/contact` — form submission endpoint

## Where content lives

### 1) Case studies
All project and case study content currently lives in:

- `lib/projects.ts`

That file controls:
- work index cards
- selected work section on the home page
- featured case study on the home page
- dynamic case study pages at `/work/[slug]`

If a new developer needs to add or edit a project, start there first.

### 2) Homepage section composition
The homepage order is defined in:

- `app/(marketing)/page.tsx`

The actual section implementations are in:

- `components/sections/`

### 3) Layout shell
Shared navigation and footer are defined in:

- `app/(marketing)/layout.tsx`
- `components/layout/Nav.tsx`
- `components/layout/Footer.tsx`

### 4) Contact form
The UI is here:

- `components/sections/ContactForm.tsx`

The API handler is here:

- `app/api/contact/route.ts`

Note: the current API route validates input and logs submissions server-side. It is not yet connected to an email provider.

A starter env template is available at:

- `.env.example`

## Asset notes

- Final website images used by the app should live in `public/`.
- Raw/high-resolution source images are currently stored in `case-study-sources/`.
- The top-level `archive/` folder holds reference-only material (e.g. the figure-library sandbox) and is intentionally excluded from the app's TypeScript and ESLint configs. See `archive/README.md`.

## Handover notes

See:

- `docs/HANDOFF.md`

That file explains how to take over the project, update content, and avoid the most likely mistakes.

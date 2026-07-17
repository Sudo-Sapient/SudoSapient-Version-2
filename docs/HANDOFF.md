# Handoff Guide

## Repository purpose

This repo contains the public-facing Sudo Sapient marketing website.

Primary goals of the codebase:

- present the studio brand clearly
- showcase selected case studies
- collect inbound leads through the contact form
- stay easy to maintain for future designers/developers

## First things a new developer should know

### 1) The main content source is `lib/projects.ts`

Case studies are not coming from a CMS yet.

If you need to:

- add a new project
- update copy
- change featured work
- update work page cards

start in:

- `lib/projects.ts`

### 2) The homepage is section-driven

The homepage imports reusable sections from `components/sections/`.

Entry point:

- `app/(marketing)/page.tsx`

This means a redesign is usually easiest if you:

1. keep the page composition file small
2. edit or replace the relevant section component
3. avoid putting large blocks of markup directly in the page route

### 3) Shared chrome is already separated

Navigation and footer are centralized.

Use:

- `components/layout/Nav.tsx`
- `components/layout/Footer.tsx`

Avoid duplicating nav/footer logic inside individual pages.

### 4) Contact form opens Gmail directly

The contact form lives in:

- `components/sections/ContactForm.tsx`

A valid submit opens a pre-filled Gmail compose tab addressed to
`sudosapient@gmail.com`; nothing is posted to this website or persisted by it.
There are no contact-form deployment environment variables. If the studio inbox
changes, update the `RECIPIENT` constant in that component.

## Folder responsibilities

### `app/`

Next.js routes, route groups, and layouts.

### `components/blueprint/`

Brand-specific visual language and reusable presentation primitives.
Examples:

- frames
- diagram components
- technical labels
- grid backgrounds

### `components/sections/`

Marketing sections composed into pages.
This is usually where most content/layout updates should happen.

### `components/ui/`

Low-level reusable UI controls.
Keep these generic.

### `components/figures/`

Illustrative stick-figure components used in the brand system. They share one
40×70 rig (`figures/rig.ts`) and animate via flipbook (see "Animation &
interactive systems" below).

### `components/scenes/`

GSAP + ScrollTrigger scenes that animate the figures on scroll (hero "plotter
pass", process "drafting pass", the side `LadderClimber`). These use the premium
DrawSVGPlugin.

### `components/motion/`

Text-reveal primitive (`AnimatedText`) — rise / scramble / typewriter effects
built on Framer Motion + split-type.

### `components/cursor/`

The custom blueprint crosshair cursor (`BlueprintCursor`). Desktop / fine-pointer
only; hidden on touch and under reduced motion.

### `components/interactive/`

Interaction wrappers — currently `Shootable`, the "shoot the stickman" easter
egg layered over figures without touching their base animation.

### `components/system/`

App-wide client guards. `ClientErrorGuard` auto-recovers from stale code-chunk
errors (e.g. an open tab after a redeploy) and silences benign ResizeObserver
noise. Mounted once in `app/layout.tsx`.

### `lib/`

Shared data and utilities.

### `public/`

Web-served assets.
Anything referenced by `next/image` using a string path should be here.

### `case-study-sources/`

Source/original case study images. Treat this as a raw asset holding area.
The website serves images from `public/case-studies/`, not from here.

### `archive/`

Reference-only material (the figure-library sandbox). Not part of the main app
runtime. It is excluded in `tsconfig.json` and ignored by ESLint config.
See `archive/README.md`.

## Animation & interactive systems

This site has a custom **2D** animation layer (no 3D). It is the part most likely
to confuse a new developer, so it is documented here in full.

### Fonts

`app/layout.tsx` loads three faces via `next/font`, exposed as Tailwind tokens:
**Archivo Black** — display/wordmark → `font-display`; **Archivo** →
`font-sans` (body copy); **IBM Plex Mono** → `font-mono` (technical labels).

### Stick-figure system (`components/figures/`)

- `rig.ts` defines the shared **40×70 viewBox**, head radius, and `2.35px`
  stroke weight used by the main figure family.
- `ClimberStylePoses.tsx` and `ClimberPosePlayer.tsx` provide the preferred
  thick, articulated pose language. New figures should use bent joints,
  connected props, planted feet, and the shared stroke weight.
- Small repeated motions (walk cycle, bobbing) live in `app/globals.css`.
  Scripted scenes use GSAP but must not animate the same SVG path with both
  DrawSVGPlugin and MorphSVGPlugin; that previously caused partial limbs.
- `MascotFigure` is the roaming "doorman" used by the team grid.
- All figure motion is disabled under `prefers-reduced-motion`.

### Scroll scenes (`components/scenes/`)

GSAP + ScrollTrigger (+ DrawSVGPlugin) drive the hero, process pipeline, and the
side `LadderClimber`. The climber recolours itself to stay legible over light/
dark sections; that recolour is **throttled (~7×/s)** so it doesn't force layout
on every scroll frame.

### Text reveals (`components/motion/AnimatedText.tsx`)

`<AnimatedText variant="rise|scramble|typewriter" … />`. The real text is always
in the DOM (SSR + accessibility via `aria-label`); the animated copy is
`aria-hidden`. Reduced motion shows the final text immediately.

### Custom cursor (`components/cursor/BlueprintCursor.tsx`)

A blueprint crosshair that recolours (white on dark, blue on light) and snaps CAD
brackets onto links/buttons/figures. Fine-pointer only. Its background detection
is throttled so the crosshair itself stays frame-smooth.

### Blueprint WebGL background (`components/blueprint/BlueprintCanvas.tsx`)

A single **OGL** fragment shader (deep-blue grid that drifts, a sweeping light,
paper grain, a cursor ripple, and a scroll "print-in"). It is layered on top of
the static `<GridBackground/>` (which is the **no-WebGL fallback**). Important
behaviours:

- **One instance only — the homepage Hero.** Every mounted canvas is its own
  WebGL context, and browsers cap simultaneous contexts (~8–16). To stay well
  clear of that limit, only the Hero runs the live shader; all other blue
  sections use the static `<GridBackground/>` (visually near-identical). **Do not
  scatter `<BlueprintCanvas/>` across many sections** — that's what caused the
  blank/"lost context" renders. If you need it lower on a page, refactor to one
  shared/fixed canvas first.
- **Disabled on phones (<768px)** — the cheap static grid shows instead.
- DPR capped at 1.5; the render loop **pauses** when off-screen or the tab is
  hidden.
- **Fails safe**: if the GPU drops the WebGL context, the loop stops and the
  static grid shows — it must never throw inside the render loop.

### "Shoot the stickman" easter egg (`components/interactive/Shootable.tsx`)

Aim the crosshair at a figure → it surrenders → click to "shoot" it. It randomly
falls over or fades out, then respawns. It is **additive** — it wraps a figure
without changing the figure's own animation.

### Team grid (`components/sections/TeamGrid.tsx`)

Portraits are **flip-lid cards** (front photo / back bio). The bio + focus tags
come from the `team` array in `app/(marketing)/about/page.tsx` (placeholder copy
— safe to edit). On single-row desktop a roaming `MascotFigure` walks to the
clicked card and "opens" it; below `lg`, or on touch / reduced motion, the card
just flips on tap. **Faces are never covered.**

### Performance & device rules (follow these when adding effects)

- Gate heavy/continuous work behind `prefers-reduced-motion` and pointer/size
  media queries (see existing components for the pattern).
- Throttle any per-scroll or per-pointer work that reads layout
  (`getBoundingClientRect`, `getComputedStyle`, `elementsFromPoint`).
- WebGL is desktop/tablet only and must degrade to the static grid.

### Dependency note

"**Motion**" in this project means **Framer Motion** (`framer-motion`). The
standalone `motion` and `lenis` packages are intentionally **not** installed.
Animation libraries in use: `framer-motion`, `gsap` (+ ScrollTrigger,
DrawSVGPlugin), `ogl` (WebGL background), `split-type` (text splitting).

## Safe change workflow

### Content-only update

1. Edit `lib/projects.ts` or the relevant section file.
2. Run `npm run lint`
3. Run `npm run typecheck`
4. Run `npm run build`

### Layout/style update

1. Update the relevant section or layout component.
2. Check responsive behavior on home, work, and contact pages.
3. Re-run lint, typecheck, and build.

### Adding a new case study

1. Add the image to `public/case-studies/`
2. Add the project object to `lib/projects.ts`
3. Confirm the slug is clean and URL-safe
4. Verify `/work/[slug]` builds correctly
5. If it should be featured on the homepage, set `featured: true`

## Current technical decisions

- App Router is being used, not Pages Router.
- Styling is Tailwind-based.
- Motion is handled with Framer Motion; scroll choreography with GSAP +
  ScrollTrigger (+ DrawSVGPlugin); the ambient blueprint background with OGL.
- The visual identity is strictly 2D (a blueprint / CAD aesthetic). 3D /
  react-three-fiber was tried and removed — keep it 2D.
- Project data is file-based, not CMS-based.
- There is no backend database in this repo.

## Known caveats

### Gmail compose is client-side

The contact page depends on Gmail being available in the visitor's browser. A
visible `mailto:sudosapient@gmail.com` fallback is shown after they submit if a
browser blocks the new compose tab.

### Duplicate/auxiliary asset areas exist by design

- `public/case-studies/` = app-ready assets
- `case-study-sources/` = original/raw image drop zone
- `archive/figures-sandbox/` = archived sandbox project

Do not merge these blindly without checking how they are being used.

## Recommended next improvements

1. Introduce a CMS if non-developers need to edit case studies
2. Add a database/CRM webhook if structured lead history is required later
3. Add image optimization/source-of-truth rules if more case studies are coming
4. Keep Next.js patched as upstream security releases become available

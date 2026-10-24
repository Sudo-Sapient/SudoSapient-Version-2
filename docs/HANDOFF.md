# Handoff Guide

## What this repo is

The public marketing site for Sudo Sapient, an AI transformation studio. Its jobs: explain
the offer, show the team, and collect leads through the contact form. There is no CMS,
no database and no backend; all copy lives in the code.

Read `README.md` first for setup, routes and where content lives.

## First things a new developer should know

1. **Pages are thin, sections do the work.** Home composes sections from
   `components/sections/`. Services and About keep their copy inline in the page file.
2. **Every stickman animation is a generated Rive file.** Edit `scripts/rive/<name>.mjs`,
   run `npm run rive:<name>`, commit the `.riv`. Full guide: `docs/RIVE.md`.
3. **Some UI is timed against the animations.** Process, Pillars, Testimonials,
   TeamElevator and FinalCTA hold constants that must match the generator scripts. The
   table is in `docs/RIVE.md`, "Syncing pages to animations".
4. **The contact form posts to Formspree** and needs `NEXT_PUBLIC_FORMSPREE_ID` at build
   time. Without it every submit shows the "email us directly" error.
5. **Case studies are parked.** `/work` shows a "coming soon" portfolio. The
   `/work/[slug]` pages still build from `lib/projects.ts` but nothing links to them.

## Shared chrome

`app/(marketing)/layout.tsx` wraps every page in `Nav`, the right edge `LadderClimber`, and
`Footer`. `app/layout.tsx` adds the fonts, `BlueprintCursor`, `ClientErrorGuard` and
`MotionPrefs`. Do not duplicate nav or footer inside pages.

## Animation and interactive systems

### Rive scenes (`components/motion/`)

`RiveScene` lazy loads `RivePlayer` (the Rive runtime) only when a scene nears the
viewport and its `.riv` exists. Until then, and always under `prefers-reduced-motion`,
it renders the `fallback` prop. Scenes pause while off screen. Details in `docs/RIVE.md`.

| Section                | Rive file                   | Fallback                                    |
| ---------------------- | --------------------------- | ------------------------------------------- |
| `Hero`                 | `hero.riv`                  | `HeroScene` (GSAP DrawSVG plotter)          |
| `Pillars`              | `strike.riv`                | none; first phrase shown struck out         |
| `PortfolioSoon`        | `portfolio.riv`             | "Coming soon" text                          |
| `Process`              | `transform.riv`             | text list of the beats                      |
| `Testimonials`         | `testimonials.riv`          | none                                        |
| `FinalCTA`             | `cta.riv` + video overlay   | one line of text; no video                  |
| `TeamElevator`         | `about.riv` cabs            | photo only (Kishen: "Classified")           |
| `Footer`               | `footer.riv`                | `FooterScene` / `MobileFooterLaunch` (GSAP) |
| `LadderClimber`        | `climber.riv`               | static SVG climber                          |
| Services, About, legal | `services.riv`, `about.riv` | none                                        |

### Team elevator (`components/sections/TeamElevator.tsx`)

The About page team section. Pressing a floor shuts the doors, ticks the floor counter,
dings, and opens on that person's cab in `about.riv` (state machine `SM`): they are
caught slacking (`caught`), then pretend to code (`code`). After `gagMs` the real photo
fades in. Tapping the cab swaps photo and stickman. The lift tours all floors on its own
until the visitor presses one. Kishen (floor 6) has no photo: after `shotMs` he shoots,
the glass cracks, the lift drops out of frame and a new one lands and restarts the tour.
Under reduced motion there are no gags and no tour, only the photo on arrival.

Team data (`name`, `role`, `img`, `artboard`, `gagMs`, `shotMs`, `caught`, `bio`) is the
`team` array in `app/(marketing)/about/page.tsx`. Adding a person means adding a cab in
`scripts/rive/cabs.mjs`, rebuilding `about.riv`, and adding a floor with matching
`artboard` and `gagMs`.

### Testimonials podium

`Testimonials.tsx` drives the `Podium` state machine's `speaker` input with the active
index. It rotates every 9.5s while on screen, stops once the visitor picks a client, and
never rotates under reduced motion. The six seats and props in `testimonials.mjs` follow
the order of the `testimonials` array, so reordering one means reordering the other.

### Final CTA

Hover or focus on the main button sets `seat` in `cta.riv` and an empty chair slides in.
A muted, looping `public/media/studio-reel.mp4` sits over the TV drawn in the scene
(hidden below `sm` and under reduced motion), with a "Sound on" toggle. It uses
`preload="none"` and only plays while on screen.

### Ladder climber (`components/scenes/LadderClimber.tsx`)

A climber on a ladder at the right edge (`lg` and up). GSAP ScrollTrigger moves him down
the rail with scroll; `climber.riv` animates the figure from three bool inputs. He
recolours over light and dark sections and can be "shot" with the cursor.

### Other systems

- `AnimatedText` (`components/motion/`): rise, scramble and typewriter text reveals
  (GSAP + split-type). Real text stays in the DOM for SEO and screen readers.
- `BlueprintCursor`: crosshair cursor, only on devices with hover and a fine pointer.
- `BlueprintCanvas`: OGL WebGL grid behind the home hero only. Every canvas is its own
  WebGL context, so do not add more instances; other blue sections use the static
  `GridBackground`. Disabled on phones and fails safe to the static grid.
- `Shootable` (`components/interactive/`): the "shoot the stickman" easter egg on the
  older SVG figures.
- `components/figures/`: the older SVG figure library (40 × 70 rig). Still used by the
  fallbacks, `ContactSuccessScene` and `/work/[slug]`. New animation work goes into Rive.

### Motion rules

- Respect `prefers-reduced-motion`. `MotionPrefs` covers framer-motion, `RiveScene`
  covers Rive; anything else must check it itself.
- framer-motion overwrites the `transform` of `motion.*` elements, so Tailwind
  translate/scale classes on them are lost. Position with a static wrapper.
- Throttle any per scroll or per pointer work that reads layout.
- "Motion" here means `framer-motion`. The standalone `motion` and `lenis` packages are
  not installed.

## Safe change workflow

Content or copy change:

1. Edit the file listed in README "Where content lives". Follow the copy rules there.
2. `npm run format`, then `npm run validate`.

Animation change:

1. Edit the generator, run `npm run rive:<name>`, check it in `npm run dev -- -p 4000`.
2. If timing changed, update the synced constants (`docs/RIVE.md`).
3. Commit the script and the `.riv` together.

Re-launching case studies:

1. Add images to `public/case-studies/` and records to `lib/projects.ts`.
2. Replace `PortfolioSoon` on `app/(marketing)/work/page.tsx` with a real index and link
   to `/work/[slug]`.

## Tests

Vitest + Testing Library (jsdom). Tests sit next to the code: `lib/projects.test.ts`,
`lib/utils.test.ts`, `components/blueprint/TechLabel.test.tsx`. Animations are checked by
the build and by hand.

## Known caveats

- Team bios, FAQ answers and the privacy and terms pages are marked as drafts in the
  code. The legal pages say to have them reviewed by a lawyer.
- `Project.featured` and `Project.isPlaceholder` in `lib/projects.ts` are not read by any
  component since the redesign.

## Recommended next improvements

1. Set `NEXT_PUBLIC_FORMSPREE_ID` in every build environment (including the GitHub
   Pages workflow) and test a real submit.
2. Publish real case studies and relink `/work/[slug]`.
3. Remove unused dependencies and components once confirmed.
4. Keep Next.js patched.

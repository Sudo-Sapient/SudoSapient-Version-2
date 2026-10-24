# Project Structure Reference

## Top level

```text
app/                  # routes and layouts (Next.js App Router)
components/           # React components
lib/                  # data and helpers
scripts/rive/         # .riv generators (Node, run with npm run rive:<name>)
public/               # served assets
docs/                 # handover docs
case-study-sources/   # raw case study images, not served
archive/              # reference only, excluded from build and lint
package.json, next.config.ts, tailwind.config.ts, tsconfig.json,
eslint.config.mjs, postcss.config.mjs, vitest.config.ts, vitest.setup.ts,
.prettierrc.json, .prettierignore, .env.example, .github/workflows/deploy-pages.yml
```

## `app/`

| Path                                                                           | Purpose                                                                         |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| `layout.tsx`                                                                   | Fonts, site metadata, `ClientErrorGuard`, `MotionPrefs`, `BlueprintCursor`      |
| `(marketing)/layout.tsx`                                                       | Skip link, `Nav`, `LadderClimber`, `<main>`, `Footer`                           |
| `(marketing)/page.tsx`                                                         | Home: `Hero`, `Pillars`, `PortfolioSoon`, `Process`, `Testimonials`, `FinalCTA` |
| `(marketing)/services/page.tsx`                                                | Services page. Copy is inline in the file                                       |
| `(marketing)/about/page.tsx`                                                   | About page. `team` and `beliefs` arrays are inline; renders `TeamElevator`      |
| `(marketing)/work/page.tsx`                                                    | `PortfolioSoon as="h1"` and `FinalCTA`                                          |
| `(marketing)/work/[slug]/page.tsx`                                             | Case study pages from `lib/projects.ts` (built, not linked)                     |
| `(marketing)/contact/page.tsx`                                                 | Intake page around `ContactForm`                                                |
| `(marketing)/privacy/page.tsx`, `terms/page.tsx`                               | Legal copy, rendered by `LegalPageLayout`                                       |
| `not-found.tsx`, `error.tsx`, `opengraph-image.tsx`, `icon.svg`, `globals.css` | 404, error boundary, OG image, favicon, global styles                           |

## `components/`

| Folder         | Contents                                                                                                                                                                      |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `sections/`    | `Hero`, `Pillars`, `PortfolioSoon`, `Process`, `Testimonials`, `FinalCTA`, `TeamElevator`, `ContactForm`, `LegalPageLayout`                                                   |
| `layout/`      | `Nav`, `Footer`, `Container`. `FooterScene` and `MobileFooterLaunch` are the SVG/GSAP fallbacks for `footer.riv`                                                              |
| `motion/`      | `RiveScene` (lazy Rive wrapper with fallback), `RivePlayer` (the runtime, loaded on demand), `AnimatedText` (rise, scramble, typewriter text reveals)                         |
| `scenes/`      | `LadderClimber` (the climber on the right rail, plays `climber.riv`), `HeroScene` (SVG fallback for `hero.riv`), `ContactSuccessScene` (shown after a successful form submit) |
| `blueprint/`   | `BlueprintFrame`, `CornerBrackets`, `TechLabel`, `GridBackground`, `BlueprintCanvas` (OGL WebGL grid, home hero only), `ModuleStack` (used by `HeroScene`)                    |
| `figures/`     | The older SVG stick figure library (40 × 70 rig in `rig.ts`). Used by the SVG fallbacks, `ContactSuccessScene`, the ladder climber fallback and `/work/[slug]`                |
| `interactive/` | `Shootable`, the "shoot the stickman" wrapper used by `BreathingFigure` and the figure players                                                                                |
| `cursor/`      | `BlueprintCursor`, the crosshair cursor (fine pointers only)                                                                                                                  |
| `system/`      | `ClientErrorGuard` (recovers from stale chunk errors), `MotionPrefs` (framer-motion honours reduced motion)                                                                   |
| `ui/`          | `Button`, `Input`, `Select`, `Textarea`                                                                                                                                       |

## `lib/`

| File          | Purpose                                                                          |
| ------------- | -------------------------------------------------------------------------------- |
| `site.ts`     | `CTA_LABEL`, `STAGES` (Audit, Pilot, Scale, Embed), `withBasePath` / `BASE_PATH` |
| `projects.ts` | Case study records and `getProject(slug)`                                        |
| `utils.ts`    | `cn` (clsx + tailwind-merge)                                                     |
| `*.test.ts`   | Vitest tests for `projects` and `utils`                                          |

## `scripts/rive/`

One generator per `.riv`, plus shared `kit.mjs`, `agents.mjs` and `cabs.mjs`. See
`scripts/rive/README.md` and `docs/RIVE.md`.

## `public/`

| Path            | Contents                                                                                 |
| --------------- | ---------------------------------------------------------------------------------------- |
| `rive/`         | Generated `.riv` files (committed) and `rive.wasm` (copied by `postinstall`, gitignored) |
| `team/`         | Team photos used by the about page elevator                                              |
| `media/`        | `studio-reel.mp4`, played over the TV in the final CTA                                   |
| `case-studies/` | Case study images                                                                        |
| `CNAME`         | `sudosapient.com`, for GitHub Pages                                                      |

## Not part of the app build

- `archive/`: the old figure library sandbox. Excluded in `tsconfig.json` and
  `eslint.config.mjs`. See `archive/README.md`.
- `case-study-sources/`: raw images. The site serves only `public/case-studies/`.
- `.prettierignore` also skips `public`, `archive`, `case-study-sources` and `.impeccable`.

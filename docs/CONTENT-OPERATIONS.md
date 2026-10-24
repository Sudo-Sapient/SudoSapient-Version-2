# Content & Asset Operations

All copy lives in the code. The full map of which file holds which copy is in `README.md`,
"Where content lives". Follow the copy rules there (no dashes as connectors, no arrow
characters, never say "product", AI transformation positioning).

## Case studies

Case study records live in `lib/projects.ts`. Each record drives one `/work/[slug]`
page. These pages are built but **not linked** right now: `/work` and the home page
show the "coming soon" `PortfolioSoon` section instead.

Required fields: `slug`, `title`, `client`, `year`, `discipline` (`"AI agents"`,
`"Operations"`, `"Content"` or `"Web & Brand"`), `oneLiner`, `problem`, `approach`,
`outcome`, `metrics`, `isPlaceholder`.

Optional fields: `featured`, `image`, `externalUrl` (opens when the hero image is
clicked).

`featured` and `isPlaceholder` are not read by any component at the moment.

## Images

| Folder                 | Use                                                    |
| ---------------------- | ------------------------------------------------------ |
| `case-study-sources/`  | Raw originals. Not served                              |
| `public/case-studies/` | Web ready case study images                            |
| `public/team/`         | Team photos for the About page elevator                |
| `public/media/`        | `studio-reel.mp4`, the video over the TV in `FinalCTA` |

Process for a case study image:

1. Drop the original in `case-study-sources/`.
2. Export a web ready version to `public/case-studies/`.
3. Reference it in `lib/projects.ts` as `/case-studies/<file>`.

Team photos are referenced by `img` in the `team` array in
`app/(marketing)/about/page.tsx`. Leave `img` out to show no photo.

## Testimonials

Edit the `testimonials` array in `components/sections/Testimonials.tsx`. There are six,
and each one has a seat and prop in `scripts/rive/testimonials.mjs` in the same order.
Adding, removing or reordering testimonials means changing that script and running
`npm run rive:testimonials`.

## Animated copy

Some copy is timed to an animation. Change it together with its generator:

- `PHRASES` in `components/sections/Pillars.tsx` and `scripts/rive/strike.mjs`
- `BEATS` in `components/sections/Process.tsx` and `scripts/rive/transform.mjs`

See `docs/RIVE.md`.

## Contact flow

- Page copy: `app/(marketing)/contact/page.tsx`
- Form: `components/sections/ContactForm.tsx`

The form posts to Formspree using `NEXT_PUBLIC_FORMSPREE_ID`. Submissions land in the
Formspree account for that form, not on this site. If the ID is missing or the request
fails, the visitor sees a message to email `sudosapient@gmail.com` (`RECIPIENT` in the
form). The budget and timeline options are `BUDGETS` and `TIMELINES` in the same file.

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

### 4) The contact flow is only partially wired
The contact API currently:
- validates required fields
- logs submissions server-side
- returns success/failure JSON

It does **not** yet send email or persist leads.

Relevant file:
- `app/api/contact/route.ts`

Starter env template:
- `.env.example`

If production lead delivery is needed, wire this route to:
- Resend
- SendGrid
- Postmark
- a CRM webhook
- or a database-backed queue

## Folder responsibilities

### `app/`
Next.js routes, route groups, layouts, and the contact API.

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
Illustrative figure components used in the brand system.

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
- Motion is handled with Framer Motion.
- Project data is file-based, not CMS-based.
- There is no backend database in this repo.

## Known caveats

### Contact route is stubbed
Submissions are not yet delivered anywhere outside logs.

### Duplicate/auxiliary asset areas exist by design
- `public/case-studies/` = app-ready assets
- `case-study-sources/` = original/raw image drop zone
- `archive/figures-sandbox/` = archived sandbox project

Do not merge these blindly without checking how they are being used.

## Recommended next improvements

1. Wire contact submissions to a real provider
2. Introduce a CMS if non-developers need to edit case studies
3. Add deployment documentation if this will be handed to a client team
4. Add image optimization/source-of-truth rules if more case studies are coming

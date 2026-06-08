# Content & Asset Operations

## Case study content source
All case study records live in:
- `lib/projects.ts`

Each record controls:
- work index card
- homepage selected work card
- dynamic `/work/[slug]` page
- homepage featured case study eligibility

## Required project fields

Each project uses:
- `slug`
- `title`
- `client`
- `year`
- `discipline`
- `oneLiner`
- `problem`
- `approach`
- `outcome`
- `metrics`
- `isPlaceholder`

Optional fields:
- `featured`
- `image`

## Image workflow

### Use this folder for production assets
- `public/case-studies/`

### Use this folder for raw/source images
- `case-study-sources/`

Recommended process:
1. Drop original image in `case-study-sources/`
2. Export a web-ready version
3. Save the final version to `public/case-studies/`
4. Reference it in `lib/projects.ts` using a `/case-studies/...` path

## Featured case study behavior
The homepage featured case study component looks for:
- first project with `featured: true`

Fallback:
- project with slug `mayaakars`

File:
- `components/sections/FeaturedCaseStudy.tsx`

## Contact flow content
Contact page copy lives in:
- `app/(marketing)/contact/page.tsx`

Contact form behavior lives in:
- `components/sections/ContactForm.tsx`

Submission handling lives in:
- `app/api/contact/route.ts`

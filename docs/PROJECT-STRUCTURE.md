# Project Structure Reference

## High-level layout

```text
D:/sudosapient new website/
├─ app/
├─ components/
├─ lib/
├─ public/
├─ docs/
├─ case-study-sources/
├─ archive/
├─ package.json
├─ tsconfig.json
├─ next.config.ts
├─ tailwind.config.ts
├─ postcss.config.mjs
├─ eslint.config.mjs
└─ .gitignore
```

## Source of truth by concern

### Routing

- `app/`

### Shared UI

- `components/ui/`

### Brand visuals / diagrams / decorative system

- `components/blueprint/`
- `components/figures/`
- `components/scenes/`

### Content sections

- `components/sections/`

### Shared data

- `lib/projects.ts`

### Utility functions

- `lib/utils.ts`

### Site assets

- `public/`

### Documentation for takeover

- `docs/`

## What is intentionally not part of the main app build

### `archive/`

Reference-only material that the running site never imports — currently the
figure-library sandbox (`archive/figures-sandbox/`, a duplicate of
`components/figures/` plus a standalone `preview.html`). See `archive/README.md`.

It is excluded from:

- TypeScript main project compilation (`tsconfig.json` → `exclude`)
- ESLint main project scanning (`eslint.config.mjs` → `ignores`)

That keeps the production app cleaner while preserving reference work.

### `case-study-sources/`

Raw/original case study images. A holding area only — the website serves
images from `public/case-studies/`, never from here.

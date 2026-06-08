# archive/

This folder holds **reference material that is NOT part of the running website**.
It is excluded from the app build (`tsconfig.json` → `exclude`) and from linting
(`eslint.config.mjs` → `ignores`). Nothing in `app/`, `components/`, or `lib/`
imports from here.

## figures-sandbox/

A standalone scaffold that was used to design and preview the brand figure
illustrations in isolation.

- The `Figure*.tsx` files here are **duplicates** of the live components.
  The version the website actually uses lives in **`components/figures/`** —
  edit those, not these.
- `preview.html` is the one genuinely useful artifact: a self-contained page
  that renders the whole figure set on the brand-blue grid. Open it directly in
  a browser to eyeball the illustrations without running the Next.js app.
- The `package.json`, `package-lock.json`, `next.config.ts`, `tsconfig.json`,
  etc. are leftover scaffolding from when this was a separate mini-project.
  They are inert — the sandbox is not run independently anymore.

If you ever decide this reference is no longer needed, the whole `archive/`
folder can be deleted without affecting the website.

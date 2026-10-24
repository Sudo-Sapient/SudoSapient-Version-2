# Deployment Runbook

This is the release checklist for the Sudo Sapient marketing site.

## 1. Prerequisites

- Node.js version supported by Next.js 15 (use the deployment platform's current LTS release).
- `npm ci` rather than `npm install` in CI so the committed `package-lock.json` is honored.
- A deployment platform that supports the Next.js App Router (for example Vercel).

## 2. Environment variables

| Variable                | Needed for                                             |
| ----------------------- | ------------------------------------------------------ |
| `NEXT_PUBLIC_BASE_PATH` | Optional. Only if the site is served from a sub path   |
| `GITHUB_PAGES`          | Set to `true` for a static export (`output: "export"`) |

No secrets are needed: the contact page links straight to WhatsApp and email.

## 3. Required release gate

Run this from the repository root before every deploy:

```bash
npm ci
npm run format:check
npm run validate
```

`npm run validate` runs, in order:

1. TypeScript validation
2. ESLint
3. Vitest tests
4. Production build

Do not deploy if one of these fails.

## 4. Deploy

### GitHub Pages (configured)

This repository includes `.github/workflows/deploy-pages.yml`. Every push to
`main` runs typecheck, lint and tests, builds a static export with
`GITHUB_PAGES=true`, and deploys `out/` to GitHub Pages. `public/CNAME` points the
site at the custom domain:

```text
https://sudosapient.com
```

No base path is set, because the site is served from the domain root.

GitHub Pages is static hosting, but all browser-side functionality remains
interactive: Rive scenes, GSAP and Framer Motion animations, WebGL, navigation,
selectors, video playback, and stickman interactions. Security headers from
`next.config.ts` are not applied on a static export. Server-only APIs are not supported;
this project does not currently require one.

To reproduce the Pages build locally:

```bash
GITHUB_PAGES=true npm run build
```

### Vercel

1. Import the repository in Vercel.
2. Framework preset: **Next.js**.
3. Build command: `npm run build` (default is fine).
4. Install command: `npm ci`.
5. Deploy a preview first, then promote it after completing the smoke checklist.

### Other Node hosts

```bash
npm ci
npm run build
npm run start
```

The host must forward traffic to the `PORT` it provides. Do not hard-code port
3000 in production.

## 5. Post-deploy smoke checklist

On the deployed URL, check these at desktop, tablet, and mobile widths:

- `/`, `/about`, `/services`, `/work`, `/contact`, `/privacy`, `/terms`
- `/work` shows the "coming soon" portfolio; `/work/[slug]` pages still render
- navigation opens/closes on touch and keyboard
- no horizontal page scroll at 320px wide
- Rive scenes load (no 404s for `/rive/*.riv` or `/rive/rive.wasm`) and stay inside
  their panels
- `prefers-reduced-motion` leaves content visible without continuous motion
- the Final CTA video loads, plays, and its mute control works
- on `/contact`, the WhatsApp button opens a chat with the prefilled hello and the
  email button opens a draft to `sudosapient@gmail.com`
- verify the 404 route and social/Open Graph preview
- on a Node host (not GitHub Pages), inspect the production response headers (`X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, and `Permissions-Policy`)

## 6. Rollback

Keep the previous deployment available in the hosting provider. If a release
breaks, promote the previous deployment immediately, then reproduce and fix the
issue in a new preview. Do not hot-edit production files or secrets.

## 7. Dependency advisory policy

Run this periodically:

```bash
npm audit --omit=dev
```

At the time this guide was written, `npm audit` flags a moderate advisory in the
PostCSS copy bundled by the current Next.js dependency range. `npm audit fix
--force` proposes downgrading Next.js to version 9, which is unsafe and must not
be used. Track the upstream Next.js release for its patched PostCSS dependency,
then update Next.js normally and rerun the release gate.

# Deployment Runbook

This is the release checklist for the Sudo Sapient marketing site.

## 1. Prerequisites

- Node.js version supported by Next.js 15 (use the deployment platform's current LTS release).
- `npm ci` rather than `npm install` in CI so the committed `package-lock.json` is honored.
- A deployment platform that supports the Next.js App Router (for example Vercel).

## 2. Contact form behavior

The contact form is client-side and opens a pre-filled Gmail compose window to
`sudosapient@gmail.com`. It does not require API keys or deployment environment
variables, and it does not store visitor details on the site.

If the studio inbox changes, update `RECIPIENT` in
`components/sections/ContactForm.tsx`.

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
3. Vitest unit/API tests
4. Production build

Do not deploy if one of these fails.

## 4. Deploy

### GitHub Pages (configured)

This repository includes `.github/workflows/deploy-pages.yml`. Every push to
`main` validates the project, exports it under the repository base path, and
deploys the `out/` artifact to GitHub Pages.

Expected URL:

```text
https://sudo-sapient.github.io/SudoSapient-Version-2/
```

GitHub Pages is static hosting, but all browser-side functionality remains
interactive: GSAP and Framer Motion animations, WebGL, navigation, selectors,
video playback, and stickman interactions. Server-only APIs are not supported;
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
5. Add the production environment variables above.
6. Deploy a preview first, then promote it after completing the smoke checklist.

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
- every `/work/[slug]` case-study route
- navigation opens/closes on touch and keyboard
- no horizontal page scroll at 320px wide
- figure scenes stay inside their panels; mobile fallbacks remain readable
- `prefers-reduced-motion` leaves content visible without continuous motion
- the Final CTA video loads, plays, and its mute control works
- submit the contact form and confirm a Gmail compose tab opens with the
  recipient, subject, and form details pre-filled; test the visible mailto
  fallback too
- verify the 404 route and social/Open Graph preview
- inspect the production response headers (`X-Content-Type-Options`, `X-Frame-Options`,
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

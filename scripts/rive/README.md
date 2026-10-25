# scripts/rive

Generators for every `.riv` in `public/rive/`. Edit the script, run it from the repo root,
commit the script and the regenerated `.riv` together. Never edit a `.riv` by hand.

| Script             | Builds                         | Run                         |
| ------------------ | ------------------------------ | --------------------------- |
| `hero.mjs`         | `public/rive/hero.riv`         | `npm run rive:hero`         |
| `strike.mjs`       | `public/rive/strike.riv`       | `npm run rive:strike`       |
| `portfolio.mjs`    | `public/rive/portfolio.riv`    | `npm run rive:portfolio`    |
| `transform.mjs`    | `public/rive/transform.riv`    | `npm run rive:transform`    |
| `testimonials.mjs` | `public/rive/testimonials.riv` | `npm run rive:testimonials` |
| `contact.mjs`      | `public/rive/contact.riv`      | `npm run rive:contact`      |
| `cta.mjs`          | `public/rive/cta.riv`          | `npm run rive:cta`          |
| `footer.mjs`       | `public/rive/footer.riv`       | `npm run rive:footer`       |
| `climber.mjs`      | `public/rive/climber.riv`      | `npm run rive:climber`      |
| `services.mjs`     | `public/rive/services.riv`     | `npm run rive:services`     |
| `about.mjs`        | `public/rive/about.riv`        | `npm run rive:about`        |

Shared modules, not run directly:

- `kit.mjs`: stick figure rig, poses, `reach` IK, walk cycle, keyframe collector.
- `agents.mjs`: the cute AI agent characters plus `blink` and `pop`.
- `cabs.mjs`: the About page elevator cabs. Built into `about.riv`, so run `rive:about`.
- `glyphs.mjs`: the monoline letters the footer crew turns into for the "Sudo Sapient." finale.

The scripts need the `rive-mcp-server` devDependency, so run `npm install` first.

Artboards, inputs, which component uses each file, the kit API and known pitfalls are in
[`docs/RIVE.md`](../../docs/RIVE.md). Several components are timed against these scripts;
check its "Syncing pages to animations" table before changing any timing.

# Rive animations — brief for the designer

The site plays Rive files through `components/motion/RiveScene.tsx`. Each scene
keeps its current SVG version as a fallback, so **nothing changes on the site
until a `.riv` file is dropped into `public/rive/`**. Drop the file in, reload,
and that scene switches over. Reduced-motion visitors always get the static SVG.

The names below (file, artboard, state machine, input) are wired in code.
**Match them exactly, including case.** `transform.riv` and `footer.riv` are generated from `scripts/rive/`; edit the scripts, not the binaries.

## Shared style

Match the current stick-figure crew so Rive and SVG scenes sit together.

| Token                            | Value     |
| -------------------------------- | --------- |
| Blueprint (background)           | `#1E40AF` |
| Blueprint deep                   | `#1E3A8A` |
| Line / figures                   | `#FFFFFF` |
| Accent (one highlight per scene) | `#FBBF24` |
| Ink (on light sections)          | `#0F172A` |

- Line art only. Round caps and joins. The main stroke is about 2.4px at 1×, figures are about 64px tall.
- Transparent artboard background. The page draws the blueprint grid.
- **Rig the figures with bones** (hips, spine, neck, upper and lower arms and legs). The point of moving to Rive is smooth in-betweening. The SVG version cross-fades between fixed poses and shows doubled limbs.
- Keep each file under about 150 KB. Use one file with several artboards rather than several files.

---

## 0. `hero.riv`: AI makes the job easier and faster

Built by `scripts/rive/hero.mjs` (`npm run rive:hero`). `components/sections/Hero.tsx` autoplays the looping animation `loop` (14s), and reduced-motion visitors get the old plotter drawing.

| Time   | Beat                                                                                                                               |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| 0–4s   | A worker heaves a paperwork boulder up a blueprint hill, sweats, and slips back.                                                   |
| 4–7s   | An amber AI spark zips in and draws an escalator onto the hill.                                                                    |
| 7–10s  | He hops on and rides up easy, waving, hand on the rail.                                                                            |
| 10–14s | At the top the boulder becomes a neat stack with a tick, he sips a coffee, and more boulders ride up on their own. Then it resets. |

---

## 1. `transform.riv`: How we make your company AI-native

Built by `scripts/rive/transform.mjs` (`npm run rive:transform`). Shared rig: `scripts/rive/kit.mjs`.

- **Artboards:** `Desktop` 900 × 210 (one office floor) and `Mobile` 390 × 640 (a three-storey building, one front per floor).
- **Playback:** a single looping linear animation, `story` (16s plus a 1.5s hold), with no state machine. `components/sections/Process.tsx` autoplays it while it's in view and highlights the stage card for the current 4-second stage.

| Beat (stage card)                | What happens                                                                                                                         |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Chaos (Audit) 0–4s               | Employees pace with arms flailing, papers fountain off overflowing piles, amber "!" alarms pop, monitors flicker.                    |
| We walk in (Pilot) 4–8s          | Two Sudo Sapient devs in amber glasses arrive. One codes on a laptop (code lines appear), the other builds the machine.              |
| It clicks (Scale) 8–12s          | The machine starts, pipes reach each desk, papers fly into the machine, piles drain, "!" turns into a tick, employees sit back down. |
| Runs on its own (Embed) 12–17.5s | Everyone leans back with hands behind their head, pulses keep flowing, and the devs fist-bump and leave.                             |

---

## 2. `footer.riv`: build and launch (same concept, done better)

Replaces `components/layout/FooterScene.tsx` (desktop) and `MobileFooterLaunch.tsx` (mobile).

- **Artboards:** `Desktop` at **1280 × 320**, and `Mobile` at **390 × 520**. The mobile one is recomposed, not just scaled.
- **State machine (on both):** `Launch`. It is a **seamless time loop** of about 20s. The site starts it when the footer scrolls into view and pauses it when it scrolls out.
- **Inputs:** none. Hover and click are handled inside the file with Rive listeners:
  - Hovering the scene makes the crew glance at the cursor.
  - Clicking a figure plays a quick "shot" reaction, then they recover.

**Stage:** three zones that characters never leave, so nobody overlaps: Plan desk (left), launch pad (centre), mission console (right). The rocket is fully inside the artboard until it launches.

| Beat   | Time   | What happens                                                                                                                                                                            |
| ------ | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Plan   | 0–4s   | The architect sketches. The plan projects onto the pad as a **dashed blueprint outline** of the rocket.                                                                                 |
| Build  | 4–11s  | Two builders walk to the pad. A small crane lowers the body, nose, fins and engine into the outline. Each part snaps in with an overshoot and a spark, and the dashed line turns solid. |
| Check  | 11–14s | The console engineer ticks three amber checks, then counts down 3 · 2 · 1.                                                                                                              |
| Launch | 14–17s | The rocket squashes down before lift-off, then a layered flickering flame and billowing smoke. The crew covers their ears and the rocket exits the top.                                 |
| Land   | 17–20s | The shockwave makes the plan papers flutter. The crew high-fives, and the architect pins up a new plan, which flows into the next loop.                                                 |

Drop the "fat" duck gag and the desk crack.

---

## 3. `climber.riv`: the ladder climber

Built by `scripts/rive/climber.mjs` (`npm run rive:climber`). `components/scenes/LadderClimber.tsx` keeps the rail, the scroll-to-height travel, the colour switching and the click-to-shoot fall; the file only animates the figure.

- **Artboard:** `Climber` 70 × 72 (rendered 140 × 144px). On the ladder at x = 50; break spot at x = 23 (54px left).
- **State machine:** `Climber`

| Input       | Type    | Set by the page                                                              |
| ----------- | ------- | ---------------------------------------------------------------------------- |
| `scrolling` | Boolean | True while the page is scrolling, false 180ms after it stops                 |
| `atFooter`  | Boolean | True once the footer's top passes 42% of the viewport, false again above 60% |
| `hover`     | Boolean | The cursor is over him                                                       |

| State                  | What it does                                                           |
| ---------------------- | ---------------------------------------------------------------------- |
| `hang`                 | Holds the rungs and breathes                                           |
| `climb`                | Alternating reach-and-knee climb cycle, only while `scrolling`         |
| `dismount`             | Steps off to the left, sits down, and takes out a water bottle (1.1s)  |
| `drink`                | His break: sips, lowers the bottle, wipes his brow, breathes (5s loop) |
| `upLadder` / `upFloor` | Hands up while `hover`, on the ladder or at the footer                 |

---

## 4. `testimonials.riv`: the podium

Built by `scripts/rive/testimonials.mjs` (`npm run rive:testimonials`), used by `components/sections/Testimonials.tsx`.

- **Artboards:** `Desktop` 680 × 170 and `Mobile` 340 × 170, drawn in blue on the white quote card (between the quote and the client's name).
- **State machine:** `Podium`, with a number input `speaker` (0–4, in the same order as the testimonials). Each state `turnN` is a 9.5s turn:
  1. That client stands, walks to the podium and talks with their hands while sound waves pulse at the mic.
  2. They bow, everyone else claps, and they walk back to their seat.
- **Props:** Shipzy holds a parcel, Taamul a laptop, Jgsaw a puzzle piece, Fabplay a camera and Vencuts a phone.
- **Rotation:** the section advances `speaker` every 9.5s while the stage is on screen, and stops for good once the visitor picks a name. It never rotates under reduced motion.

---

## Checklist before handing over a file

- [ ] File, artboard, state machine and input names match this doc exactly.
- [ ] Artboard background is transparent.
- [ ] Every state machine has a sensible **first frame**, which is what shows while loading.
- [ ] Scrubbing `progress` from 100 back to 0 rewinds cleanly.
- [ ] Exported with the current Rive runtime (web runtime 4.x).

---
target: homepage
total_score: 18
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 3
target_identity: "file:/Users/sidbhat/projects/SudoSapient-Version-2/app/(marketing)/page.tsx"
target_fingerprint: "sha256:bda0c70913f5fb5f0b1e01d751651f91954ef1366a3904e142797f4ecc8a749a"
target_path: /Users/sidbhat/projects/SudoSapient-Version-2/app/(marketing)/page.tsx
timestamp: 2026-10-18T13-30-03Z
slug: app-marketing-page-tsx
---
# Critique: Sudo Sapient homepage (app/(marketing)/page.tsx)
Score 18/32 (H7, H10 n/a). Acceptable.
Heuristics: 1=3, 2=2, 3=3, 4=1, 5=2, 6=3, 8=2, 9=2.
Specificity: authored (blueprint/CAD/plotter/ladder climber) but voice spent on illustration, proof layer weak.
## Priority issues
- [P0] Contact form opens Gmail compose (components/sections/ContactForm.tsx:18,74). Fix: server action + inline ContactSuccessScene, domain email. -> harden
- [P1] Proof undercuts claim: featured case has no AI, non-metric metrics (lib/projects.ts:80-83), self "VERIFIED" badge, first-name testimonials. -> clarify
- [P1] Weak end ("Find us online"), 4 CTA verbs, contradictory timelines, Process duplicated. -> clarify, distill
- [P1] Motion collides: ladder rail over content 1024-1360px, climber intercepts footer About click at 1440, figures over M.03/diagram. -> layout
- [P2] 7-10px labels, 1.5-3.4:1 contrast, Archivo Black testimonial, cursor:none, no MotionConfig, SMIL ignores reduced motion, 8.7MB preload video. -> audit, typeset
## Minor
fig-rise undefined (HeroScene.tsx:119-182); BreathingFigure dead; ClimberPosePlayer deps; data-fat naming; phone w/o country code; /work LCP missing priority.
## Rive
Characters to Rive (ladder climber, shootable, pose players, workshops, footer launch); keep plotter, process scrub, shader, cursor, text, fades in code. Fix collisions first; pilot ladder climber.

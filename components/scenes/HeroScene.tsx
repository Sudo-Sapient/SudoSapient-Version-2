"use client";

import * as React from "react";
import { gsap } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ModuleStack } from "@/components/blueprint/ModuleStack";
import { BreathingFigure } from "@/components/figures";
import { FigureClimbing } from "@/components/figures";
import { ClimberPosePlayer } from "@/components/figures/ClimberPosePlayer";

gsap.registerPlugin(DrawSVGPlugin);

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

// How long the plotter pen takes to sweep top → bottom of the scene.
const TRAVEL = 1.5;
// Each stroke draws over this long, starting as the pen reaches its height.
const STROKE_DUR = 0.34;
// Breathing begins once the build has fully settled.
const SETTLE = TRAVEL + 0.7;

/**
 * Homepage hero — the "Plotter Pass".
 *
 * On load a thin amber drafting guide descends the scene. As its Y crosses each
 * element, that element draws itself in (DrawSVG), so the whole composition —
 * the PRODUCT/AUTOMATION/MEDIA stack and the four figures — appears to be
 * plotted top-to-bottom by a single pen. The guide retracts and the scene is
 * left crisp and static, after which the crew starts an almost-imperceptible
 * breathing idle. Poses never move; only the stroke reveal + guide animate.
 * Reduced motion: everything renders fully drawn, no pen.
 */
export function HeroScene() {
  const scope = React.useRef<HTMLDivElement>(null);
  const guide = React.useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = scope.current;
    const pen = guide.current;
    if (!root || !pen) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const rect = root.getBoundingClientRect();
      const height = rect.height || 1;

      // Vertical position (0..1) of an element's centre within the scene.
      const frac = (el: Element) => {
        const r = el.getBoundingClientRect();
        return gsap.utils.clamp(0, 1, (r.top + r.height / 2 - rect.top) / height);
      };

      // Drawable strokes — skip dashed guides (DrawSVG flickers on them).
      const strokes = Array.from(
        root.querySelectorAll<SVGElement>("svg line, svg rect, svg polyline, svg circle, svg path")
      ).filter((el) => !el.getAttribute("stroke-dasharray"));
      const texts = Array.from(root.querySelectorAll<SVGTextElement>("svg text"));

      // Hide everything before first paint, then plot it back in.
      gsap.set(strokes, { drawSVG: "0%" });
      gsap.set(texts, { opacity: 0 });
      gsap.set(pen, { y: 0, opacity: 1 });

      const tl = gsap.timeline();

      strokes.forEach((el) => {
        tl.fromTo(
          el,
          { drawSVG: "0%" },
          { drawSVG: "100%", duration: STROKE_DUR, ease: "power1.out" },
          frac(el) * TRAVEL
        );
      });

      texts.forEach((el) => {
        const target = Number(el.getAttribute("opacity") ?? "1");
        tl.to(el, { opacity: target, duration: 0.3 }, frac(el) * TRAVEL + 0.12);
      });

      // The pen sweeps down, then retracts up and fades out.
      tl.to(pen, { y: height, duration: TRAVEL, ease: "none" }, 0);
      tl.to(pen, { y: -24, opacity: 0, duration: 0.4, ease: "power1.in" }, TRAVEL + 0.05);
    }, scope);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={scope} className="relative isolate w-full">
      {/* The plotter pen: a thin amber guide line with a crosshair at the left. */}
      <div
        ref={guide}
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-20 opacity-0"
      >
        <div className="relative h-px w-full bg-warn/80">
          <span className="absolute -left-0.5 top-1/2 h-3 w-3 -translate-y-1/2">
            <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-warn" />
            <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-warn" />
          </span>
        </div>
      </div>

      {/* Focal structure — driven by the plotter, so render it static. */}
      <ModuleStack
        modules={[
          { code: "M.01", label: "PRODUCT" },
          { code: "M.02", label: "AUTOMATION" },
          { code: "M.03", label: "MEDIA" },
        ]}
        tone="light"
        mode="static"
      />

      {/* Background observer — top right, rides up/down like a hoist */}
      <div
        className="fig-rise pointer-events-none absolute right-[3%] top-[-2%] text-white/85"
        style={
          {
            width: "8%",
            minWidth: 36,
            "--rise": "9px",
            "--rise-dur": "3.6s",
            animationDelay: `${SETTLE}s`,
          } as React.CSSProperties
        }
      >
        <BreathingFigure index={0} startDelay={SETTLE} className="block w-full">
          <ClimberPosePlayer
            poses={["stand", "inspect", "stand"]}
            durations={[0.8, 0.55, 0.8]}
            className="w-full"
          />
        </BreathingFigure>
      </div>

      {/* Foreground left — heaves the bottom module up into place */}
      <div
        className="fig-rise pointer-events-none absolute bottom-[8%] left-[-1%] text-white"
        style={
          {
            width: "16%",
            minWidth: 72,
            "--rise": "11px",
            "--rise-dur": "2.9s",
            animationDelay: `${SETTLE + 0.4}s`,
          } as React.CSSProperties
        }
      >
        <BreathingFigure index={1} startDelay={SETTLE} className="block w-full">
          <ClimberPosePlayer
            poses={["push", "press", "push"]}
            durations={[0.58, 0.3, 0.58]}
            delay={0.2}
            className="w-full"
          />
        </BreathingFigure>
      </div>

      {/* Right side — actually climbs up & down the middle module */}
      <div
        className="fig-rise pointer-events-none absolute right-[6%] top-[26%] text-white"
        style={
          {
            width: "12%",
            minWidth: 60,
            "--rise": "44px",
            "--rise-dur": "5.5s",
            animationDelay: `${SETTLE + 0.2}s`,
          } as React.CSSProperties
        }
      >
        <BreathingFigure index={2} startDelay={SETTLE} className="block w-full">
          <FigureClimbing className="w-full" />
        </BreathingFigure>
      </div>

      {/* Foreground right — sitting on the baseline, bobs as it watches */}
      <div
        className="fig-rise pointer-events-none absolute bottom-[-2%] right-[2%] text-white"
        style={
          {
            width: "14%",
            minWidth: 64,
            "--rise": "8px",
            "--rise-dur": "3.3s",
            animationDelay: `${SETTLE + 0.6}s`,
          } as React.CSSProperties
        }
      >
        <BreathingFigure index={3} startDelay={SETTLE} className="block w-full">
          <ClimberPosePlayer
            poses={["sit", "draft", "sit"]}
            durations={[0.9, 0.55, 0.9]}
            delay={0.35}
            className="w-full"
          />
        </BreathingFigure>
        {/* tiny notebook line beside the seated figure */}
        <svg
          viewBox="0 0 60 40"
          className="absolute -bottom-2 -right-6 hidden w-12 sm:block"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1.25"
          aria-hidden
        >
          <rect x="4" y="6" width="48" height="28" />
          <line x1="12" y1="14" x2="44" y2="14" />
          <line x1="12" y1="20" x2="38" y2="20" />
          <line x1="12" y1="26" x2="42" y2="26" />
        </svg>
      </div>
    </div>
  );
}

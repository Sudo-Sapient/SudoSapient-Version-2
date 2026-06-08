"use client";

import * as React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

type Props = {
  /** A figure component, e.g. <FigureClimbing size={80} />. */
  children: React.ReactNode;
  /** Seconds each stroke takes to draw. */
  duration?: number;
  /** Delay between strokes (the "sketching" rhythm). */
  stagger?: number;
  className?: string;
};

/**
 * Wraps an SVG stickman figure and "draws" its strokes on scroll using
 * GSAP's DrawSVGPlugin — head, spine, and limbs sketch themselves in, like a
 * blueprint being drawn. Respects prefers-reduced-motion.
 */
export function AnimatedFigure({
  children,
  duration = 0.6,
  stagger = 0.08,
  className,
}: Props) {
  const root = React.useRef<HTMLSpanElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const strokes = el.querySelectorAll<SVGElement>("line, circle, path");
    if (!strokes.length) return;

    // Reduced motion: show the figure fully drawn, skip the animation.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        strokes,
        { drawSVG: "0%" },
        {
          drawSVG: "100%",
          duration,
          stagger,
          ease: "power1.inOut",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }, root);

    return () => ctx.revert();
  }, [duration, stagger]);

  return (
    <span ref={root} className={className}>
      {children}
    </span>
  );
}

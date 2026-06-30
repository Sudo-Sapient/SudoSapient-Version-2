"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { Pipeline } from "@/components/blueprint/Pipeline";
import { Shootable } from "@/components/interactive/Shootable";
import {
  FigureSitting,
  FigureWriting,
  FigurePushing,
  FigurePointing,
} from "@/components/figures";

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

// Pipeline geometry (must match Pipeline.tsx): viewBox 900×160, spine y=80,
// node centres at these x. Pen sweeps from the first to the last.
const XS = [60, 340, 620, 840];
const BASE_Y = 80;
const SPAN = XS[XS.length - 1] - XS[0]; // 780
// Fraction along the sweep where the pen reaches each node (0..1).
const NODE_FR = XS.map((x) => (x - XS[0]) / SPAN);
// Pen left position as a % of the 900-wide viewBox at each end.
const PEN_START = `${(XS[0] / 900) * 100}%`;
const PEN_END = `${(XS[XS.length - 1] / 900) * 100}%`;

/**
 * How We Work — the "Drafting Pass".
 *
 * Scroll-scrubbed: an amber plotter pen rides the pipeline spine left → right as
 * you scroll. The spine draws under it, and the instant the pen reaches each
 * node the node pops in and its figure is plotted via DrawSVG. Scroll back up
 * and it un-draws. Figures never change pose — only the pen, node pop and stroke
 * reveal animate. Reduced motion / mobile fall back to a static, fully-drawn
 * layout.
 */
export function ProcessScene() {
  const nodes = [
    { code: "N.01", label: "DISCOVER", caption: "1 wk" },
    { code: "N.02", label: "PROTOTYPE", caption: "2 wk" },
    { code: "N.03", label: "BUILD", caption: "3–6 wk" },
    { code: "N.04", label: "SHIP", caption: "ongoing" },
  ];
  const figures = [FigureSitting, FigureWriting, FigurePushing, FigurePointing];

  const scene = React.useRef<HTMLDivElement>(null);
  const pen = React.useRef<HTMLDivElement>(null);
  const figRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  useIsomorphicLayoutEffect(() => {
    const root = scene.current;
    const penEl = pen.current;
    if (!root || !penEl) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const spine = root.querySelector<SVGElement>("[data-pl-spine]");
      const nodeEls = XS.map((_, i) => root.querySelector<SVGElement>(`[data-pl-node="${i}"]`));
      const tickEls = XS.map((_, i) => root.querySelector<SVGElement>(`[data-pl-tick="${i}"]`));
      const labelEls = XS.map((_, i) => root.querySelector<SVGElement>(`[data-pl-label="${i}"]`));
      const figStrokes = figRefs.current.map((f) =>
        f
          ? Array.from(f.querySelectorAll<SVGElement>("line, circle, polyline, path")).filter(
              (el) => !el.getAttribute("stroke-dasharray")
            )
          : []
      );

      // Hide everything before first paint.
      if (spine) gsap.set(spine, { drawSVG: "0%" });
      nodeEls.forEach((n, i) => n && gsap.set(n, { scale: 0, svgOrigin: `${XS[i]} ${BASE_Y}` }));
      tickEls.forEach((t) => t && gsap.set(t, { opacity: 0 }));
      labelEls.forEach((l) => l && gsap.set(l, { opacity: 0, y: 6 }));
      figStrokes.flat().forEach((s) => gsap.set(s, { drawSVG: "0%" }));
      gsap.set(penEl, { left: PEN_START, opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 72%",
          end: "bottom 55%",
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });

      // The pen and the spine track scroll across the whole timeline.
      tl.to(penEl, { opacity: 1, duration: 0.02 }, 0);
      if (spine) tl.to(spine, { drawSVG: "100%", duration: 1, ease: "none" }, 0);
      tl.to(penEl, { left: PEN_END, duration: 1, ease: "none" }, 0);

      // Each node + figure resolves the moment the pen arrives at it.
      NODE_FR.forEach((fr, i) => {
        const at = fr * 0.92;
        if (nodeEls[i])
          tl.to(nodeEls[i], { scale: 1, duration: 0.06, ease: "back.out(2)", svgOrigin: `${XS[i]} ${BASE_Y}` }, at);
        if (tickEls[i]) tl.to(tickEls[i], { opacity: 1, duration: 0.04 }, at);
        if (labelEls[i]) tl.to(labelEls[i], { opacity: 1, y: 0, duration: 0.08 }, at + 0.02);
        if (figStrokes[i].length)
          tl.to(figStrokes[i], { drawSVG: "100%", duration: 0.12, stagger: 0.012, ease: "none" }, at);
      });

      // Pen lifts off once it has reached the end.
      tl.to(penEl, { opacity: 0, duration: 0.05 }, 0.97);
    }, scene);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={scene} className="relative w-full">
      <div className="relative">
        <Pipeline
          nodes={nodes}
          tone="light"
          mode="manual"
          segmentLabels={["1.0x", "2.0x", "3.0x"]}
        />

        {/* The plotter pen — rides the spine, scrubbed to scroll. */}
        <div
          ref={pen}
          aria-hidden
          className="pointer-events-none absolute top-1/2 z-20 -translate-y-1/2 opacity-0"
          style={{ left: PEN_START }}
        >
          <span className="relative block h-4 w-4 -translate-x-1/2">
            <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-warn" />
            <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-warn" />
          </span>
        </div>

        {/* Figures at each node — plotted in by the scrub timeline (desktop). */}
        <div className="absolute inset-0 hidden md:block">
          {figures.map((F, i) => (
            <div
              key={i}
              ref={(el) => {
                figRefs.current[i] = el;
              }}
              className="absolute text-white"
              style={{
                left: `${(XS[i] / 900) * 100}%`,
                top: "65%",
                transform: "translateX(-50%)",
                width: "10%",
                minWidth: 56,
                maxWidth: 84,
              }}
            >
              <Shootable className="block w-full">
                <F className="w-full" />
              </Shootable>
            </div>
          ))}
        </div>
      </div>

      {/* On mobile, render figures in a row below the pipeline */}
      <div className="mt-6 grid grid-cols-4 gap-2 sm:gap-3 md:hidden">
        {figures.map((F, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
            className="flex justify-center text-white"
          >
            <F className="h-16 w-auto" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

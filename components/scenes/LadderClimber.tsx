"use client";

import * as React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

const RUNG = 18; // px between ladder rungs

const WHITE = "#FFFFFF";
const BLUE = "#1E40AF"; // brand blueprint
const OFFWHITE = "#FAFAFA";

// Bottom-anchored rung pattern (currentColor) so dim + lit ladders line up and
// follow the climber's adaptive colour.
const rungStyle: React.CSSProperties = {
  backgroundImage: `repeating-linear-gradient(to top, currentColor 0 2px, transparent 2px ${RUNG}px)`,
  backgroundPosition: "bottom",
};

// The stick figure, drawn once and reused for the halo + main strokes.
const figure = (
  <>
    <circle cx={20} cy={8} r={5} />
    <line x1={20} y1={13} x2={20} y2={38} />
    <polyline points="20,15 13,10 11,5" />
    <polyline points="20,16 27,13 29,9" />
    <polyline points="20,38 14,48 13,58" />
    <polyline points="20,38 27,45 26,53" />
  </>
);

// Is an element's nearest opaque background dark? true / false / null (none).
function nearestBgDark(start: Element | null): boolean | null {
  let node = start as HTMLElement | null;
  while (node) {
    const m = getComputedStyle(node).backgroundColor.match(/[\d.]+/g);
    if (m && m.length >= 3 && (m.length < 4 || parseFloat(m[3]) > 0)) {
      const lum = 0.2126 * +m[0] + 0.7152 * +m[1] + 0.0722 * +m[2];
      return lum < 140;
    }
    node = node.parentElement;
  }
  return null;
}

/**
 * A climbing stickman that scales a full-height ladder in the right gutter as
 * you scroll the whole page. The ladder doubles as a scroll-progress meter
 * (lit rungs below him, dim above). Static pose — only travels up/down.
 *
 * It looks up which section sits directly behind it and recolours: solid
 * brand-blue on light sections, white on the dark blueprint sections. A halo
 * matching the section background knocks the rungs out from behind the figure.
 * Decorative, pointer-events-none, hidden on small screens.
 */
export function LadderClimber() {
  const rail = React.useRef<HTMLDivElement>(null);
  const climber = React.useRef<HTMLDivElement>(null);
  const litWrap = React.useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const railEl = rail.current;
    const climberEl = climber.current;
    const litEl = litWrap.current;
    if (!railEl || !climberEl || !litEl) return;

    // Classify each section's background once (recomputed on resize/load).
    let sections: { el: Element; dark: boolean }[] = [];
    const classify = () => {
      const els = [
        ...Array.from(document.querySelectorAll("main section")),
        document.querySelector("footer"),
      ].filter(Boolean) as Element[];
      sections = els.map((el) => ({ el, dark: nearestBgDark(el) === true }));
    };

    // White over the dark section behind it, blue over light. Default light.
    const setTone = () => {
      const r = climberEl.getBoundingClientRect();
      const cy = r.top + r.height / 2;
      let dark = false;
      for (const s of sections) {
        const sr = s.el.getBoundingClientRect();
        if (sr.top <= cy && cy < sr.bottom) {
          dark = s.dark;
          break;
        }
      }
      railEl.style.color = dark ? WHITE : BLUE;
      railEl.style.setProperty("--halo", dark ? BLUE : OFFWHITE);
    };

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setTone();
      });
    };
    const onResize = () => {
      classify();
      setTone();
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) return;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      });
      tl.fromTo(
        climberEl,
        { y: () => railEl.clientHeight - climberEl.offsetHeight - 12 },
        { y: 12, ease: "none" },
        0
      );
      tl.fromTo(
        litEl,
        { height: () => climberEl.offsetHeight + 12 },
        { height: () => railEl.clientHeight - 12, ease: "none" },
        0
      );
    }, rail);

    classify();
    setTone();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    // Re-check once the layout has fully settled (fonts/images).
    const settle = window.setTimeout(onResize, 350);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(settle);
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={rail}
      aria-hidden
      className="pointer-events-none fixed right-3 top-16 z-30 hidden h-[calc(100vh-4rem)] w-20 text-white lg:block"
    >
      {/* Dim ladder (full height) */}
      <div className="absolute inset-y-0 left-1/2 w-8 -translate-x-1/2 opacity-20">
        <div className="h-full w-full border-x border-current" style={rungStyle} />
      </div>

      {/* Lit progress fill — grows from the bottom */}
      <div
        ref={litWrap}
        className="absolute bottom-0 left-1/2 w-8 -translate-x-1/2 overflow-hidden opacity-80"
        style={{ height: "33%" }}
      >
        <div
          className="absolute bottom-0 left-0 h-[calc(100vh-4rem)] w-full border-x border-current"
          style={rungStyle}
        />
      </div>

      {/* The climber — halo behind knocks out rungs, main stroke on top */}
      <div ref={climber} className="absolute left-0 w-full">
        <svg
          viewBox="0 0 40 64"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full"
        >
          <g stroke="var(--halo, transparent)" strokeWidth={5}>
            {figure}
          </g>
          <g stroke="currentColor" strokeWidth={2.1}>
            {figure}
          </g>
        </svg>
      </div>
    </div>
  );
}

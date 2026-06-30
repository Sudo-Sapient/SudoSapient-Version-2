"use client";

import * as React from "react";
import {
  motion,
  useReducedMotion,
  type TargetAndTransition,
  type Transition,
} from "framer-motion";
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

// Head + spine — shared across both climb frames so they never flicker.
const core = (
  <>
    <circle cx={20} cy={8} r={5} />
    <line x1={20} y1={13} x2={20} y2={38} />
  </>
);

// Two clean, hand-placed climbing poses. We hard-swap between them (a 2-frame
// cycle) so the figure reads as climbing yet can never look "broken".
//   Frame A: left arm reaches high, right leg stepped up.
//   Frame B: right arm reaches high, left leg stepped up.
const limbsA = (
  <>
    <polyline points="20,15 14,9 12,3" />
    <polyline points="20,16 26,19 29,16" />
    <polyline points="20,38 16,50 15,60" />
    <polyline points="20,38 26,43 28,50" />
  </>
);
const limbsB = (
  <>
    <polyline points="20,15 14,18 11,15" />
    <polyline points="20,16 26,9 28,3" />
    <polyline points="20,38 14,43 12,50" />
    <polyline points="20,38 24,50 25,60" />
  </>
);

// Hands-up pose shown when the cursor locks onto the climber (40×64 box).
const surrender = (
  <>
    <circle cx={20} cy={8} r={5} />
    <line x1={20} y1={13} x2={20} y2={38} />
    <polyline points="20,15 14,8 13,2" />
    <polyline points="20,16 27,8 28,2" />
    <polyline points="20,38 15,50 13,60" />
    <polyline points="20,38 25,50 27,60" />
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
 * (lit rungs below him, dim above) with an amber cap marking how far he's got.
 * He runs a 2-frame climb cycle so he's always visibly climbing.
 *
 * He looks up which section sits directly behind him and recolours: solid
 * brand-blue on light sections, white on the dark blueprint sections, and holds
 * the last tone over gaps so he never blends in. A halo in the opposite tone
 * knocks the rungs out from behind the figure for legibility on any background.
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

    // Sample whatever is actually painted directly behind the climber's centre
    // and recolour: blue ladder on a light background, white ladder on a dark
    // one. This reads the real element stack, so it's immune to section markup.
    let lastDark = true; // hero starts dark
    const setTone = () => {
      const r = climberEl.getBoundingClientRect();
      const x = r.left + r.width / 2;
      const y = r.top + r.height / 2;
      let dark: boolean | null = null;
      // elementsFromPoint also returns our own ladder — skip it, take the first
      // real element underneath that has an opaque background.
      for (const el of document.elementsFromPoint(x, y)) {
        if (railEl.contains(el)) continue;
        const res = nearestBgDark(el);
        if (res !== null) {
          dark = res;
          break;
        }
      }
      if (dark === null) dark = lastDark; // off-screen / no hit → keep last
      lastDark = dark;
      railEl.style.color = dark ? WHITE : BLUE;
      railEl.style.setProperty("--halo", dark ? BLUE : OFFWHITE);
    };

    // Recolour is cosmetic — throttle the elementsFromPoint/getComputedStyle
    // work to ~7×/s (trailing) instead of running it on every scroll frame.
    let toneTimer = 0;
    let lastTone = 0;
    const TONE_MS = 140;
    const runTone = () => {
      toneTimer = 0;
      lastTone = performance.now();
      setTone();
    };
    const scheduleTone = () => {
      if (toneTimer) return;
      toneTimer = window.setTimeout(
        runTone,
        Math.max(0, TONE_MS - (performance.now() - lastTone))
      );
    };
    const onResize = () => setTone();

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (reduced) return;

      // Vertical travel + progress fill, scrubbed to whole-page scroll.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
          invalidateOnRefresh: true,
          // Recolour on every scroll-position change — including programmatic
          // jumps (hash links) that don't fire a native scroll event.
          onUpdate: scheduleTone,
          onRefresh: setTone,
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

      // 2-frame climb cycle — hard swaps, so it never shows a half-pose.
      const a = railEl.querySelectorAll<SVGGElement>(".frame-a");
      const b = railEl.querySelectorAll<SVGGElement>(".frame-b");
      gsap
        .timeline({ repeat: -1 })
        .set(a, { autoAlpha: 1 })
        .set(b, { autoAlpha: 0 })
        .to({}, { duration: 0.42 })
        .set(a, { autoAlpha: 0 })
        .set(b, { autoAlpha: 1 })
        .to({}, { duration: 0.42 });
    }, rail);

    setTone();
    window.addEventListener("scroll", scheduleTone, { passive: true });
    window.addEventListener("resize", onResize);
    // Re-check once the layout has fully settled (fonts/images).
    const settle = window.setTimeout(onResize, 350);

    // Fade the climber out while the footer is in view so it never collides
    // with the giant footer wordmark or right-edge content.
    const footerEl = document.querySelector("footer");
    const footerIO = footerEl
      ? new IntersectionObserver(
          ([entry]) => {
            railEl.style.opacity = entry.isIntersecting ? "0" : "";
          },
          { rootMargin: "0px" }
        )
      : null;
    if (footerEl) footerIO?.observe(footerEl);

    return () => {
      window.removeEventListener("scroll", scheduleTone);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(settle);
      window.clearTimeout(toneTimer);
      footerIO?.disconnect();
      ctx.revert();
    };
  }, []);

  // "Shoot the climber" easter egg — same mechanic as the scene figures.
  const reduce = useReducedMotion();
  const [shootEnabled, setShootEnabled] = React.useState(false);
  const [shot, setShot] = React.useState<"alive" | "surrender" | "down" | "rising">("alive");
  const shootTimers = React.useRef<number[]>([]);
  const shootMode = React.useRef<"fall" | "fade">("fade");

  React.useEffect(() => {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) setShootEnabled(true);
    return () => shootTimers.current.forEach(clearTimeout);
  }, []);

  const onEnter = () => setShot((s) => (s === "alive" ? "surrender" : s));
  const onLeave = () => setShot((s) => (s === "surrender" ? "alive" : s));
  const onShoot = (e: React.MouseEvent) =>
    setShot((s) => {
      if (s === "down" || s === "rising") return s;
      e.stopPropagation();
      shootTimers.current.forEach(clearTimeout);
      shootMode.current = Math.random() < 0.5 ? "fall" : "fade";
      shootTimers.current =
        shootMode.current === "fall"
          ? [
              window.setTimeout(() => setShot("rising"), 2200),
              window.setTimeout(() => setShot("alive"), 2700),
            ]
          : [window.setTimeout(() => setShot("alive"), 2500)];
      return "down";
    });

  // Ghost (hands-up) animation for the current state + death mode.
  const isFall = shootMode.current === "fall";
  let ghostAnim: TargetAndTransition = { rotate: 0, y: 0, scale: 1, opacity: 1 };
  let ghostTrans: Transition = { duration: 0.1 };
  if (shot === "down") {
    if (reduce) {
      ghostAnim = { opacity: 0 };
      ghostTrans = { duration: 0.15 };
    } else if (isFall) {
      ghostAnim = { rotate: 84, y: "8%", opacity: 1, scale: 1 };
      ghostTrans = { type: "spring", stiffness: 180, damping: 11 };
    } else {
      ghostAnim = { opacity: [1, 0.6, 0.3, 0.1, 0], scale: 1.1, y: -6 };
      ghostTrans = { duration: 0.65, ease: "linear" };
    }
  } else if (shot === "rising") {
    ghostAnim = { rotate: 0, y: 0, scale: 1, opacity: 1 };
    ghostTrans = { type: "spring", stiffness: 240, damping: 14 };
  }

  return (
    <div
      ref={rail}
      aria-hidden
      className="pointer-events-none fixed right-3 top-16 z-30 hidden h-[calc(100vh-4rem)] w-20 text-white transition-opacity duration-500 lg:block"
    >
      {/* Dim ladder (full height) — the route ahead */}
      <div className="absolute inset-y-0 left-1/2 w-8 -translate-x-1/2 opacity-40">
        <div className="h-full w-full border-x border-current" style={rungStyle} />
      </div>

      {/* Lit progress fill — grows from the bottom, amber cap at the top */}
      <div
        ref={litWrap}
        className="absolute bottom-0 left-1/2 w-8 -translate-x-1/2 overflow-hidden"
        style={{ height: "33%" }}
      >
        <div
          className="absolute bottom-0 left-0 h-[calc(100vh-4rem)] w-full border-x border-current"
          style={rungStyle}
        />
      </div>

      {/* The climber — halo behind knocks out rungs, main stroke on top.
          Hover to make it surrender, click to shoot it off the ladder. */}
      <div
        ref={climber}
        className="absolute left-0 w-full"
        data-cursor="target"
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
        onClick={onShoot}
        style={{ pointerEvents: shootEnabled ? "auto" : undefined }}
      >
        <motion.svg
          viewBox="0 0 40 64"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full"
          style={{ visibility: shot === "alive" ? "visible" : "hidden" }}
          initial={false}
          animate={{ opacity: shot === "alive" ? 1 : 0 }}
          transition={{ duration: shot === "alive" ? 0.45 : 0.1, ease: "easeOut" }}
        >
          {/* halo layer (opposite tone, knocks out the rungs) */}
          <g stroke="var(--halo, transparent)" strokeWidth={5.5}>
            {core}
            <g className="frame-a">{limbsA}</g>
            <g className="frame-b" style={{ opacity: 0 }}>{limbsB}</g>
          </g>
          {/* main stroke */}
          <g stroke="currentColor" strokeWidth={2.4}>
            {core}
            <g className="frame-a">{limbsA}</g>
            <g className="frame-b" style={{ opacity: 0 }}>{limbsB}</g>
          </g>
        </motion.svg>

        {shot !== "alive" && (
          <motion.svg
            viewBox="0 0 40 64"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute inset-0 h-full w-full"
            style={{ transformOrigin: isFall ? "55% 92%" : "50% 50%" }}
            initial={false}
            animate={ghostAnim}
            transition={ghostTrans}
          >
            <g stroke="var(--halo, transparent)" strokeWidth={5.5}>{surrender}</g>
            <g stroke="currentColor" strokeWidth={2.4}>{surrender}</g>
          </motion.svg>
        )}
      </div>
    </div>
  );
}

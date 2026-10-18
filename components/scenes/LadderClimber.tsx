"use client";

import * as React from "react";
import { motion, useReducedMotion, type TargetAndTransition, type Transition } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { climberCore, climberLimbsA, surrenderPose } from "@/components/figures/LadderWorkerPoses";
import { RiveScene } from "@/components/motion/RiveScene";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const useIsoLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;
const RUNG = 18;
const WHITE = "#FFFFFF";
const BLUE = "#1E40AF";
const OFFWHITE = "#FAFAFA";
const rungStyle: React.CSSProperties = {
  backgroundImage: `repeating-linear-gradient(to top, currentColor 0 2px, transparent 2px ${RUNG}px)`,
  backgroundPosition: "bottom",
};

function nearestBgDark(start: Element | null): boolean | null {
  let node = start as HTMLElement | null;
  while (node) {
    const m = getComputedStyle(node).backgroundColor.match(/[\d.]+/g);
    if (m && m.length >= 3 && (m.length < 4 || parseFloat(m[3]) > 0)) {
      return 0.2126 * +m[0] + 0.7152 * +m[1] + 0.0722 * +m[2] < 140;
    }
    node = node.parentElement;
  }
  return null;
}

export function LadderClimber() {
  const pathname = usePathname();
  const rail = React.useRef<HTMLDivElement>(null);
  const worker = React.useRef<HTMLDivElement>(null);
  const litWrap = React.useRef<HTMLDivElement>(null);
  const [scrolling, setScrolling] = React.useState(false);
  const [atFooter, setAtFooter] = React.useState(false);

  useIsoLayoutEffect(() => {
    const railEl = rail.current;
    const workerEl = worker.current;
    const litEl = litWrap.current;
    const mainEl = document.querySelector("main");
    const footerEl = document.querySelector("footer");
    if (!railEl || !workerEl || !litEl || !mainEl || !footerEl) return;

    let lastDark = true;
    const setTone = () => {
      const r = workerEl.getBoundingClientRect();
      let dark: boolean | null = null;
      for (const el of document.elementsFromPoint(r.left + r.width / 2, r.top + r.height / 2)) {
        if (railEl.contains(el)) continue;
        const result = nearestBgDark(el);
        if (result !== null) {
          dark = result;
          break;
        }
      }
      if (dark === null) dark = lastDark;
      lastDark = dark;
      railEl.style.color = dark ? WHITE : BLUE;
      railEl.style.setProperty("--halo", dark ? BLUE : OFFWHITE);
    };
    let toneTimer = 0;
    const scheduleTone = () => {
      if (toneTimer) return;
      toneTimer = window.setTimeout(() => {
        toneTimer = 0;
        setTone();
      }, 120);
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let idleTimer = 0;
    // Near the footer he steps off for a break (climber.riv plays dismount → drink).
    // Read live: Rive scenes swap in after load and move the footer.
    const checkFooter = () => {
      const top = footerEl.getBoundingClientRect().top / window.innerHeight;
      setAtFooter((at) => (top < 0.42 ? true : top > 0.6 ? false : at));
    };
    const onScroll = () => {
      checkFooter();
      setScrolling(true);
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => setScrolling(false), 180);
    };
    const ctx = gsap.context(() => {
      if (reduced) return;

      // Main-page travel ends exactly at the lowest usable rung before footer.
      gsap
        .timeline({
          scrollTrigger: {
            trigger: mainEl,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.35,
            invalidateOnRefresh: true,
            onUpdate: scheduleTone,
            onRefresh: setTone,
          },
        })
        .fromTo(
          workerEl,
          { y: 12 },
          { y: () => railEl.clientHeight - workerEl.offsetHeight - 4, ease: "none" },
          0
        )
        .fromTo(litEl, { height: 72 }, { height: () => railEl.clientHeight - 4, ease: "none" }, 0);
    }, railEl);
    window.addEventListener("scroll", onScroll, { passive: true });
    checkFooter();
    // Page height changes (lazy scenes loading) would leave the rail travel stale.
    const resize = new ResizeObserver(() => ScrollTrigger.refresh());
    resize.observe(document.body);

    setTone();
    window.addEventListener("scroll", scheduleTone, { passive: true });
    window.addEventListener("resize", setTone);
    const settle = window.setTimeout(() => {
      setTone();
      ScrollTrigger.refresh();
    }, 350);
    return () => {
      window.removeEventListener("scroll", scheduleTone);
      window.removeEventListener("scroll", onScroll);
      resize.disconnect();
      window.clearTimeout(idleTimer);
      window.removeEventListener("resize", setTone);
      window.clearTimeout(settle);
      window.clearTimeout(toneTimer);
      ctx.revert();
    };
  }, [pathname]);

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
  const isFall = shootMode.current === "fall";
  let ghostAnim: TargetAndTransition = { rotate: 0, y: 0, scale: 1, opacity: 1 };
  let ghostTrans: Transition = { duration: 0.1 };
  if (shot === "down") {
    if (reduce) {
      ghostAnim = { opacity: 0 };
      ghostTrans = { duration: 0.15 };
    } else if (isFall) {
      ghostAnim = { rotate: 84, y: "8%", opacity: 1 };
      ghostTrans = { type: "spring", stiffness: 180, damping: 11 };
    } else {
      ghostAnim = { opacity: [1, 0.6, 0.3, 0.1, 0], scale: 1.1, y: -6 };
      ghostTrans = { duration: 0.65, ease: "linear" };
    }
  } else if (shot === "rising") {
    ghostTrans = { type: "spring", stiffness: 240, damping: 14 };
  }

  return (
    <div
      ref={rail}
      aria-hidden
      className="pointer-events-none fixed right-3 top-16 z-30 hidden h-[calc(100vh-4rem)] w-28 text-white lg:block"
    >
      <div className="absolute inset-y-0 right-6 w-8 opacity-40">
        <div className="h-full w-full border-x border-current" style={rungStyle} />
      </div>
      <div
        ref={litWrap}
        className="absolute bottom-0 right-6 w-8 overflow-hidden"
        style={{ height: 72 }}
      >
        <div
          className="absolute bottom-0 left-0 h-[calc(100vh-4rem)] w-full border-x border-current"
          style={rungStyle}
        />
      </div>

      <div ref={worker} className="absolute right-0 h-36 w-[140px]">
        <RiveScene
          className={cn("h-full w-full", shot !== "alive" && shot !== "surrender" && "invisible")}
          frameClassName="h-full w-full"
          src="/rive/climber.riv"
          stateMachine="Climber"
          inputs={{ scrolling, atFooter, hover: shot === "surrender" }}
          fallback={
            <svg
              viewBox="0 0 40 64"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute right-0 top-4 w-20 overflow-visible"
            >
              <g stroke="var(--halo, transparent)" strokeWidth={5.5}>
                {climberCore}
                {climberLimbsA}
              </g>
              <g stroke="currentColor" strokeWidth={2.4}>
                {climberCore}
                {climberLimbsA}
              </g>
            </svg>
          }
        />
        <div
          className="absolute right-0 top-4 w-20 transition-transform duration-1000"
          style={{ transform: atFooter ? "translateX(-54px)" : undefined }}
        >
          {/* Hit area: just the figure, so it never blocks links beside the rail. */}
          <div
            className="absolute inset-y-0 left-1/2 w-10 -translate-x-1/2"
            data-cursor="target"
            onPointerEnter={onEnter}
            onPointerLeave={onLeave}
            onClick={onShoot}
            style={{ pointerEvents: shootEnabled ? "auto" : undefined }}
          />
          {shot !== "alive" && shot !== "surrender" && (
            <motion.svg
              viewBox="0 0 40 64"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute inset-x-0 top-0 w-full"
              style={{ transformOrigin: isFall ? "55% 92%" : "50% 50%" }}
              initial={false}
              animate={ghostAnim}
              transition={ghostTrans}
            >
              <g stroke="var(--halo, transparent)" strokeWidth={5.5}>
                {surrenderPose}
              </g>
              <g stroke="currentColor" strokeWidth={2.4}>
                {surrenderPose}
              </g>
            </motion.svg>
          )}
        </div>
      </div>
    </div>
  );
}

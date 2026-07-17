"use client";

import * as React from "react";
import { motion, useReducedMotion, type TargetAndTransition, type Transition } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import {
  climberCore,
  climberLimbsA,
  climberLimbsB,
  surrenderPose,
  StepPoseOne,
  StepPoseTwo,
  StandingDrinkPose,
} from "@/components/figures/LadderWorkerPoses";

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
    const ctx = gsap.context(() => {
      // Every pose is rendered twice: halo + visible ink. Target both copies
      // together so no hidden frame can remain stacked over the active pose.
      const climb = workerEl.querySelectorAll("[data-pose-climb]");
      const step1 = workerEl.querySelectorAll("[data-pose-step1]");
      const step2 = workerEl.querySelectorAll("[data-pose-step2]");
      const stand = workerEl.querySelectorAll("[data-pose-stand]");
      const frameA = workerEl.querySelectorAll(".frame-a");
      const frameB = workerEl.querySelectorAll(".frame-b");
      const head = workerEl.querySelectorAll("[data-break-head]");
      const upper = workerEl.querySelectorAll("[data-break-upper]");
      const fore = workerEl.querySelectorAll("[data-break-fore]");

      gsap.set([...step1, ...step2, ...stand], { autoAlpha: 0 });
      gsap.set(climb, { autoAlpha: 1 });
      gsap.set(head, { svgOrigin: "20 8" });
      gsap.set(upper, { svgOrigin: "20 17" });
      gsap.set(fore, { svgOrigin: "28 25" });
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

      const climbCycle = gsap
        .timeline({ repeat: -1 })
        .set(frameA, { autoAlpha: 1 })
        .set(frameB, { autoAlpha: 0 })
        .to({}, { duration: 0.42 })
        .set(frameA, { autoAlpha: 0 })
        .set(frameB, { autoAlpha: 1 })
        .to({}, { duration: 0.42 });

      // One persistent wrapper: pose frames change while the same element moves
      // physically left off the ladder. No whole-character fade or scale jump.
      const dismount = gsap
        .timeline({ paused: true })
        .to(workerEl, { x: -8, duration: 0.18, ease: "power2.inOut" })
        .set(climb, { autoAlpha: 0 })
        .set(step1, { autoAlpha: 1 })
        .to(workerEl, { x: -22, y: "+=2", duration: 0.28, ease: "power2.inOut" })
        .set(step1, { autoAlpha: 0 })
        .set(step2, { autoAlpha: 1 })
        .to(workerEl, { x: -43, y: "+=4", duration: 0.32, ease: "power2.out" })
        .set(step2, { autoAlpha: 0 })
        .set(stand, { autoAlpha: 1 })
        .to(workerEl, { x: -54, y: "+=1", duration: 0.24, ease: "power3.out" });

      const drink = gsap
        .timeline({ paused: true, repeat: -1, repeatDelay: 2.5 })
        .to(upper, { rotation: -38, duration: 0.5, ease: "power2.inOut" }, 0)
        .to(fore, { rotation: -116, duration: 0.58, ease: "power2.inOut" }, 0.04)
        .to(head, { rotation: -6, duration: 0.36, ease: "power2.inOut" }, 0.34)
        .to({}, { duration: 0.75 })
        .to(head, { rotation: 0, duration: 0.38, ease: "power2.inOut" })
        .to(fore, { rotation: 0, duration: 0.64, ease: "power2.inOut" }, "<")
        .to(upper, { rotation: 0, duration: 0.6, ease: "power2.inOut" }, "<0.04");
      gsap.to(workerEl.querySelectorAll("[data-break-body]"), {
        y: -0.5,
        duration: 1.7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      let settleSpeed: gsap.core.Tween | null = null;
      ScrollTrigger.create({
        trigger: footerEl,
        start: "top bottom",
        end: "top 36%",
        scrub: 0.35,
        animation: dismount,
        onUpdate: (self) => {
          if (self.progress > 0.05) climbCycle.pause();
          if (self.progress > 0.97 && !drink.isActive()) drink.restart(true);
          if (self.direction < 0) drink.pause(0);
          scheduleTone();
        },
        onLeaveBack: () => {
          drink.pause(0);
          gsap.set([...step1, ...step2, ...stand], { autoAlpha: 0 });
          gsap.set(climb, { autoAlpha: 1 });
          climbCycle.timeScale(2.8).play();
          settleSpeed?.kill();
          settleSpeed = gsap.to(climbCycle, {
            timeScale: 1,
            duration: 1.2,
            delay: 0.9,
            ease: "power2.out",
          });
        },
      });
    }, railEl);

    setTone();
    window.addEventListener("scroll", scheduleTone, { passive: true });
    window.addEventListener("resize", setTone);
    const settle = window.setTimeout(() => {
      setTone();
      ScrollTrigger.refresh();
    }, 350);
    return () => {
      window.removeEventListener("scroll", scheduleTone);
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

      <div
        ref={worker}
        className="absolute right-0 w-20"
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
          className="w-full overflow-visible"
          style={{ visibility: shot === "alive" ? "visible" : "hidden" }}
          initial={false}
          animate={{ opacity: shot === "alive" ? 1 : 0 }}
          transition={{ duration: shot === "alive" ? 0.4 : 0.1 }}
        >
          <g stroke="var(--halo, transparent)" strokeWidth={5.5}>
            <g data-pose-climb>
              {climberCore}
              <g className="frame-a">{climberLimbsA}</g>
              <g className="frame-b" style={{ opacity: 0 }}>
                {climberLimbsB}
              </g>
            </g>
            <g data-pose-step1 style={{ opacity: 0, visibility: "hidden" }}>
              <StepPoseOne />
            </g>
            <g data-pose-step2 style={{ opacity: 0, visibility: "hidden" }}>
              <StepPoseTwo />
            </g>
            <g data-pose-stand style={{ opacity: 0, visibility: "hidden" }}>
              <StandingDrinkPose />
            </g>
          </g>
          <g stroke="currentColor" strokeWidth={2.4}>
            <g data-pose-climb>
              {climberCore}
              <g className="frame-a">{climberLimbsA}</g>
              <g className="frame-b" style={{ opacity: 0 }}>
                {climberLimbsB}
              </g>
            </g>
            <g data-pose-step1 style={{ opacity: 0, visibility: "hidden" }}>
              <StepPoseOne />
            </g>
            <g data-pose-step2 style={{ opacity: 0, visibility: "hidden" }}>
              <StepPoseTwo />
            </g>
            <g data-pose-stand style={{ opacity: 0, visibility: "hidden" }}>
              <StandingDrinkPose accent />
            </g>
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
  );
}

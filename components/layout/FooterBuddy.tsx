"use client";

import * as React from "react";

const SPEED = 150; // px/s at the 1280px design width; scales with the scene
const NEAR = 3; // px: close enough to stop walking
const WAVE = 28; // px: pointer this close above him and he waves

/**
 * A crew member who lives on the desktop footer scene's floor. Move the pointer over the
 * scene and he walks along the floor to stand under it; he idles when he catches up and
 * waves when the pointer is right over him. Fine pointers only; hidden for reduced motion.
 * Sized to the Rive artboard (1280×320, floor at y=296, figures 61 units tall).
 */
export function FooterBuddy() {
  const box = React.useRef<HTMLDivElement>(null);
  const [on, setOn] = React.useState(false);

  React.useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setOn(fine && !reduce);
  }, []);

  React.useEffect(() => {
    const el = box.current;
    const scene = el?.parentElement;
    if (!on || !el || !scene) return;

    let pos = scene.clientWidth * 0.96; // starts at the quiet right-hand end
    let target = pos;
    let pointerX: number | null = null;
    let raf = 0;
    let last = performance.now();

    const place = () => {
      el.style.transform = `translateX(${pos - el.offsetWidth / 2}px)`;
    };
    const setState = (s: string) => {
      if (el.dataset.state !== s) el.dataset.state = s;
    };
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const step = SPEED * (scene.clientWidth / 1280) * dt;
      const gap = target - pos;
      if (Math.abs(gap) > NEAR) {
        pos += Math.sign(gap) * Math.min(step, Math.abs(gap));
        setState("walk");
        raf = requestAnimationFrame(tick);
      } else {
        setState(pointerX !== null && Math.abs(pointerX - pos) < WAVE ? "wave" : "idle");
        raf = 0;
      }
      place();
    };
    const wake = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };
    const onMove = (e: PointerEvent) => {
      const r = scene.getBoundingClientRect();
      const half = el.offsetWidth / 2;
      pointerX = e.clientX - r.left;
      target = Math.max(half, Math.min(r.width - half, pointerX));
      wake();
    };
    const onLeave = () => {
      pointerX = null;
      wake();
    };
    const onResize = () => {
      const max = scene.clientWidth - el.offsetWidth / 2;
      pos = Math.min(pos, max);
      target = Math.min(target, max);
      place();
    };

    place();
    setState("idle");
    scene.addEventListener("pointermove", onMove);
    scene.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", onResize);
    return () => {
      scene.removeEventListener("pointermove", onMove);
      scene.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [on]);

  if (!on) return null;

  return (
    <div
      ref={box}
      aria-hidden
      className="footer-buddy pointer-events-none absolute bottom-[7.5%] left-0 h-[19%]"
    >
      <svg
        className="h-full w-auto overflow-visible"
        viewBox="0 0 30 66"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth={2.4}
        strokeLinecap="round"
      >
        <g className="buddy-legL">
          <line x1="15" y1="37" x2="12" y2="64" />
        </g>
        <g className="buddy-legR">
          <line x1="15" y1="37" x2="18" y2="64" />
        </g>
        <line x1="15" y1="15" x2="15" y2="37" />
        <g className="buddy-armL">
          <line x1="13" y1="22" x2="8" y2="44" />
        </g>
        <g className="buddy-armR">
          <line x1="17" y1="22" x2="22" y2="44" />
        </g>
        <circle cx="15" cy="9" r="6" fill="#0A1020" />
      </svg>
    </div>
  );
}

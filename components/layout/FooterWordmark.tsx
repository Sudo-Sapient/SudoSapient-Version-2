"use client";

import * as React from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const WORD = "Sudo Sapient";

/**
 * FooterWordmark — the studio signature as a giant "spotlight" wordmark.
 *
 * Two stacked copies of the word: a dim ghost, and a crisp bright copy revealed
 * only inside a soft circle that follows the cursor. So the type is always
 * sharp and high-contrast (no muddy blue-on-blue), and a warm light glides
 * across it as you move the mouse. GSAP eases it up on scroll-in.
 *
 * Pure CSS + GSAP — no WebGL, no masking-over-canvas, nothing fragile. On touch
 * / reduced motion it falls back to a clean static gradient wordmark.
 */
export function FooterWordmark() {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const brightRef = React.useRef<HTMLSpanElement>(null);

  // Scroll-in reveal.
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(root, {
        y: 36,
        autoAlpha: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 90%", once: true },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  // Cursor-following spotlight (desktop / fine pointer only).
  React.useEffect(() => {
    const root = rootRef.current;
    const bright = brightRef.current;
    if (!root || !bright) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) {
      // No cursor → just show the full bright gradient, no mask.
      bright.style.webkitMaskImage = "none";
      bright.style.maskImage = "none";
      bright.style.opacity = "0.9";
      return;
    }

    let raf = 0;
    let x = 0;
    let y = 0;
    const apply = () => {
      raf = 0;
      const mask = `radial-gradient(circle 16rem at ${x}px ${y}px, #000 0%, #000 22%, transparent 68%)`;
      bright.style.webkitMaskImage = mask;
      bright.style.maskImage = mask;
    };
    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      x = e.clientX - r.left;
      y = e.clientY - r.top;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    // Start hidden until the cursor is near, then reveal under the pointer.
    bright.style.webkitMaskImage =
      "radial-gradient(circle 16rem at -100px -100px, #000 0%, transparent 68%)";
    bright.style.maskImage = bright.style.webkitMaskImage;
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative select-none" aria-label={WORD} role="img">
      {/* Readable base — sets the layout box. */}
      <span
        aria-hidden
        className="block font-display font-semibold leading-[0.82] tracking-tight-2 text-white/30 text-[clamp(2.75rem,11.5vw,13rem)]"
      >
        {WORD}
        <span className="text-warn/40">.</span>
      </span>
      {/* Bright copy — revealed only under the cursor spotlight. */}
      <span
        ref={brightRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 block bg-gradient-to-r from-white via-[#dbe4ff] to-warn bg-clip-text font-display font-semibold leading-[0.82] tracking-tight-2 text-transparent text-[clamp(2.75rem,11.5vw,13rem)] [-webkit-background-clip:text]"
      >
        {WORD}
        <span className="text-warn">.</span>
      </span>
    </div>
  );
}

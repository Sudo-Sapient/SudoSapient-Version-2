"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const AMBER = "#FBBF24";
const WHITE = "#FFFFFF";
const BLUE = "#1E40AF";

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

function Bracket({ pos, d }: { pos: string; d: string }) {
  return (
    <svg
      width="9"
      height="9"
      viewBox="0 0 9 9"
      className={`absolute ${pos}`}
      fill="none"
      stroke={AMBER}
      strokeWidth="1"
    >
      <path d={d} />
    </svg>
  );
}

/**
 * Blueprint / CAD cursor: a thin crosshair (+) that tracks the pointer exactly
 * and recolours to stay legible — white on dark sections, blue on light ones,
 * amber while locked onto a link/button/figure (dimension brackets snap around
 * the target). Fine-pointer only (hidden on touch).
 */
export function BlueprintCursor() {
  const [enabled, setEnabled] = React.useState(false);
  const [hovering, setHovering] = React.useState(false);
  const [dark, setDark] = React.useState(true);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const spring = { stiffness: 380, damping: 30, mass: 0.5 };
  const bx = useSpring(0, spring);
  const by = useSpring(0, spring);
  const bw = useSpring(0, spring);
  const bh = useSpring(0, spring);

  const root = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    let lx = 0;
    let ly = 0;
    let lastDark = true;
    let lastSample = 0;
    let raf = 0;
    const sample = () => {
      raf = 0;
      // Throttle the (layout-forcing) elementsFromPoint + getComputedStyle work
      // to ~9×/s; the crosshair itself still tracks every frame.
      const now = performance.now();
      if (now - lastSample < 110) return;
      lastSample = now;
      // Recolour to whatever is painted directly under the crosshair.
      for (const el of document.elementsFromPoint(lx, ly)) {
        if (root.current?.contains(el)) continue;
        const r = nearestBgDark(el);
        if (r !== null) {
          if (r !== lastDark) {
            lastDark = r;
            setDark(r);
          }
          break;
        }
      }
    };
    const onMove = (e: PointerEvent) => {
      lx = e.clientX;
      ly = e.clientY;
      x.set(lx);
      y.set(ly);
      if (!raf) raf = requestAnimationFrame(sample);
    };

    const SEL = "a, button, [role='button'], [data-cursor='target'], label, summary";
    const onOver = (e: MouseEvent) => {
      const el = e.target as Element | null;
      const target = el?.closest(SEL) as HTMLElement | null;
      const field = el?.closest("input, textarea, select");
      if (target && !field) {
        const r = target.getBoundingClientRect();
        const pad = 6;
        bx.set(r.left - pad);
        by.set(r.top - pad);
        bw.set(r.width + pad * 2);
        bh.set(r.height + pad * 2);
        setHovering(true);
      } else {
        setHovering(false);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.documentElement.classList.remove("has-custom-cursor");
      if (raf) cancelAnimationFrame(raf);
    };
  }, [x, y, bx, by, bw, bh]);

  if (!enabled) return null;
  const color = hovering ? AMBER : dark ? WHITE : BLUE;

  return (
    <div ref={root} className="pointer-events-none fixed inset-0 z-[9999]" aria-hidden>
      {/* exact crosshair (+) */}
      <motion.div className="absolute left-0 top-0" style={{ x, y }}>
        <motion.svg
          width={26}
          height={26}
          viewBox="0 0 26 26"
          className="absolute"
          style={{ marginLeft: -13, marginTop: -13 }}
          animate={{ scale: hovering ? 1.35 : 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          fill="none"
          stroke={color}
          strokeWidth={1.2}
        >
          <line x1="13" y1="2" x2="13" y2="24" />
          <line x1="2" y1="13" x2="24" y2="13" />
        </motion.svg>
      </motion.div>

      {/* dimension brackets — snap around the hovered target */}
      <motion.div
        className="absolute left-0 top-0"
        style={{ x: bx, y: by, width: bw, height: bh }}
        animate={{ opacity: hovering ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      >
        <Bracket pos="left-0 top-0" d="M0,9 L0,0 L9,0" />
        <Bracket pos="right-0 top-0" d="M0,0 L9,0 L9,9" />
        <Bracket pos="left-0 bottom-0" d="M0,0 L0,9 L9,9" />
        <Bracket pos="right-0 bottom-0" d="M9,0 L9,9 L0,9" />
      </motion.div>
    </div>
  );
}

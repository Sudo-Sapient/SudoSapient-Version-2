"use client";

import * as React from "react";
import { Renderer, Triangle, Program, Mesh } from "ogl";
import { cn } from "@/lib/utils";

/**
 * BlueprintCanvas — a living "drafting table" rendered on the GPU.
 *
 * Sits as an opaque back-layer inside the deep-blue `bg-blueprint` sections
 * (right behind the content, on top of the static <GridBackground/> which is
 * kept as the no-WebGL fallback). It paints:
 *   • a deep-blue vertical wash with a slow sweeping "light source"
 *   • major + minor blueprint grids that drift continuously (the table breathes)
 *   • a faint drafting-paper grain
 *   • a ripple that bends the grid around the crosshair cursor
 *   • a scroll-driven "print-in" reveal — lines resolve top→bottom with a bright
 *     plotter frontier as the section enters the viewport
 *
 * Purely additive: pointer-events are off, content/cursor/figures are untouched.
 * Reduced motion → a single static fully-drawn frame, no rAF, no pointer.
 */

const VERT = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;

  uniform float uTime;
  uniform vec2  uResolution;
  uniform vec2  uMouse;     // local uv, 0..1 (y up)
  uniform float uMouseOn;   // 0..1 — eased presence of the cursor
  uniform float uReveal;    // 0..1 — scroll print-in progress
  uniform vec3  uColorA;    // base deep blue
  uniform vec3  uColorB;    // deepest shadow blue

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  // Anti-aliased grid: lines on integer boundaries of p. Resolution-independent
  // (no derivatives), aa = half line width in grid units.
  float gridFactor(vec2 p, float aa) {
    vec2 f = abs(fract(p - 0.5) - 0.5);
    vec2 l = smoothstep(aa, 0.0, f);
    return max(l.x, l.y);
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / max(uResolution.y, 1.0);

    // ---- base wash + sweeping light source -------------------------------
    vec3 base = mix(uColorB, uColorA, clamp(uv.y * 0.75 + 0.18, 0.0, 1.0));
    vec2 p = vec2(uv.x * aspect, uv.y);
    float sweep = 0.5 + 0.5 * sin(uTime * 0.07);
    vec2 lightPos = vec2(mix(0.05, 0.95, sweep) * aspect, 0.85);
    float light = smoothstep(1.15, 0.0, distance(p, lightPos));
    base += light * 0.10;

    // ---- grid coordinates: slow drift + cursor ripple --------------------
    vec2 gp = vec2(uv.x * aspect, uv.y);
    gp += vec2(uTime * 0.010, uTime * 0.006); // the table breathes

    vec2 m = vec2(uMouse.x * aspect, uMouse.y);
    vec2 toM = gp - m;
    float md = length(toM);
    float ripple = sin(md * 20.0 - uTime * 2.6) * exp(-md * 4.5) * 0.05 * uMouseOn;
    gp += normalize(toM + 1e-4) * ripple;

    float minor = gridFactor(gp * 20.0, 0.045) * 0.16;
    float major = gridFactor(gp * 5.0, 0.020) * 0.34;
    float grid = max(minor, major);

    // ---- scroll print-in: reveal lines top -> bottom with a plotter edge -
    float w = 1.0 - uv.y;                      // 0 at top, 1 at bottom
    float edge = uReveal * 1.12;
    float vis = smoothstep(edge, edge - 0.06, w);
    float drawing = step(0.001, uReveal) * step(uReveal, 0.999);
    float frontier = smoothstep(0.045, 0.0, abs(w - uReveal)) * drawing;
    grid *= vis;

    // ---- compose ---------------------------------------------------------
    vec3 lineCol = vec3(0.62, 0.76, 1.0);
    vec3 col = base + grid * lineCol;
    col += frontier * lineCol * 0.55;                       // bright plot edge
    col += smoothstep(0.28, 0.0, md) * 0.05 * uMouseOn * lineCol; // cursor glow
    col += (hash(uv * uResolution * 0.5 + uTime) - 0.5) * 0.022;  // paper grain

    gl_FragColor = vec4(col, 1.0);
  }
`;

// #1E40AF / #172554 in linear-ish 0..1 (sRGB values, good enough for a wash)
const COLOR_A: [number, number, number] = [30 / 255, 64 / 255, 175 / 255];
const COLOR_B: [number, number, number] = [13 / 255, 24 / 255, 64 / 255];

function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

type Props = {
  className?: string;
  /** Cursor ripple. Default true. */
  interactive?: boolean;
  /** Scroll print-in reveal. Default true. Pass false to stay fully drawn. */
  reveal?: boolean;
};

export function BlueprintCanvas({
  className,
  interactive = true,
  reveal = true,
}: Props) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Skip WebGL on phones entirely — the static <GridBackground/> fallback
    // shows and costs nothing. Tablets/desktop (>=768px) keep the live shader.
    if (window.matchMedia("(max-width: 767px)").matches) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    let renderer: Renderer;
    try {
      renderer = new Renderer({
        canvas,
        alpha: false,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio || 1, 1.5),
        powerPreference: "low-power",
      });
    } catch {
      return; // no WebGL → the static <GridBackground/> fallback stays visible
    }

    const gl = renderer.gl;
    gl.clearColor(COLOR_B[0], COLOR_B[1], COLOR_B[2], 1);

    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [1, 1] },
        uMouse: { value: [0.5, 0.5] },
        uMouseOn: { value: 0 },
        uReveal: { value: reveal ? 0 : 1 },
        uColorA: { value: COLOR_A },
        uColorB: { value: COLOR_B },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    const resize = () => {
      const parent = canvas.parentElement;
      const w = parent?.clientWidth || canvas.clientWidth || 1;
      const h = parent?.clientHeight || canvas.clientHeight || 1;
      renderer.setSize(w, h);
      program.uniforms.uResolution.value = [gl.canvas.width, gl.canvas.height];
    };
    resize();
    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    // Smoothed cursor + presence
    let mx = 0.5;
    let my = 0.5;
    let mOn = 0;
    let targetOn = 0;
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const lx = (e.clientX - r.left) / r.width;
      const ly = (e.clientY - r.top) / r.height;
      const inside = lx >= -0.1 && lx <= 1.1 && ly >= -0.1 && ly <= 1.1;
      targetOn = inside ? 1 : 0;
      if (inside) {
        mx = clamp01(lx);
        my = clamp01(1 - ly); // flip to uv (y up)
      }
    };
    if (interactive && fine && !reduce) {
      window.addEventListener("pointermove", onMove, { passive: true });
    }

    // Reduced motion → one fully-drawn static frame, then stop.
    if (reduce) {
      program.uniforms.uReveal.value = 1;
      program.uniforms.uMouseOn.value = 0;
      renderer.render({ scene: mesh });
      return () => {
        ro.disconnect();
        const ext = gl.getExtension("WEBGL_lose_context");
        ext?.loseContext();
      };
    }

    let raf = 0;
    let onScreen = true;

    // Stop cleanly if the GL context is lost (the browser can drop the oldest
    // context once too many exist). Fail safe to the static GridBackground
    // instead of throwing inside renderer.render().
    let lost = false;
    const onLost = (e: Event) => {
      e.preventDefault();
      lost = true;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };
    canvas.addEventListener("webglcontextlost", onLost, false);

    // Only render while on screen.
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen && !raf && !lost) raf = requestAnimationFrame(frame);
      },
      { rootMargin: "120px" }
    );
    io.observe(canvas);

    let t0 = 0;
    const frame = (now: number) => {
      raf = 0;
      if (lost || gl.isContextLost()) return;
      if (!t0) t0 = now;
      const t = (now - t0) / 1000;

      // Scroll print-in: progress as the section climbs into view.
      if (reveal) {
        const r = canvas.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        const target = clamp01((vh - r.top) / (vh * 0.75));
        const cur = program.uniforms.uReveal.value as number;
        program.uniforms.uReveal.value = cur + (target - cur) * 0.08;
      }

      // Ease cursor presence/position.
      mOn += (targetOn - mOn) * 0.08;
      const um = program.uniforms.uMouse.value as number[];
      um[0] += (mx - um[0]) * 0.12;
      um[1] += (my - um[1]) * 0.12;
      program.uniforms.uMouseOn.value = mOn;

      program.uniforms.uTime.value = t;
      try {
        renderer.render({ scene: mesh });
      } catch {
        lost = true;
        return;
      }

      raf = onScreen && !document.hidden ? requestAnimationFrame(frame) : 0;
    };
    raf = requestAnimationFrame(frame);

    const onVisibility = () => {
      if (!document.hidden && onScreen && !raf && !lost) raf = requestAnimationFrame(frame);
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("webglcontextlost", onLost);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
      const ext = gl.getExtension("WEBGL_lose_context");
      ext?.loseContext();
    };
  }, [interactive, reveal]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    />
  );
}

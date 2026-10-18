"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { withBasePath } from "@/lib/site";

type Inputs = Record<string, number | boolean>;

type RiveSceneProps = {
  /** Root-relative path under /public, e.g. "/rive/footer.riv". */
  src: string;
  stateMachine?: string;
  animation?: string;
  onAdvance?: (seconds: number) => void;
  onLoop?: () => void;
  artboard?: string;
  /** Number/boolean state-machine inputs, synced whenever they change. */
  inputs?: Inputs;
  /** Trigger inputs: bump a counter to fire the trigger once. */
  triggers?: Record<string, number>;
  /** Drive a number input named `progress` (0–100) from this element's pass through the viewport. */
  scrollProgress?: boolean;
  /** Rendered until the .riv exists, loads and is in view, and always under reduced motion. */
  fallback: React.ReactNode;
  className?: string;
  /** Sizes the Rive canvas (it has no intrinsic height), e.g. "aspect-[4/1] w-full". */
  frameClassName?: string;
  ariaLabel?: string;
};

// The Rive runtime (WASM) is only fetched once a scene actually mounts.
const RivePlayer = dynamic(() => import("./RivePlayer").then((m) => m.RivePlayer), {
  ssr: false,
});

const available = new Map<string, Promise<boolean>>();
function riveExists(url: string) {
  if (!available.has(url)) {
    available.set(
      url,
      fetch(url, { method: "HEAD" })
        .then((res) => res.ok)
        .catch(() => false)
    );
  }
  return available.get(url)!;
}

/**
 * Plays a Rive state machine in place of an existing SVG scene. Until the .riv
 * file is dropped into /public/rive (or under reduced motion) the fallback
 * renders unchanged, so scenes can migrate one file at a time.
 */
export function RiveScene({
  src,
  stateMachine,
  animation,
  onAdvance,
  onLoop,
  artboard,
  inputs,
  triggers,
  scrollProgress,
  fallback,
  className,
  frameClassName,
  ariaLabel,
}: RiveSceneProps) {
  const root = React.useRef<HTMLDivElement>(null);
  const [ready, setReady] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const url = withBasePath(src);

  React.useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        void riveExists(url).then((ok) => !cancelled && setReady(ok));
      },
      { rootMargin: "300px" }
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, [url]);

  React.useEffect(() => {
    const el = root.current;
    if (!ready || !scrollProgress || !el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 as the top edge enters the viewport, 100 as the bottom edge reaches its middle.
      const p = (vh - r.top) / (r.height + vh / 2);
      setProgress(Math.round(Math.min(1, Math.max(0, p)) * 100));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ready, scrollProgress]);

  return (
    <div ref={root} className={className}>
      {ready ? (
        <div className={frameClassName}>
          <RivePlayer
            src={url}
            stateMachine={stateMachine}
            animation={animation}
            onAdvance={onAdvance}
            onLoop={onLoop}
            artboard={artboard}
            inputs={scrollProgress ? { ...inputs, progress } : inputs}
            triggers={triggers}
            ariaLabel={ariaLabel}
            onError={() => setReady(false)}
          />
        </div>
      ) : (
        fallback
      )}
    </div>
  );
}

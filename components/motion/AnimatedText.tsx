"use client";

import * as React from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import SplitType from "split-type";
import { cn } from "@/lib/utils";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

type Variant = "rise" | "scramble" | "typewriter";

type Props = {
  text: string;
  as?: React.ElementType;
  variant?: Variant;
  className?: string;
  /** "load" runs once on mount; "inView" runs when scrolled into view. */
  trigger?: "load" | "inView";
  once?: boolean;
  /** Seconds before the animation begins. */
  delay?: number;
  /** Per-character cadence (rise stagger / typewriter step / scramble pace), seconds. */
  speed?: number;
};

/**
 * Restrained editorial text reveals. Legacy variant names are retained for
 * call-site compatibility, but noisy scrambling/typewriter effects are gone.
 * Display text reveals by masked words; technical labels use one quiet fade.
 * The real text remains in the DOM for SSR, no-JS, and assistive technology.
 */
export function AnimatedText({
  text,
  as = "span",
  variant = "rise",
  className,
  trigger = "inView",
  once = true,
  delay = 0,
  speed = 0.025,
}: Props) {
  const ref = React.useRef<HTMLElement>(null);
  const inner = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once, margin: "0px 0px -120px 0px" });
  const reduce = useReducedMotion();

  const run = trigger === "load" ? true : inView;

  useIsomorphicLayoutEffect(() => {
    const el = inner.current;
    if (!el || !run) return;
    // framer's useReducedMotion returns null on the first paint, then resolves.
    // Wait for it — otherwise the effect starts, gets cancelled when `reduce`
    // flips null→boolean, and a stale guard could leave the text frozen.
    if (reduce === null) return;

    if (reduce) {
      el.textContent = text;
      return;
    }

    // Technical annotations should feel precise, not theatrical.
    if (variant === "typewriter") {
      const tween = gsap.fromTo(
        el,
        { autoAlpha: 0, y: 5, letterSpacing: "0.22em" },
        { autoAlpha: 1, y: 0, letterSpacing: "0.14em", duration: 0.7, delay, ease: "power3.out" }
      );
      return () => tween.revert();
    }

    // Hero and section display type: masked word reveal with a restrained
    // cadence. No per-character bounce, random glyphs, or visual noise.
    const split = new SplitType(el, { types: "lines,words" });
    const lines = split.lines ?? [];
    const words = split.words ?? [];
    if (!words.length) return;
    gsap.set(lines, { overflow: "hidden", paddingBottom: "0.08em", marginBottom: "-0.08em" });
    const tween = gsap.fromTo(
      words,
      { yPercent: 115, autoAlpha: 0, rotate: 1.5, transformOrigin: "left bottom" },
      {
        yPercent: 0,
        autoAlpha: 1,
        rotate: 0,
        duration: variant === "scramble" ? 0.95 : 0.78,
        delay,
        stagger: Math.min(Math.max(speed * 1.5, 0.035), 0.07),
        ease: "power4.out",
      }
    );
    return () => {
      tween.revert();
      split.revert();
    };
  }, [run, reduce, variant, text, delay, speed]);

  // `as` is polymorphic; pin an explicit prop shape so the tag's children/ref
  // types don't collapse against the global JSX intrinsic-element union.
  const Tag = as as unknown as React.ComponentType<{
    ref?: React.Ref<HTMLElement>;
    className?: string;
    "aria-label"?: string;
    children?: React.ReactNode;
  }>;
  return (
    <Tag ref={ref} className={cn(className)} aria-label={text}>
      <span ref={inner} aria-hidden="true">
        {text}
      </span>
    </Tag>
  );
}

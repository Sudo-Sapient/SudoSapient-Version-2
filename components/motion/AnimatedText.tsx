"use client";

import * as React from "react";
import { animate, stagger, useInView, useReducedMotion } from "framer-motion";
import SplitType from "split-type";
import { cn } from "@/lib/utils";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>*+=:.#";

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
 * Crisp, engineered text reveals built on Motion + split-type.
 *   rise       — chars stagger up + fade (section headings on scroll)
 *   scramble   — letters flicker through glyphs then resolve (hero / CAD decode)
 *   typewriter — types in char by char with a block caret (mono annotations)
 *
 * The real text is always in the DOM (SSR + no-JS safe) and exposed to AT via
 * aria-label; the visual node is aria-hidden. Reduced motion shows final text.
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

    // --- rise: split to chars, stagger fade + translate up ---
    if (variant === "rise") {
      const split = new SplitType(el, { types: "words,chars" });
      const chars = split.chars ?? [];
      if (!chars.length) return;
      const controls = animate(
        chars,
        { opacity: [0, 1], y: [14, 0] },
        {
          duration: 0.45,
          delay: stagger(speed, { startDelay: delay }),
          ease: [0.22, 0.65, 0.3, 0.9],
        }
      );
      return () => {
        controls.stop();
        split.revert();
      };
    }

    // --- scramble: reveal left→right, flicker unresolved chars ---
    if (variant === "scramble") {
      const final = text;
      const perChar = Math.max(speed, 0.018) * 1000;
      let raf = 0;
      const start = performance.now() + delay * 1000;
      const tick = (now: number) => {
        const elapsed = now - start;
        if (elapsed < 0) {
          el.textContent = "";
          raf = requestAnimationFrame(tick);
          return;
        }
        let out = "";
        let done = true;
        for (let i = 0; i < final.length; i++) {
          if (final[i] === " ") {
            out += " ";
          } else if (elapsed >= i * perChar) {
            out += final[i];
          } else {
            out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
            done = false;
          }
        }
        el.textContent = out;
        if (done) el.textContent = final;
        else raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }

    // --- typewriter: type char by char with a block caret ---
    const step = Math.max(speed, 0.02) * 1000;
    let i = 0;
    let timer = 0;
    const type = () => {
      i += 1;
      el.textContent = text.slice(0, i) + (i < text.length ? "█" : "");
      if (i < text.length) timer = window.setTimeout(type, step);
    };
    el.textContent = "";
    timer = window.setTimeout(type, delay * 1000);
    return () => window.clearTimeout(timer);
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

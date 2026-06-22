"use client";

import * as React from "react";
import {
  motion,
  useReducedMotion,
  type TargetAndTransition,
  type Transition,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { FigureSurrender } from "@/components/figures/FigureSurrender";

type State = "alive" | "surrender" | "down" | "rising";
type Mode = "fall" | "fade";

type Props = {
  children: React.ReactNode;
  className?: string;
};

/**
 * "Shoot the stickman" easter egg. Aim the blueprint crosshair at a figure and
 * it drops what it's doing and throws its hands up (cursor locks via the CAD
 * brackets); click to "shoot" it. Each shot randomly either:
 *   • fall — comedic topple over (the bullet knocks it flat), springs back up.
 *   • fade — dissolves out gradually, bit by bit, then fades back in.
 * Respawns after ~2.5s and resumes. Fine-pointer only; reduced motion fades.
 *
 * The real figure (children) keeps its own animation untouched.
 */
export function Shootable({ children, className }: Props) {
  const [enabled, setEnabled] = React.useState(false);
  const [state, setState] = React.useState<State>("alive");
  const mode = React.useRef<Mode>("fade");
  const reduce = useReducedMotion();
  const timers = React.useRef<number[]>([]);

  React.useEffect(() => {
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      setEnabled(true);
    }
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const enter = () => setState((s) => (s === "alive" ? "surrender" : s));
  const leave = () => setState((s) => (s === "surrender" ? "alive" : s));
  const shoot = (e: React.MouseEvent) => {
    setState((s) => {
      if (s === "down" || s === "rising") return s;
      e.stopPropagation();
      timers.current.forEach(clearTimeout);
      mode.current = Math.random() < 0.5 ? "fall" : "fade";
      timers.current =
        mode.current === "fall"
          ? [
              window.setTimeout(() => setState("rising"), 2200),
              window.setTimeout(() => setState("alive"), 2700),
            ]
          : [window.setTimeout(() => setState("alive"), 2500)];
      return "down";
    });
  };

  // Touch / no fine pointer: render the figure plainly, no interaction.
  if (!enabled) {
    return (
      <span className={cn(className)} data-shoot-live>
        {children}
      </span>
    );
  }

  const live = state === "alive";
  const isFall = mode.current === "fall";

  // Ghost (surrender pose) animation for the current state + death mode.
  let ghostAnim: TargetAndTransition = { rotate: 0, y: 0, scale: 1, opacity: 1 };
  let ghostTrans: Transition = { duration: 0.1 };
  if (state === "down") {
    if (reduce) {
      ghostAnim = { opacity: 0 };
      ghostTrans = { duration: 0.15 };
    } else if (isFall) {
      ghostAnim = { rotate: 86, y: "8%", opacity: 1, scale: 1 };
      ghostTrans = { type: "spring", stiffness: 180, damping: 11 };
    } else {
      // gradual, bit-by-bit dissolve
      ghostAnim = { opacity: [1, 0.65, 0.35, 0.12, 0], scale: 1.1, y: -8 };
      ghostTrans = { duration: 0.7, ease: "linear" };
    }
  } else if (state === "rising") {
    ghostAnim = { rotate: 0, y: 0, scale: 1, opacity: 1 };
    ghostTrans = { type: "spring", stiffness: 240, damping: 14 };
  }

  return (
    <span
      className={cn("relative", className)}
      data-cursor="target"
      onPointerEnter={enter}
      onPointerLeave={leave}
      onClick={shoot}
      style={{ pointerEvents: "auto" }}
    >
      <motion.span
        data-shoot-live
        className="block"
        style={{ visibility: live ? "visible" : "hidden" }}
        initial={false}
        animate={{ opacity: live ? 1 : 0 }}
        transition={{ duration: live ? 0.4 : 0.1, ease: "easeOut" }}
      >
        {children}
      </motion.span>

      {state !== "alive" && (
        <motion.span
          className="absolute inset-0 block"
          aria-hidden
          style={{ transformOrigin: isFall ? "55% 100%" : "50% 50%" }}
          initial={false}
          animate={ghostAnim}
          transition={ghostTrans}
        >
          <FigureSurrender className="w-full" />
        </motion.span>
      )}
    </span>
  );
}

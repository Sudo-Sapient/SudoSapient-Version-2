"use client";

import * as React from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CornerBrackets } from "@/components/blueprint/CornerBrackets";
import { TechLabel } from "@/components/blueprint/TechLabel";
import { MascotFigure } from "@/components/figures/MascotFigure";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

// useLayoutEffect on the client, useEffect on the server (avoids the SSR warning).
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export type TeamMember = {
  name: string;
  role: string;
  img: string;
  bio?: string;
  focus?: string[];
};

const MASCOT_SIZE = 42;
const MASCOT_W = MASCOT_SIZE;
const MASCOT_H = MASCOT_SIZE * (70 / 40);
type Mode = "idle" | "walk" | "reach";

/**
 * The team. Each portrait is a flip-lid card: click it and a roaming stick
 * "doorman" walks across the row, reaches up, and the card flips open to its
 * bio. Click again (or another card) and it shuts / moves on. The walk only
 * runs on a single-row desktop layout with a fine pointer + motion allowed;
 * everywhere else the card simply flips on tap. Faces are never covered.
 */
export function TeamGrid({ members }: { members: TeamMember[] }) {
  const root = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const mascotRef = React.useRef<HTMLDivElement>(null);
  const facingRef = React.useRef<HTMLSpanElement>(null);
  const mascotX = React.useRef(0);
  const walkTween = React.useRef<gsap.core.Tween | null>(null);
  const modeTimer = React.useRef<number | null>(null);

  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  const [mode, setMode] = React.useState<Mode>("idle");
  const [roaming, setRoaming] = React.useState(false);

  // Mirror openIndex into a ref so the resize handler can read the current
  // value without re-running its effect (which would snap the mascot home).
  const openRef = React.useRef<number | null>(null);
  openRef.current = openIndex;

  // Caption / bracket entrance.
  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".team-card", {
        y: 48,
        autoAlpha: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: root.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const setFacing = (dir: number) => {
    if (facingRef.current) facingRef.current.style.transform = `scaleX(${dir})`;
  };

  // Stand the mascot at the foot of a card (its shirt-line), and remember its x.
  const placeMascot = React.useCallback((index: number, animate: boolean) => {
    const rootEl = root.current;
    const m = mascotRef.current;
    const card = cardRefs.current[index];
    if (!rootEl || !m || !card) return;
    const rr = rootEl.getBoundingClientRect();
    const cr = card.getBoundingClientRect();
    const x = cr.left + cr.width / 2 - rr.left - MASCOT_W / 2;
    m.style.top = `${cr.bottom - rr.top - MASCOT_H}px`;
    if (animate) {
      const from = mascotX.current;
      setFacing(x >= from ? 1 : -1);
      setMode("walk");
      const dur = Math.min(1.6, Math.max(0.45, Math.abs(x - from) / 620));
      walkTween.current?.kill();
      walkTween.current = gsap.to(m, {
        x,
        duration: dur,
        ease: "power1.inOut",
        onUpdate: () => {
          mascotX.current = gsap.getProperty(m, "x") as number;
        },
        onComplete: () => {
          mascotX.current = x;
          setFacing(1);
          setMode("reach");
          setOpenIndex(index);
        },
      });
    } else {
      gsap.set(m, { x });
      mascotX.current = x;
    }
  }, []);

  // Idle resting position (under the open card, else the first) + reflow on
  // resize. Runs only when roaming toggles — reads openIndex via the ref.
  useIsomorphicLayoutEffect(() => {
    if (!roaming) return;
    const settle = () => placeMascot(openRef.current ?? 0, false);
    const t = window.setTimeout(settle, 60);
    window.addEventListener("resize", settle);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", settle);
    };
  }, [roaming, placeMascot]);

  // Decide whether the walk choreography is available (single-row desktop).
  React.useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const wide = window.matchMedia("(min-width: 1024px)");
    const update = () => setRoaming(fine && !reduce && wide.matches);
    update();
    wide.addEventListener("change", update);
    return () => wide.removeEventListener("change", update);
  }, []);

  // Close on Escape.
  React.useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClick(openIndex);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openIndex]);

  React.useEffect(
    () => () => {
      walkTween.current?.kill();
      if (modeTimer.current) window.clearTimeout(modeTimer.current);
    },
    []
  );

  const handleClick = (i: number) => {
    if (modeTimer.current) window.clearTimeout(modeTimer.current);
    if (!roaming) {
      setOpenIndex((o) => (o === i ? null : i));
      return;
    }
    if (openIndex === i) {
      // close: shut the lid, then relax back to idle in place.
      setOpenIndex(null);
      setMode("reach");
      modeTimer.current = window.setTimeout(() => setMode("idle"), 650);
    } else {
      // walk over (closing whatever was open during transit), then flip open.
      setOpenIndex(null);
      placeMascot(i, true);
    }
  };

  return (
    <div ref={root} className="relative mt-14">
      <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
        {members.map((m, i) => {
          const open = openIndex === i;
          return (
            <figure key={m.name} className="team-card flex flex-col gap-4">
              <CornerBrackets tone="light" className="aspect-square">
                <button
                  type="button"
                  data-cursor="target"
                  aria-expanded={open}
                  aria-label={`${open ? "Close" : "Open"} bio for ${m.name}, ${m.role}`}
                  onClick={() => handleClick(i)}
                  ref={(el) => {
                    cardRefs.current[i] = el;
                  }}
                  className="flip-scene group block h-full w-full cursor-pointer"
                >
                  <div className={cn("flip-card", open && "is-open")}>
                    {/* Front — the portrait */}
                    <div className="flip-face flip-front border border-white/30 bg-white/5">
                      <Image
                        src={m.img}
                        alt={`${m.name}, ${m.role} at Sudo Sapient`}
                        fill
                        sizes="(min-width: 1024px) 18vw, (min-width: 640px) 30vw, 45vw"
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-gradient-to-t from-blueprint/90 to-transparent pb-2 pt-6 font-mono text-[10px] uppercase tracking-wide text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        ▸ Open
                      </span>
                    </div>

                    {/* Back — the bio */}
                    <div className="flip-face flip-back flex flex-col gap-2 border border-white/30 bg-[#0d1740] p-4 text-left">
                      <TechLabel tone="light">{`FIG. ${String(i + 1).padStart(2, "0")}`}</TechLabel>
                      <h4 className="font-display text-base font-bold leading-tight text-white">
                        {m.name}
                      </h4>
                      {m.bio && (
                        <p className="font-mono text-[11px] leading-relaxed text-white/75">
                          {m.bio}
                        </p>
                      )}
                      {m.focus && m.focus.length > 0 && (
                        <div className="mt-auto flex flex-wrap gap-1">
                          {m.focus.map((f) => (
                            <span
                              key={f}
                              className="border border-white/25 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide text-white/70"
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              </CornerBrackets>
              <figcaption className="flex flex-col gap-1">
                <h3 className="font-display text-lg font-bold leading-tight tracking-tight-2 text-white">
                  {m.name}
                </h3>
                <TechLabel tone="light">{m.role}</TechLabel>
              </figcaption>
            </figure>
          );
        })}
      </div>

      {/* Roaming mascot (single-row desktop only). */}
      {roaming && (
        <div
          ref={mascotRef}
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-20 text-white"
          style={{ width: MASCOT_W }}
        >
          <span ref={facingRef} className="block origin-center">
            <MascotFigure size={MASCOT_SIZE} mode={mode} />
          </span>
        </div>
      )}
    </div>
  );
}

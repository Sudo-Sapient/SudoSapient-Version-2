"use client";

import * as React from "react";
import { Container } from "@/components/layout/Container";
import { RiveScene } from "@/components/motion/RiveScene";
import { cn } from "@/lib/utils";

// Must match PHRASES in scripts/rive/strike.mjs: the desk scene acts out each one in turn.
const PHRASES = ["copy and paste.", "chase follow ups.", "type up reports.", "sort the inbox."];
const CYCLE_S = 4; // one phrase per 4s cycle of strike.riv
const STRIKE_S = 0.7; // the line goes through the phrase
const AWAY_S = 3.5; // the agent has taken the chore; fade before the next phrase

/** Section 1: one statement. Each chore gets struck out while an AI agent takes it off the desk. */
export function Pillars() {
  const elapsed = React.useRef(0);
  const [running, setRunning] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  // Booleans, not the raw clock: onAdvance fires every frame and equal state skips the render.
  const [cut, setCut] = React.useState(false);
  const [away, setAway] = React.useState(false);

  const onAdvance = React.useCallback((seconds: number) => {
    elapsed.current += seconds;
    const e = elapsed.current;
    setRunning(true);
    setIndex(Math.min(PHRASES.length - 1, Math.floor(e / CYCLE_S)));
    setCut(e % CYCLE_S >= STRIKE_S);
    setAway(e % CYCLE_S >= AWAY_S);
  }, []);
  const onLoop = React.useCallback(() => {
    elapsed.current = 0;
  }, []);

  // Without the scene (reduced motion, or before it loads) the first phrase sits struck out.
  const struck = !running || cut;
  const shown = !running || !away;

  return (
    <section className="relative overflow-hidden bg-[#eef1f5] py-20 sm:py-28">
      <Container className="grid items-center gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="font-serif text-[2.6rem] leading-[1.04] tracking-[-0.02em] text-ink sm:text-6xl md:text-7xl">
            Stop paying people to{" "}
            <span
              className={cn(
                "relative mt-[0.35em] inline-block font-mono text-[0.62em] font-medium tracking-normal text-blueprint transition-opacity duration-300",
                !shown && "opacity-0"
              )}
            >
              {PHRASES[index]}
              <span
                aria-hidden
                className={cn(
                  "absolute inset-x-0 top-[52%] h-[0.09em] origin-left bg-blueprint transition-transform duration-500 ease-out",
                  struck ? "scale-x-100" : "scale-x-0"
                )}
              />
            </span>
          </h2>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink/70">
            We find the busywork in your workflow and hand it to AI agents, so your team moves
            faster and earns more.
          </p>
          <a
            href="#how-we-transform"
            className="relative mt-6 inline-flex items-center gap-3 border-b border-ink/40 pb-1 font-mono text-[12px] uppercase tracking-[0.16em] text-ink transition-colors after:absolute after:-inset-y-3 after:inset-x-0 after:content-[''] hover:border-blueprint hover:text-blueprint"
          >
            See how it works
          </a>
        </div>
        <div className="lg:col-span-5">
          <RiveScene
            className="mx-auto w-full max-w-[520px]"
            frameClassName="aspect-[200/136] w-full"
            src="/rive/strike.riv"
            animation="loop"
            onAdvance={onAdvance}
            onLoop={onLoop}
            ariaLabel="A worker grinds through a chore at his desk until a cute AI agent pops in and takes it, and he leans back with his hands behind his head."
            fallback={null}
          />
        </div>
      </Container>
    </section>
  );
}

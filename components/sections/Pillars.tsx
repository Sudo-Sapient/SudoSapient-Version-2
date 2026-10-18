"use client";

import * as React from "react";
import { Container } from "@/components/layout/Container";
import { RiveScene } from "@/components/motion/RiveScene";
import { cn } from "@/lib/utils";

// Must match PHRASES in scripts/rive/strike.mjs: the overlay strikes each one in turn.
const PHRASES = ["copy and paste.", "chase follow-ups.", "type up reports.", "sort the inbox."];
const CYCLE_S = 4; // one phrase per 4s cycle of strike.riv
const VISIBLE_S = 2.55; // the agent carries the phrase off after this

/** Section 1: one statement. The busywork gets crossed out and handed to an AI agent. */
export function Pillars() {
  const elapsed = React.useRef(0);
  const [running, setRunning] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const [shown, setShown] = React.useState(true);

  const onAdvance = React.useCallback((seconds: number) => {
    elapsed.current += seconds;
    const t = elapsed.current;
    setRunning(true);
    setIndex(Math.min(PHRASES.length - 1, Math.floor(t / CYCLE_S)));
    setShown(t % CYCLE_S < VISIBLE_S);
  }, []);
  const onLoop = React.useCallback(() => {
    elapsed.current = 0;
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#eef1f5] py-20 sm:py-28">
      <Container>
        <h2 className="max-w-5xl font-serif text-[2.6rem] leading-[1.04] tracking-[-0.02em] text-ink sm:text-6xl md:text-7xl lg:text-[5.25rem]">
          Stop paying people to{" "}
          <span className="relative mt-4 block w-[17ch] whitespace-nowrap font-mono text-[0.6em] font-medium tracking-normal text-blueprint">
            <span
              className={cn(
                "transition-opacity duration-300",
                !shown && "opacity-0",
                !running && "line-through decoration-blueprint decoration-[0.1em]"
              )}
            >
              {PHRASES[index]}
            </span>
            {/* The stickman strikes the phrase; the amber agent carries it off. */}
            <RiveScene
              className="pointer-events-none absolute left-0 top-1/2 w-full -translate-y-1/2"
              frameClassName="aspect-[340/120] w-full"
              src="/rive/strike.riv"
              animation="loop"
              onAdvance={onAdvance}
              onLoop={onLoop}
              fallback={null}
            />
          </span>
        </h2>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink/70">
          We find the busywork in your workflow and hand it to AI agents, so your team moves faster
          and earns more.
        </p>
        <a
          href="#how-we-transform"
          className="mt-6 inline-flex items-center gap-3 border-b border-ink/40 pb-1 font-mono text-[12px] uppercase tracking-[0.16em] text-ink transition-colors hover:border-blueprint hover:text-blueprint"
        >
          See how it works <span aria-hidden>→</span>
        </a>
      </Container>
    </section>
  );
}

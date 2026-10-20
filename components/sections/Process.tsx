"use client";

import * as React from "react";
import { Container } from "@/components/layout/Container";
import { TechLabel } from "@/components/blueprint/TechLabel";
import { RiveScene } from "@/components/motion/RiveScene";
import { cn } from "@/lib/utils";

// Beat start times (seconds) must match the timeline in scripts/rive/transform.mjs.
const BEATS = [
  { at: 0, label: "Mess", line: "Your best people, buried in busywork." },
  { at: 3, label: "Call", line: "So they call Sudo Sapient. We're there fast." },
  { at: 7, label: "Audit", line: "We audit how the work really flows." },
  { at: 10, label: "Pilot", line: "We pilot one AI fix, with your team." },
  { at: 13, label: "Chill", line: "Then it runs on its own. They finally breathe." },
];

/** Section 3: a small comic strip. The message leads; the strip supports it. */
export function Process() {
  const elapsed = React.useRef(0);
  const [beat, setBeat] = React.useState(0);

  const onAdvance = React.useCallback((seconds: number) => {
    elapsed.current += seconds;
    const next = BEATS.reduce((n, b, i) => (elapsed.current >= b.at ? i : n), 0);
    setBeat((b) => (b === next ? b : next));
  }, []);
  const onLoop = React.useCallback(() => {
    elapsed.current = 0;
    setBeat(0);
  }, []);

  return (
    <section
      id="how-we-transform"
      className="relative scroll-mt-20 bg-[#eef1f5] py-16 text-ink sm:py-24"
    >
      <Container className="flex flex-col items-center text-center">
        <TechLabel tone="dark">How we transform</TechLabel>
        <h2 className="mt-4 max-w-2xl font-serif text-[2.6rem] leading-[1.04] tracking-[-0.02em] sm:text-6xl">
          We take the mess off your desk.
        </h2>

        <RiveScene
          className="mt-8 w-full max-w-[560px]"
          src="/rive/transform.riv"
          animation="story"
          onAdvance={onAdvance}
          onLoop={onLoop}
          frameClassName="aspect-[430/126] w-full"
          ariaLabel="A comic: an employee drowning in paperwork calls Sudo Sapient. Our developer dashes in, audits the pile with a magnifying glass, opens his laptop and automates it away, then strolls off while the employee puts his feet up, shades on, sipping coffee."
          fallback={
            <ol className="space-y-2 text-left text-lg text-ink/80">
              {BEATS.map((b) => (
                <li key={b.label}>
                  <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-ink/60">
                    {b.label}.
                  </span>{" "}
                  {b.line}
                </li>
              ))}
            </ol>
          }
        />

        <p className="mt-4 min-h-[1.75rem] text-lg text-ink/80 motion-reduce:hidden">
          {BEATS[beat].line}
        </p>
        <ol
          aria-label="Our process"
          className="mt-5 flex flex-wrap justify-center gap-x-2 gap-y-2 font-mono text-[12px] uppercase tracking-[0.14em]"
        >
          {BEATS.map((b, i) => (
            <li key={b.label} className="flex items-center gap-2">
              {i > 0 && (
                <span aria-hidden className="text-ink/30">
                  ·
                </span>
              )}
              <span
                aria-current={i === beat ? "step" : undefined}
                className={cn(
                  "border-b-2 pb-1 transition-colors duration-300",
                  i === beat ? "border-warn text-ink" : "border-transparent text-ink/60"
                )}
              >
                {b.label}
              </span>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

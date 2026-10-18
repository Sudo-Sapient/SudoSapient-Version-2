"use client";

import * as React from "react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/blueprint/SectionHeading";
import { ProcessScene } from "@/components/scenes/ProcessScene";
import { TechLabel } from "@/components/blueprint/TechLabel";
import { STAGES } from "@/lib/site";
import { RiveScene } from "@/components/motion/RiveScene";
import { cn } from "@/lib/utils";

const STAGE_SECONDS = 4; // transform.riv: each stage is 4s of the looping `story` timeline

/** The scene autoplays while in view; the card for the stage on screen lights up. */
export function Process() {
  const elapsed = React.useRef(0);
  const [stage, setStage] = React.useState(0);

  const onAdvance = React.useCallback((seconds: number) => {
    elapsed.current += seconds;
    const next = Math.min(STAGES.length - 1, Math.floor(elapsed.current / STAGE_SECONDS));
    setStage((s) => (s === next ? s : next));
  }, []);
  const onLoop = React.useCallback(() => {
    elapsed.current = 0;
    setStage(0);
  }, []);

  const scene = (
    artboard: "Desktop" | "Mobile",
    className: string,
    frameClassName: string,
    fallback: React.ReactNode
  ) => (
    <RiveScene
      className={className}
      src="/rive/transform.riv"
      artboard={artboard}
      animation="story"
      onAdvance={onAdvance}
      onLoop={onLoop}
      frameClassName={frameClassName}
      ariaLabel="A company moves through audit, pilot, scale and embed"
      fallback={fallback}
    />
  );

  return (
    <section
      id="how-we-transform"
      className="relative scroll-mt-20 bg-[#eef1f5] py-16 text-ink sm:py-24 md:py-32"
    >
      <Container>
        <SectionHeading
          tone="dark"
          index="03"
          eyebrow="HOW WE TRANSFORM"
          title="How we make your company AI-native."
          description="Four stages, from the first audit to a team that runs AI on its own. Each stage ships something real before the next one starts."
        />

        <div className="mt-12 border border-ink/15 bg-blueprint px-3 py-4 text-white sm:mt-14 sm:px-6">
          {scene("Desktop", "hidden md:block", "aspect-[900/210] w-full", <ProcessScene />)}
          {scene("Mobile", "md:hidden", "mx-auto aspect-[390/640] w-full max-w-sm", null)}
        </div>

        <ol className="mt-6 grid gap-px border border-ink/15 bg-ink/15 sm:grid-cols-2 lg:grid-cols-4">
          {STAGES.map((step, i) => (
            <li
              key={step.n}
              aria-current={i === stage ? "step" : undefined}
              className={cn(
                "flex flex-col border-t-2 bg-[#eef1f5] p-5 transition-[opacity,border-color] duration-300 sm:p-6",
                i === stage ? "border-warn opacity-100" : "border-transparent opacity-75"
              )}
            >
              <span className="flex items-center justify-between gap-4">
                <TechLabel tone="dark">Stage {step.n}</TechLabel>
                <TechLabel tone="dark">{step.time}</TechLabel>
              </span>
              <h3 className="mt-3 font-display text-2xl font-bold tracking-tight-2">
                {step.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink/70">{step.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}

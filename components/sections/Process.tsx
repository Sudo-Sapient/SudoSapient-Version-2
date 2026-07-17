"use client";

import * as React from "react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/blueprint/SectionHeading";
import { ProcessScene } from "@/components/scenes/ProcessScene";
import { TechLabel } from "@/components/blueprint/TechLabel";

const steps = [
  {
    n: "01",
    title: "Discover",
    time: "1 week",
    body: "We map the workflow, pressure-test the opportunity, and choose one outcome worth shipping.",
  },
  {
    n: "02",
    title: "Prototype",
    time: "2 weeks",
    body: "A narrow working slice using real data and a real model—not a clickable theatre demo.",
  },
  {
    n: "03",
    title: "Build",
    time: "3–6 weeks",
    body: "We add the product layer, integrations, evals, guardrails, telemetry, and operating controls.",
  },
  {
    n: "04",
    title: "Ship",
    time: "Handoff",
    body: "You receive production code, documentation, dashboards, and support through the first month.",
  },
];

export function Process() {
  return (
    <section className="relative overflow-hidden bg-[#eef1f5] py-16 text-ink sm:py-24 md:py-32">
      <Container>
        <SectionHeading
          tone="dark"
          index="03"
          eyebrow="HOW WE WORK"
          title="From target to production in four stages."
          description="A fixed delivery rhythm keeps scope honest and gets a useful system in front of real users early."
        />

        <div className="mx-auto mt-14 hidden max-w-4xl border border-ink/15 bg-blueprint px-6 py-8 text-white md:block">
          <ProcessScene />
        </div>

        <div className="mt-10 grid gap-px border border-ink/15 bg-ink/15 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <article
              key={step.n}
              className="flex min-h-0 flex-col bg-[#eef1f5] p-6 sm:min-h-[260px] sm:p-8"
            >
              <div className="flex items-center justify-between gap-4">
                <TechLabel tone="dark">STEP_{step.n}</TechLabel>
                <TechLabel tone="dark">{step.time}</TechLabel>
              </div>
              <h3 className="mt-8 font-display text-2xl font-bold tracking-tight-2 sm:text-3xl">
                {step.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-ink/70">{step.body}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

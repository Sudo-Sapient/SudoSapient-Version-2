"use client";

import * as React from "react";
import { Container } from "@/components/layout/Container";
import { GridBackground } from "@/components/blueprint/GridBackground";
import { BlueprintCanvas } from "@/components/blueprint/BlueprintCanvas";
import { SectionHeading } from "@/components/blueprint/SectionHeading";
import { ProcessScene } from "@/components/scenes/ProcessScene";
import { TechLabel } from "@/components/blueprint/TechLabel";

const steps = [
  {
    n: "01",
    title: "Discover",
    body: "One week. We sit with you, map the system, and pick a target worth shipping.",
  },
  {
    n: "02",
    title: "Prototype",
    body: "Two weeks. A working slice you can use. Real data, real model, narrow scope.",
  },
  {
    n: "03",
    title: "Build",
    body: "Three to six weeks. The system around the slice. Eval, guardrails, telemetry.",
  },
  {
    n: "04",
    title: "Ship",
    body: "Hand-off with docs and dashboards. We stay on call for the first month.",
  },
];

export function Process() {
  return (
    <section className="relative overflow-hidden bg-blueprint py-24 text-white sm:py-32">
      <GridBackground />
      <BlueprintCanvas />
      <Container className="relative z-10">
        <SectionHeading
          index="03"
          eyebrow="HOW WE WORK"
          title="Four nodes. One line. Six to ten weeks."
          description="The blueprint is the same every time. The work it produces is not."
        />

        <div className="mt-16">
          <ProcessScene />
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="flex flex-col gap-3">
              <TechLabel>STEP_{s.n}</TechLabel>
              <div className="h-px w-full bg-white/30" />
              <h3 className="font-display text-2xl font-bold tracking-tight-2">
                {s.title}
              </h3>
              <p className="text-sm leading-relaxed text-white/75">{s.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

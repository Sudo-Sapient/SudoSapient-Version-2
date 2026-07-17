"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/blueprint/SectionHeading";
import { TechLabel } from "@/components/blueprint/TechLabel";
import { PillarWorkshop } from "@/components/scenes/PillarWorkshop";

const pillars = [
  {
    code: "P.01",
    kind: "product" as const,
    title: "AI Products",
    body: "Customer-facing AI features and full products. Agents, copilots, generative UX, and retrieval over your own data.",
    bullets: [
      "In-product agents",
      "Copilots & assistants",
      "Generative UX",
      "RAG over private data",
    ],
  },
  {
    code: "P.02",
    kind: "automation" as const,
    title: "AI Automation",
    body: "Internal workflows that used to need humans. Typed pipelines, deterministic where it matters, LLM-routed where it pays.",
    bullets: [
      "Ops & back-office",
      "Email / ticket / CRM routing",
      "Document pipelines",
      "Vendor & data plumbing",
    ],
  },
  {
    code: "P.03",
    kind: "media" as const,
    title: "AI Media",
    body: "Films, shows, and editorial systems that produce on a cadence. We build the pipeline; you ship the work.",
    bullets: [
      "Short-form video",
      "Podcast → multichannel",
      "Editorial pipelines",
      "Image & motion systems",
    ],
  },
];

export function Pillars() {
  return (
    <section className="relative overflow-hidden bg-[#eef1f5] py-16 sm:py-24 md:py-32">
      <Container>
        <SectionHeading
          index="01"
          eyebrow="WHAT WE BUILD"
          title="Three disciplines. One working floor."
          description="Not three disconnected offers. One studio that assembles product, operations, and media systems around the problem."
          tone="dark"
        />

        <div className="mt-12 grid gap-3 sm:mt-16 lg:grid-cols-3">
          {pillars.map((pillar, index) => {
            return (
              <motion.article
                key={pillar.code}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.75, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="border-ink/14 overflow-hidden border bg-[#f4f6f8]"
              >
                <div className="border-ink/12 flex items-center justify-between border-b px-5 py-4 sm:px-7">
                  <TechLabel tone="dark">{pillar.code}</TechLabel>
                  <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink/35">
                    Live workshop ·{" "}
                    {pillar.kind === "product"
                      ? "Assembly"
                      : pillar.kind === "automation"
                        ? "Routing"
                        : "Production"}
                  </span>
                </div>

                <PillarWorkshop kind={pillar.kind} />

                <div className="p-6 sm:p-7">
                  <div>
                    <h3 className="font-display text-2xl tracking-[-0.045em] text-ink sm:text-3xl">
                      {pillar.title}
                    </h3>
                    <p className="text-ink/68 mt-3 max-w-xl text-[15px] leading-relaxed">
                      {pillar.body}
                    </p>
                  </div>

                  <ul className="border-ink/12 mt-6 grid gap-x-5 border-t pt-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    {pillar.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="text-ink/67 flex min-h-8 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.11em]"
                      >
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-warn" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

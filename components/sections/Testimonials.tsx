"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/blueprint/SectionHeading";
import { CornerBrackets } from "@/components/blueprint/CornerBrackets";
import { TechLabel } from "@/components/blueprint/TechLabel";

type Testimonial = {
  quote: string;
  name: string;
  org: string;
  isPlaceholder?: boolean;
};

// TODO: replace placeholder quotes with real, approved testimonials.
const testimonials: Testimonial[] = [
  {
    quote:
      "Placeholder — quote from Yogi Puneet pending approval. The control center gave our GTM team one source of truth they actually trust.",
    name: "Yogi Puneet",
    org: "Jgsaw",
    isPlaceholder: true,
  },
  {
    quote:
      "Placeholder — quote from Kishan pending approval. They shipped the platform fast and we were running it ourselves within weeks.",
    name: "Kishan",
    org: "Shipzy",
    isPlaceholder: true,
  },
];

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="scroll-mt-20 bg-offwhite pb-24 pt-4 sm:pb-32"
    >
      <Container>
        <SectionHeading
          tone="dark"
          index="04"
          eyebrow="TESTIMONIALS"
          title="What founders say."
          description="The people who put working AI systems into production."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <CornerBrackets
                tone="dark"
                className="relative flex h-full flex-col gap-8 border border-ink/15 bg-white p-8 sm:p-10"
              >
                {t.isPlaceholder && (
                  <span className="absolute right-3 top-3 border border-warn/60 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-warn">
                    PLACEHOLDER
                  </span>
                )}

                <p className="font-display text-xl font-bold leading-snug tracking-tight-2 text-ink sm:text-2xl">
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div className="mt-auto flex items-center gap-4">
                  <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-ink/25 font-mono text-sm text-ink/70">
                    {t.name.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display text-base font-bold tracking-tight-2 text-ink">
                      {t.name}
                    </span>
                    <TechLabel tone="dark">{t.org}</TechLabel>
                  </div>
                </div>
              </CornerBrackets>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}

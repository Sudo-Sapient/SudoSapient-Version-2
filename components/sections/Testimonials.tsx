"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/blueprint/SectionHeading";
import { TechLabel } from "@/components/blueprint/TechLabel";

const testimonials = [
  {
    quote:
      "Sudo Sapient took a workflow that depended on repetitive manual coordination and turned it into an automation our team can actually operate. They understood the edge cases and stayed focused on what would save us time in practice.",
    name: "Kishan",
    company: "Shipzy",
    discipline: "AI Automation",
  },
  {
    quote:
      "They helped us turn an ambitious AI product idea into something clear, usable, and ready for real customers. The team moved quickly without treating product experience or reliability as an afterthought.",
    name: "Bhopal",
    company: "Taamul",
    discipline: "AI Product",
  },
  {
    quote:
      "Sudo Sapient worked with us like a product team, not an outsourced development shop. They challenged assumptions early, made the AI useful inside the workflow, and shipped a product that felt considered from the first release.",
    name: "Puneet",
    company: "Jgsaw",
    discipline: "AI Product",
  },
  {
    quote:
      "They built an AI media workflow that gave us speed without flattening the creative process. We can produce more consistently while retaining control over the voice, visual direction, and final output.",
    name: "Yatin",
    company: "Fabplay",
    discipline: "AI Media",
  },
  {
    quote:
      "The team translated a complex operational idea into a focused AI product our people could understand and use. They were thoughtful about the workflow, the edge cases, and what needed to be dependable from day one.",
    name: "Venkateswaran",
    company: "Vencuts",
    discipline: "AI Product",
  },
] as const;

export function Testimonials() {
  const [active, setActive] = React.useState(0);
  const current = testimonials[active];

  const selectRelative = (direction: number) => {
    setActive((value) => (value + direction + testimonials.length) % testimonials.length);
  };

  return (
    <section
      id="testimonials"
      className="scroll-mt-20 overflow-hidden bg-offwhite pb-16 pt-4 sm:pb-24 md:pb-32"
    >
      <Container>
        <SectionHeading
          tone="dark"
          index="04"
          eyebrow="TESTIMONIALS"
          title="Real outcomes. Built together."
          description="Five people who trusted us with products, automations, and media systems that had to work outside the pitch deck."
        />

        <div className="border-ink/18 mt-12 border-y sm:mt-16 lg:grid lg:grid-cols-12">
          <div className="border-ink/18 relative min-h-[430px] overflow-hidden border-b bg-white px-6 py-8 sm:px-10 sm:py-10 lg:col-span-7 lg:min-h-[510px] lg:border-b-0 lg:border-r lg:px-12 lg:py-12">
            <div className="flex items-center justify-between gap-4">
              <TechLabel tone="dark">FEATURED TESTIMONIAL</TechLabel>
              <TechLabel tone="dark">{String(active + 1).padStart(2, "0")} / 05</TechLabel>
            </div>

            <div className="mt-10 max-w-2xl sm:mt-14">
              <span aria-hidden className="font-display text-6xl leading-none text-warn">
                “
              </span>
              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={current.name}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
                  className="-mt-2 text-balance font-display text-2xl font-bold leading-[1.2] tracking-[-0.035em] text-ink sm:text-3xl lg:text-[2.15rem]"
                >
                  {current.quote}
                </motion.blockquote>
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${current.name}-credit`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute bottom-8 left-6 sm:bottom-10 sm:left-10 lg:bottom-12 lg:left-12"
              >
                <p className="font-display text-xl font-bold tracking-[-0.035em] text-ink">
                  {current.name}
                </p>
                <TechLabel tone="dark">
                  {current.company} · {current.discipline}
                </TechLabel>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative bg-[#eef1f5] p-6 sm:p-8 lg:col-span-5 lg:p-10">
            <div className="flex items-center justify-between gap-4 border-b border-ink/15 pb-4">
              <TechLabel tone="dark">SELECT A VOICE</TechLabel>
              <div className="flex gap-2">
                <button
                  onClick={() => selectRelative(-1)}
                  className="flex h-9 w-9 items-center justify-center border border-ink/25 text-ink transition-colors hover:border-ink hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                  aria-label="Previous testimonial"
                >
                  ←
                </button>
                <button
                  onClick={() => selectRelative(1)}
                  className="flex h-9 w-9 items-center justify-center border border-ink/25 text-ink transition-colors hover:border-ink hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                  aria-label="Next testimonial"
                >
                  →
                </button>
              </div>
            </div>

            <div role="tablist" aria-label="Testimonials" className="mt-3">
              {testimonials.map((testimonial, index) => {
                const selected = index === active;
                return (
                  <button
                    key={testimonial.name}
                    role="tab"
                    aria-selected={selected}
                    aria-controls="active-testimonial"
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActive(index)}
                    onKeyDown={(event) => {
                      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                        event.preventDefault();
                        selectRelative(1);
                      }
                      if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                        event.preventDefault();
                        selectRelative(-1);
                      }
                    }}
                    className="border-ink/12 group grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-3 border-b py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ink"
                  >
                    <span
                      className={`font-mono text-[10px] tracking-[0.16em] transition-colors ${selected ? "text-warn" : "text-ink/35"}`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>
                      <span
                        className={`block font-display text-xl font-bold tracking-[-0.035em] transition-transform duration-300 ${selected ? "translate-x-1 text-ink" : "text-ink/60 group-hover:translate-x-1 group-hover:text-ink"}`}
                      >
                        {testimonial.name}
                      </span>
                      <span className="text-ink/42 mt-1 block font-mono text-[9px] uppercase tracking-[0.13em]">
                        {testimonial.company} · {testimonial.discipline}
                      </span>
                    </span>
                    <span
                      className={`h-2 w-2 border border-ink/35 transition-colors ${selected ? "bg-warn" : "bg-transparent"}`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="mt-8 border-l-2 border-warn/60 pl-4">
              <p className="max-w-[20rem] font-mono text-[9px] uppercase leading-relaxed tracking-[0.13em] text-ink/45">
                Choose a client to read their full testimonial and project context.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

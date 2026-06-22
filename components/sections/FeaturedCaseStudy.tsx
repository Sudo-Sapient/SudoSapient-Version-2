"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { GridBackground } from "@/components/blueprint/GridBackground";
import { BlueprintCanvas } from "@/components/blueprint/BlueprintCanvas";
import { BlueprintFrame } from "@/components/blueprint/BlueprintFrame";
import { CornerBrackets } from "@/components/blueprint/CornerBrackets";
import { TechLabel } from "@/components/blueprint/TechLabel";
import { DimensionLine } from "@/components/blueprint/DimensionLine";
import { SectionHeading } from "@/components/blueprint/SectionHeading";
import { SystemDiagram } from "@/components/blueprint/SystemDiagram";
import { Button } from "@/components/ui/Button";
import {
  FigureMeasuring,
  FigureCarrying,
  FigureStanding,
  FigureSitting,
  BreathingFigure,
} from "@/components/figures";
import { projects } from "@/lib/projects";

export function FeaturedCaseStudy() {
  const project =
    projects.find((p) => p.featured) ??
    projects.find((p) => p.slug === "mayaakars");
  if (!project) return null;

  return (
    <section className="relative overflow-hidden bg-blueprint py-24 text-white sm:py-32">
      <GridBackground />
      <BlueprintCanvas />

      <Container className="relative z-10">
        <SectionHeading
          index="03"
          eyebrow="CASE STUDY · 01"
          title="Mayaakars: a portfolio that reads like a floor plan."
          description="A premier architecture and interior design firm wanted a digital-first brand. We built the website, the brand positioning, and the portfolio architecture under it — end-to-end, in record time."
        />

        <div className="mt-16">
          <BlueprintFrame
            subject="MAYAAKARS · PORTFOLIO PLATFORM"
            type="WEB & BRAND"
            version="V1.0"
            date={project.year}
          >
            <div className="grid items-stretch gap-12 lg:grid-cols-12">
              {/* LEFT — diagram + figures composition */}
              <div className="relative lg:col-span-7">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6 }}
                  className="relative aspect-[5/4] w-full overflow-hidden border border-white/25"
                >
                  {project.image ? (
                    project.externalUrl ? (
                      <a
                        href={project.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 block"
                        aria-label={`Visit ${project.client}`}
                      >
                        <Image
                          src={project.image}
                          alt={`${project.client} — ${project.title}`}
                          fill
                          sizes="(min-width: 1024px) 640px, 100vw"
                          className="object-cover transition-transform duration-500 hover:scale-[1.02]"
                          priority
                        />
                      </a>
                    ) : (
                      <Image
                        src={project.image}
                        alt={`${project.client} — ${project.title}`}
                        fill
                        sizes="(min-width: 1024px) 640px, 100vw"
                        className="object-cover"
                        priority
                      />
                    )
                  ) : (
                    <div className="h-full w-full p-4 sm:p-6">
                      <SystemDiagram
                        title="FIG. MK · STUDIO → PORTFOLIO → DISTRIBUTION"
                        tone="light"
                        viewBoxW={500}
                        viewBoxH={400}
                        nodes={[
                          { id: "studio", x: 12, y: 50, label: "STUDIO" },
                          { id: "brand", x: 36, y: 22, label: "BRAND" },
                          { id: "design", x: 36, y: 78, label: "DESIGN SYS" },
                          { id: "cms", x: 60, y: 50, label: "CMS" },
                          { id: "site", x: 82, y: 30, label: "SITE" },
                          { id: "intake", x: 82, y: 70, label: "INTAKE", shape: "circle" },
                        ]}
                        edges={[
                          { from: "studio", to: "brand" },
                          { from: "studio", to: "design" },
                          { from: "brand", to: "cms", label: "voice" },
                          { from: "design", to: "cms", label: "tokens" },
                          { from: "cms", to: "site", label: "render" },
                          { from: "cms", to: "intake" },
                        ]}
                      />
                    </div>
                  )}

                  {/* figures pinned around the structure for depth */}
                  <div className="pointer-events-none absolute -left-3 bottom-2 text-white opacity-90 sm:-left-5">
                    <BreathingFigure index={0}>
                      <FigureMeasuring size={96} />
                    </BreathingFigure>
                  </div>
                  <div className="pointer-events-none absolute -right-2 top-6 text-white opacity-80 sm:-right-4">
                    <BreathingFigure index={1}>
                      <FigureStanding size={72} />
                    </BreathingFigure>
                  </div>
                  <div className="pointer-events-none absolute -right-1 -bottom-2 text-white opacity-90 sm:-right-2">
                    <BreathingFigure index={2}>
                      <FigureCarrying size={88} />
                    </BreathingFigure>
                  </div>
                </motion.div>

                <div className="mt-6">
                  <DimensionLine label="END-TO-END · BRAND → SHIP" tone="light" />
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <TechLabel>CLIENT · MAYAAKARS</TechLabel>
                  <TechLabel>SECTOR · ARCH + INTERIORS</TechLabel>
                  <TechLabel className="hidden sm:inline-block">
                    SHEET MK / 01
                  </TechLabel>
                </div>
              </div>

              {/* RIGHT — narrative */}
              <div className="flex flex-col gap-8 lg:col-span-5">
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="flex flex-col gap-2"
                >
                  <TechLabel>{"// THE TASK"}</TechLabel>
                  <h3 className="font-display text-2xl font-bold leading-tight tracking-tight-2 sm:text-3xl">
                    A high-end portfolio for a firm that builds high-end spaces.
                  </h3>
                  <p className="text-white/80">
                    Mayaakars&rsquo;s work lived in PDFs and an Instagram grid.
                    They needed a website that read as well-constructed as the
                    rooms they design — and a brand positioned for a digital-first
                    audience.
                  </p>
                </motion.div>

                <Block index="01" label="PROBLEM" body={project.problem} />
                <Block index="02" label="APPROACH" body={project.approach} />
                <Block index="03" label="OUTCOME" body={project.outcome} />

                <div>
                  <Button asChild variant="primary" size="lg">
                    <Link href={`/work/${project.slug}`}>
                      Read the full case study →
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* METRICS — dimension row */}
            <div className="mt-12 border-t border-white/25 pt-8">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                {project.metrics.map((m, i) => (
                  <motion.div
                    key={m.label}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                  >
                    <CornerBrackets
                      tone="light"
                      className="flex flex-col gap-2 px-5 py-4"
                    >
                      <TechLabel>{m.label}</TechLabel>
                      <span className="font-display text-2xl font-bold tracking-tight-2 sm:text-3xl">
                        {m.value}
                      </span>
                    </CornerBrackets>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Footer notation with one more figure for asymmetric balance */}
            <div className="mt-10 flex items-end justify-between gap-6 border-t border-white/25 pt-6">
              <div className="flex flex-col gap-1">
                <TechLabel>{"// DELIVERABLES"}</TechLabel>
                <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-white/85">
                  WEBSITE · BRAND POSITIONING · PORTFOLIO ARCHITECTURE · INTAKE
                </p>
              </div>
              <div className="text-white opacity-90">
                <BreathingFigure index={3}>
                  <FigureSitting size={64} />
                </BreathingFigure>
              </div>
            </div>
          </BlueprintFrame>
        </div>
      </Container>
    </section>
  );
}

function Block({
  index,
  label,
  body,
}: {
  index: string;
  label: string;
  body: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-3"
    >
      <div className="flex items-baseline gap-3">
        <TechLabel>{index}</TechLabel>
        <TechLabel underline>{label}</TechLabel>
      </div>
      <p className="text-[15px] leading-relaxed text-white/85">{body}</p>
    </motion.div>
  );
}

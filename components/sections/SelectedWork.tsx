"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/blueprint/SectionHeading";
import { GridBackground } from "@/components/blueprint/GridBackground";
import { TechLabel } from "@/components/blueprint/TechLabel";
import { CornerBrackets } from "@/components/blueprint/CornerBrackets";
import { SystemDiagram } from "@/components/blueprint/SystemDiagram";
import { Button } from "@/components/ui/Button";
import { projects } from "@/lib/projects";

// One system diagram per project — architecture, not generic rectangle.
type DiagramSpec = Pick<
  React.ComponentProps<typeof SystemDiagram>,
  "title" | "nodes" | "edges"
>;

const projectDiagrams: Record<string, DiagramSpec> = {
  mayaakars: {
    title: "FIG. MK · PORTFOLIO PLATFORM",
    nodes: [
      { id: "brand", x: 10, y: 30, label: "BRAND" },
      { id: "design", x: 10, y: 70, label: "DESIGN" },
      { id: "cms", x: 40, y: 50, label: "CMS" },
      { id: "site", x: 70, y: 50, label: "SITE" },
      { id: "press", x: 92, y: 25, label: "PRESS", shape: "circle" },
      { id: "intake", x: 92, y: 75, label: "INTAKE", shape: "circle" },
    ],
    edges: [
      { from: "brand", to: "cms" },
      { from: "design", to: "cms" },
      { from: "cms", to: "site", label: "render" },
      { from: "site", to: "press" },
      { from: "site", to: "intake" },
    ],
  },
  jgsaw: {
    title: "FIG. JG · CONTEXT → MOTION",
    nodes: [
      { id: "icp", x: 10, y: 22, label: "ICP" },
      { id: "persona", x: 10, y: 50, label: "PERSONA" },
      { id: "compete", x: 10, y: 78, label: "COMPETE" },
      { id: "engine", x: 42, y: 50, label: "ENGINE" },
      { id: "deals", x: 74, y: 22, label: "DEALS" },
      { id: "camp", x: 74, y: 50, label: "CAMPAIGNS" },
      { id: "assets", x: 74, y: 78, label: "ASSETS" },
      { id: "view", x: 94, y: 50, label: "GTM", shape: "circle" },
    ],
    edges: [
      { from: "icp", to: "engine" },
      { from: "persona", to: "engine" },
      { from: "compete", to: "engine" },
      { from: "engine", to: "deals", label: "deal" },
      { from: "engine", to: "camp", label: "camp" },
      { from: "engine", to: "assets" },
      { from: "deals", to: "view" },
    ],
  },
  "be-pawsh": {
    title: "FIG. BP · IDEA → POST",
    nodes: [
      { id: "note", x: 8, y: 50, label: "VOICE", shape: "circle" },
      { id: "script", x: 28, y: 25, label: "SCRIPT" },
      { id: "style", x: 28, y: 75, label: "STYLE" },
      { id: "render", x: 52, y: 50, label: "RENDER" },
      { id: "voice", x: 76, y: 25, label: "VO" },
      { id: "post", x: 76, y: 75, label: "POST" },
      { id: "reel", x: 94, y: 50, label: "REEL", shape: "circle" },
    ],
    edges: [
      { from: "note", to: "script" },
      { from: "note", to: "style" },
      { from: "script", to: "render", label: "beats" },
      { from: "style", to: "render", label: "look" },
      { from: "render", to: "voice" },
      { from: "render", to: "post" },
      { from: "voice", to: "reel" },
      { from: "post", to: "reel" },
    ],
  },
};

export function SelectedWork() {
  return (
    <section className="relative overflow-hidden bg-blueprint py-24 text-white sm:py-32">
      <GridBackground />
      <Container className="relative z-10">
        <SectionHeading
          index="02"
          eyebrow="SELECTED WORK"
          title="What we've built."
          description="A studio is only as serious as the systems on its shelf. Three from the last quarter."
        />

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {projects.map((p, i) => {
            const diagram = projectDiagrams[p.slug];
            return (
              <motion.div
                key={p.slug}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <CornerBrackets
                  tone="light"
                  className="flex h-full flex-col gap-5 bg-blueprint p-6 sm:p-8"
                >
                  <div className="flex items-center justify-between">
                    <TechLabel>{p.discipline.toUpperCase()}</TechLabel>
                    <TechLabel>{p.year}</TechLabel>
                  </div>

                  <div className="relative aspect-[5/3] w-full overflow-hidden border border-white/20">
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={`${p.client} — ${p.title}`}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover"
                      />
                    ) : (
                      diagram && (
                        <div className="h-full w-full p-3">
                          <SystemDiagram
                            {...diagram}
                            tone="light"
                            viewBoxW={400}
                            viewBoxH={240}
                          />
                        </div>
                      )
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <h3 className="font-display text-xl font-bold leading-tight tracking-tight-2">
                      {p.title}
                    </h3>
                    <p className="text-sm text-white/70">{p.oneLiner}</p>
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <TechLabel className="text-white/60">{p.client}</TechLabel>
                    <Link
                      href={`/work/${p.slug}`}
                      className="font-mono text-[12px] uppercase tracking-[0.18em] text-white/85 hover:text-white"
                    >
                      Read →
                    </Link>
                  </div>

                  {p.isPlaceholder && (
                    <span className="absolute right-2 top-2 border border-warn/60 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.2em] text-warn">
                      PLACEHOLDER
                    </span>
                  )}
                </CornerBrackets>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 flex">
          <Button asChild variant="primary" size="lg">
            <Link href="/work">All work →</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}

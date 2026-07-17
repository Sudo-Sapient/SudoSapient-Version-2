"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/blueprint/SectionHeading";
import { TechLabel } from "@/components/blueprint/TechLabel";
import { SystemDiagram } from "@/components/blueprint/SystemDiagram";
import { Button } from "@/components/ui/Button";
import { projects } from "@/lib/projects";
import { withBasePath } from "@/lib/site";
import { WorkSiteCrew } from "@/components/scenes/WorkSiteCrew";

type DiagramSpec = Pick<React.ComponentProps<typeof SystemDiagram>, "title" | "nodes" | "edges">;

const projectDiagrams: Record<string, DiagramSpec> = {
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
      { from: "engine", to: "deals" },
      { from: "engine", to: "camp" },
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
      { from: "script", to: "render" },
      { from: "style", to: "render" },
      { from: "render", to: "voice" },
      { from: "render", to: "post" },
      { from: "voice", to: "reel" },
      { from: "post", to: "reel" },
    ],
  },
};

export function SelectedWork() {
  const featured = projects.find((project) => project.featured) ?? projects[0];
  const secondary = projects.filter((project) => project.slug !== featured.slug);

  return (
    <section className="bg-offwhite py-16 text-ink sm:py-24 md:py-32">
      <Container>
        <SectionHeading
          tone="dark"
          index="02"
          eyebrow="SELECTED WORK"
          title="Working systems, not concept decks."
          description="A closer look at what we shipped, how it works, and what changed after launch."
        />

        <motion.article
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55 }}
          className="mt-12 grid overflow-hidden border border-ink/20 bg-white sm:mt-16 lg:grid-cols-12"
        >
          <Link
            href={`/work/${featured.slug}`}
            className="group relative min-h-[300px] overflow-hidden bg-ink lg:col-span-7 lg:min-h-[560px]"
            aria-label={`Read the ${featured.client} case study`}
          >
            {featured.image ? (
              <Image
                src={withBasePath(featured.image)}
                alt={`${featured.client} — ${featured.title}`}
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-transparent to-transparent" />
            <WorkSiteCrew variant="featured" label={featured.client} />
            <span className="absolute right-5 top-5 border border-white/50 bg-ink/30 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white backdrop-blur-sm">
              Open case study →
            </span>
          </Link>

          <div className="flex flex-col justify-between gap-10 p-7 sm:p-10 lg:col-span-5 lg:p-12">
            <div>
              <div className="flex items-center justify-between gap-4">
                <TechLabel tone="dark">FEATURED · {featured.discipline}</TechLabel>
                <TechLabel tone="dark">{featured.year}</TechLabel>
              </div>
              <h3 className="mt-8 text-balance font-display text-3xl font-extrabold leading-[1] tracking-tight-3 sm:text-4xl">
                {featured.title}
              </h3>
              <p className="mt-5 text-base leading-relaxed text-ink/70">{featured.oneLiner}</p>
            </div>

            <div>
              <div className="grid grid-cols-2 gap-5 border-y border-ink/15 py-5">
                {featured.metrics.slice(0, 2).map((metric) => (
                  <div key={metric.label}>
                    <TechLabel tone="dark">{metric.label}</TechLabel>
                    <p className="mt-1 font-display text-xl font-bold tracking-tight-2">
                      {metric.value}
                    </p>
                  </div>
                ))}
              </div>
              <Button asChild variant="secondary" size="lg" className="mt-7">
                <Link href={`/work/${featured.slug}`}>Read {featured.client} →</Link>
              </Button>
            </div>
          </div>
        </motion.article>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {secondary.map((project, index) => {
            const diagram = projectDiagrams[project.slug];
            return (
              <motion.article
                key={project.slug}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group border border-ink/20 bg-white"
              >
                <Link href={`/work/${project.slug}`} className="block">
                  <div className="relative aspect-[16/9] overflow-hidden border-b border-ink/15 bg-[#eef1f5]">
                    {project.image ? (
                      <Image
                        src={withBasePath(project.image)}
                        alt={`${project.client} — ${project.title}`}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                      />
                    ) : diagram ? (
                      <div className="h-full w-full p-5 sm:p-8">
                        <SystemDiagram {...diagram} tone="dark" viewBoxW={400} viewBoxH={240} />
                      </div>
                    ) : null}
                    <WorkSiteCrew label={project.client} />
                  </div>
                  <div className="p-7 sm:p-8">
                    <div className="flex items-center justify-between gap-4">
                      <TechLabel tone="dark">{project.discipline}</TechLabel>
                      <TechLabel tone="dark">{project.year}</TechLabel>
                    </div>
                    <h3 className="mt-5 font-display text-2xl font-bold leading-tight tracking-tight-2">
                      {project.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink/70">{project.oneLiner}</p>
                    <span className="mt-6 inline-block font-mono text-[11px] uppercase tracking-[0.16em] text-ink transition-transform duration-300 group-hover:translate-x-1">
                      Read case study →
                    </span>
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-10 flex justify-end">
          <Button asChild variant="secondary" size="lg">
            <Link href="/work">View all work →</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}

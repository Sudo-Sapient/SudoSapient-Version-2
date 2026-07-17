"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TechLabel } from "@/components/blueprint/TechLabel";
import type { Project } from "@/lib/projects";
import { withBasePath } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export function WorkGrid({ projects }: { projects: Project[] }) {
  const root = React.useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.from(".work-card", {
        y: 36,
        autoAlpha: 0,
        duration: 0.65,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: root.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="space-y-6">
      {projects.map((project, index) => (
        <Link
          key={project.slug}
          href={`/work/${project.slug}`}
          className="work-card group grid overflow-hidden border border-ink/20 bg-white transition-colors hover:border-blueprint md:grid-cols-12"
        >
          <div className="relative min-h-[250px] overflow-hidden border-b border-ink/15 bg-[#eef1f5] md:col-span-5 md:min-h-[330px] md:border-b-0 md:border-r">
            {project.image ? (
              <Image
                src={withBasePath(project.image)}
                alt={`${project.client} — ${project.title}`}
                fill
                sizes="(min-width: 768px) 42vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.025]"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center p-10">
                <div className="grid h-full w-full grid-cols-4 grid-rows-3 gap-2 border border-ink/20 p-3 opacity-70">
                  <div className="col-span-4 border border-ink/20" />
                  <div className="col-span-2 row-span-2 border border-ink/20" />
                  <div className="col-span-2 border border-ink/20" />
                  <div className="col-span-2 border border-ink/20" />
                </div>
              </div>
            )}
            <span className="absolute left-4 top-4 border border-white/40 bg-ink/60 px-2 py-1 font-mono text-[10px] tracking-[0.14em] text-white backdrop-blur-sm">
              0{index + 1}
            </span>
          </div>

          <div className="flex flex-col p-7 sm:p-9 md:col-span-7 md:p-10">
            <div className="flex items-center justify-between gap-4">
              <TechLabel tone="dark">{project.discipline}</TechLabel>
              <TechLabel tone="dark">{project.year}</TechLabel>
            </div>
            <h2 className="mt-7 max-w-3xl text-balance font-display text-3xl font-extrabold leading-[1] tracking-tight-3 sm:text-4xl">
              {project.title}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink/70">
              {project.oneLiner}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-5 border-y border-ink/15 py-5 sm:grid-cols-3">
              {project.metrics.map((metric) => (
                <div key={metric.label} className="last:hidden sm:last:block">
                  <TechLabel tone="dark">{metric.label}</TechLabel>
                  <p className="mt-1 text-sm font-semibold text-ink">{metric.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-auto flex items-end justify-between gap-4 pt-8">
              <div>
                <TechLabel tone="dark">CLIENT</TechLabel>
                <p className="mt-1 font-display text-lg font-bold">{project.client}</p>
              </div>
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink transition-transform duration-300 group-hover:translate-x-1">
                Read case study →
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

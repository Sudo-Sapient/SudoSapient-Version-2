import type { CSSProperties } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { GridBackground } from "@/components/blueprint/GridBackground";
import { SectionHeading } from "@/components/blueprint/SectionHeading";
import { TechLabel } from "@/components/blueprint/TechLabel";
import { CornerBrackets } from "@/components/blueprint/CornerBrackets";
import { ModuleStack } from "@/components/blueprint/ModuleStack";
import { Pipeline } from "@/components/blueprint/Pipeline";
import { SystemDiagram } from "@/components/blueprint/SystemDiagram";
import { Button } from "@/components/ui/Button";
import {
  FigureCarrying,
  FigurePushing,
  FigurePointing,
  FigureClimbing,
  FigureStanding,
  FigureSitting,
  BreathingFigure,
} from "@/components/figures";

export const metadata = {
  title: "Services — Sudo Sapient",
  description:
    "AI product development, AI automation, and AI media. Three disciplines, one studio — shipped to real users in 6–10 weeks.",
};

const services = [
  {
    index: "01",
    code: "SVC.PROD",
    title: "AI Product Development",
    what:
      "We design and build customer-facing AI features and full AI products. Agents, copilots, generative UX, RAG over your own data — all wired to the rest of your stack.",
    who:
      "Founders shipping AI as a product. Product teams adding their first real AI surface. Companies with private data that needs to talk back.",
    use: [
      "An in-product agent that ingests your docs and writes targeted help on the fly.",
      "A copilot that drafts the parts of your workflow that everyone hates writing.",
      "A retrieval system that answers from your private data with citations.",
    ],
    outcome: "A working AI feature in your product, shipped to real users in 6–10 weeks.",
  },
  {
    index: "02",
    code: "SVC.AUTO",
    title: "AI Automation",
    what:
      "Workflows that used to need humans. We build typed pipelines: deterministic where it matters, LLM-routed where it pays. Audit trails by default.",
    who:
      "Ops, support, and back-office teams drowning in copy-paste. Founders who want to keep headcount flat as volume grows.",
    use: [
      "Inbound email triaged, summarised, and routed into your CRM with the right tags.",
      "Vendor invoices read, reconciled, and posted to your ledger without a human in the routine path.",
      "Contracts and docs parsed, classified, and shipped to the right person with a one-line summary.",
    ],
    outcome: "An automation that runs every day with a dashboard you can trust.",
  },
  {
    index: "03",
    code: "SVC.MEDIA",
    title: "AI Media",
    what:
      "Pipelines that produce on a cadence. Short films from raw audio. Editorial systems that draft, edit, and ship. Image and motion at scale, with a human in the loop only where it matters.",
    who:
      "Founders and operators who want to publish but won't. Media companies trying to do five times the volume without five times the team.",
    use: [
      "A weekly show generated from a founder's sales calls, with one approval step.",
      "Podcast → multichannel: clips, essays, and posts produced from a single recording.",
      "An editorial pipeline that briefs, drafts, edits, and ships pieces against a calendar.",
    ],
    outcome: "A media engine that ships every week with under two hours of your time.",
  },
] as const;

export default function ServicesPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-blueprint py-16 text-white sm:py-24 md:py-28">
        <GridBackground />
        <Container className="relative z-10">
          <SectionHeading
            as="h1"
            index="S"
            eyebrow="SERVICES"
            title="What you can hire us to build."
            description="Three disciplines, three blueprints. Same studio, same cadence."
          />
        </Container>
      </section>

      <ServiceBlock svc={services[0]} flip={false}>
        <div className="relative">
          <CornerBrackets tone="light" className="px-6 py-8 sm:px-10 sm:py-10">
            <ModuleStack
              tone="light"
              showDimensions
              modules={[
                { code: "S.01", label: "INTERFACE", meta: "ui · ux · chat" },
                { code: "S.02", label: "PLANNER", meta: "tools · eval" },
                { code: "S.03", label: "RETRIEVAL", meta: "your data" },
              ]}
            />
          </CornerBrackets>
          {/* Figures interacting with the stack */}
          <div
            className="fig-rise pointer-events-none absolute left-[-2%] bottom-[6%] text-white"
            style={{ width: "10%", minWidth: 56, "--rise": "10px", "--rise-dur": "3s", animationDelay: "-0.5s" } as CSSProperties}
          >
            <BreathingFigure index={0} className="block w-full">
              <FigureCarrying className="w-full" />
            </BreathingFigure>
          </div>
          <div
            className="fig-rise pointer-events-none absolute right-[4%] top-[20%] text-white"
            style={{ width: "8%", minWidth: 48, "--rise": "36px", "--rise-dur": "5.2s", animationDelay: "-0.3s" } as CSSProperties}
          >
            <BreathingFigure index={1} className="block w-full">
              <FigureClimbing className="w-full" />
            </BreathingFigure>
          </div>
          <div
            className="fig-rise pointer-events-none absolute right-[-2%] bottom-[-2%] text-white"
            style={{ width: "10%", minWidth: 56, "--rise": "8px", "--rise-dur": "3.4s", animationDelay: "-1.5s" } as CSSProperties}
          >
            <BreathingFigure index={2} className="block w-full">
              <FigureSitting className="w-full" />
            </BreathingFigure>
          </div>
        </div>
      </ServiceBlock>

      <ServiceBlock svc={services[1]} flip>
        <div className="relative">
          <CornerBrackets tone="light" className="px-6 py-12 sm:px-10 sm:py-14">
            <Pipeline
              tone="light"
              segmentLabels={["1.0x", "1.5x", "1.0x"]}
              nodes={[
                { code: "A.01", label: "EMAIL", caption: "input" },
                { code: "A.02", label: "RULE", caption: "deterministic" },
                { code: "A.03", label: "LLM", caption: "judgement" },
                { code: "A.04", label: "ROUTE", caption: "output" },
              ]}
            />
          </CornerBrackets>
          <div
            className="fig-rise pointer-events-none absolute left-[3%] bottom-[-4%] text-white"
            style={{ width: "9%", minWidth: 56, "--rise": "11px", "--rise-dur": "2.8s", animationDelay: "-0.9s" } as CSSProperties}
          >
            <BreathingFigure index={0} className="block w-full">
              <FigurePushing className="w-full" />
            </BreathingFigure>
          </div>
          <div
            className="fig-rise pointer-events-none absolute right-[8%] bottom-[-4%] text-white"
            style={{ width: "8%", minWidth: 52, "--rise": "9px", "--rise-dur": "3.2s", animationDelay: "-1.8s" } as CSSProperties}
          >
            <BreathingFigure index={1} className="block w-full">
              <FigurePointing className="w-full" />
            </BreathingFigure>
          </div>
        </div>
      </ServiceBlock>

      <ServiceBlock svc={services[2]} flip={false}>
        <div className="relative">
          <CornerBrackets tone="light" className="px-6 py-8 sm:px-10 sm:py-10">
            <SystemDiagram
              tone="light"
              viewBoxW={600}
              viewBoxH={260}
              title="FIG. SVC.MEDIA · PIPELINE"
              nodes={[
                { id: "calls", x: 10, y: 50, label: "CALLS" },
                { id: "diar", x: 28, y: 50, label: "DIARIZE" },
                { id: "edit", x: 50, y: 50, label: "EDIT + GEN" },
                { id: "film", x: 84, y: 22, label: "FILM" },
                { id: "clips", x: 84, y: 50, label: "CLIPS" },
                { id: "essay", x: 84, y: 78, label: "ESSAY" },
              ]}
              edges={[
                { from: "calls", to: "diar" },
                { from: "diar", to: "edit" },
                { from: "edit", to: "film" },
                { from: "edit", to: "clips" },
                { from: "edit", to: "essay" },
              ]}
            />
          </CornerBrackets>
          <div
            className="fig-rise pointer-events-none absolute right-[2%] bottom-[-4%] text-white"
            style={{ width: "10%", minWidth: 60, "--rise": "9px", "--rise-dur": "3.6s", animationDelay: "-0.6s" } as CSSProperties}
          >
            <BreathingFigure index={0} className="block w-full">
              <FigureStanding className="w-full" />
            </BreathingFigure>
          </div>
          <div
            className="fig-rise pointer-events-none absolute left-[6%] bottom-[-4%] text-white"
            style={{ width: "10%", minWidth: 60, "--rise": "10px", "--rise-dur": "3s", animationDelay: "-2.1s" } as CSSProperties}
          >
            <BreathingFigure index={1} className="block w-full">
              <FigurePointing className="w-full" />
            </BreathingFigure>
          </div>
        </div>
      </ServiceBlock>
    </>
  );
}

function ServiceBlock({
  svc,
  flip,
  children,
}: {
  svc: (typeof services)[number];
  flip: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`relative overflow-hidden py-16 sm:py-24 md:py-28 ${
        flip ? "bg-blueprint-deep" : "bg-blueprint"
      } text-white`}
    >
      <GridBackground variant={flip ? "deep" : "blue"} />
      <Container className="relative z-10 flex flex-col gap-10 sm:gap-12 md:gap-16">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <TechLabel>{svc.code}</TechLabel>
            <TechLabel>SECTION_{svc.index}</TechLabel>
          </div>
          <h2 className="max-w-3xl font-display text-3xl font-extrabold leading-[0.95] tracking-tight-2 sm:text-4xl md:text-5xl lg:text-6xl">
            {svc.title}
          </h2>
        </div>

        {children}

        <div className="grid gap-8 sm:grid-cols-2 sm:gap-10 md:grid-cols-3">
          <div className="flex flex-col gap-3">
            <TechLabel>{"// WHAT IT IS"}</TechLabel>
            <p className="text-base leading-relaxed text-white/85">{svc.what}</p>
          </div>
          <div className="flex flex-col gap-3">
            <TechLabel>{"// WHO IT'S FOR"}</TechLabel>
            <p className="text-base leading-relaxed text-white/85">{svc.who}</p>
          </div>
          <div className="flex flex-col gap-3">
            <TechLabel>{"// OUTCOME"}</TechLabel>
            <p className="text-base leading-relaxed text-white/85">{svc.outcome}</p>
          </div>
        </div>

        <div className="grid gap-4 border-t border-white/20 pt-6 sm:grid-cols-2 sm:gap-6 sm:pt-8 md:grid-cols-3">
          {svc.use.map((u, i) => (
            <div key={i} className="flex gap-3">
              <TechLabel>USE.{String(i + 1).padStart(2, "0")}</TechLabel>
              <p className="text-sm text-white/85">{u}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <Button asChild variant="solid" size="lg">
            <Link href="/contact">Start a Project</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}

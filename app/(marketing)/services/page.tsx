import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { GridBackground } from "@/components/blueprint/GridBackground";
import { SectionHeading } from "@/components/blueprint/SectionHeading";
import { TechLabel } from "@/components/blueprint/TechLabel";
import { ModuleStack } from "@/components/blueprint/ModuleStack";
import { Pipeline } from "@/components/blueprint/Pipeline";
import { MediaPipelineScene } from "@/components/scenes/MediaPipelineScene";
import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "Services — Sudo Sapient",
  description:
    "AI product development, operational automation, and AI media systems delivered by a senior studio in focused 6–10 week builds.",
};

const services = [
  {
    index: "01",
    code: "AI PRODUCT DEVELOPMENT",
    problem:
      "You have a valuable AI use case, but not the team to turn it into a product people can trust.",
    title: "Ship the AI feature—not another prototype.",
    summary:
      "We take one high-value workflow from product definition through production. The result is a usable AI surface connected to your data, tools, and existing product.",
    timeline: "6–10 weeks",
    scope: "One production-ready product slice",
    deliverables: [
      "Product and interaction design",
      "Model, retrieval, and tool architecture",
      "Evaluation and guardrail suite",
      "Production application and integrations",
      "Telemetry, documentation, and handoff",
    ],
    examples: ["In-product agents", "Copilots", "Private-data retrieval", "Generative workflows"],
    proof: {
      client: "Jgsaw",
      text: "A multi-tenant AI-native GTM control centre with 11 coupled intelligence and execution modules.",
      href: "/work/jgsaw",
    },
  },
  {
    index: "02",
    code: "AI AUTOMATION",
    problem:
      "Your team is spending expensive human time copying, classifying, checking, and routing routine work.",
    title: "Remove repetitive work without creating an AI black box.",
    summary:
      "We build auditable operational systems: deterministic rules where correctness matters, model judgement where it adds value, and a clear human review path.",
    timeline: "6–8 weeks",
    scope: "One end-to-end operational workflow",
    deliverables: [
      "Workflow and exception mapping",
      "Typed automation pipeline",
      "Internal tool and approval controls",
      "Audit trail, alerts, and dashboards",
      "Runbook and owner training",
    ],
    examples: [
      "Email and ticket routing",
      "Document processing",
      "CRM operations",
      "Back-office workflows",
    ],
    proof: {
      client: "Typical engagement",
      text: "Best when a stable, repeated workflow consumes 20+ team hours every week.",
      href: "/contact",
    },
  },
  {
    index: "03",
    code: "AI MEDIA SYSTEMS",
    problem:
      "You need a consistent publishing cadence, but production is too slow, fragmented, or dependent on one person.",
    title: "Turn source material into a repeatable publishing engine.",
    summary:
      "We design the production line around your voice and approval standards—from source ingestion and scripting to generation, review, and channel-ready output.",
    timeline: "4–8 weeks",
    scope: "One repeatable content pipeline",
    deliverables: [
      "Editorial workflow and style system",
      "Script and generation pipeline",
      "Human review and approval surface",
      "Channel-specific output automation",
      "Prompts, documentation, and handoff",
    ],
    examples: [
      "Podcast repurposing",
      "Short-form video",
      "Editorial systems",
      "Image and motion pipelines",
    ],
    proof: {
      client: "SudoSapient media engine",
      text: "A voice-note-to-Reel production line with one human approval step.",
      href: "/work/be-pawsh",
    },
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
            title="Three ways to put AI into production."
            description="Focused builds for teams with a real workflow, a clear owner, and urgency to ship."
          />
          <div className="mt-12 grid gap-px border border-white/20 bg-white/20 md:grid-cols-3">
            {services.map((service) => (
              <a
                key={service.index}
                href={`#service-${service.index}`}
                className="group bg-blueprint p-5 transition-colors hover:bg-blueprint-deep"
              >
                <TechLabel>{service.index}</TechLabel>
                <p className="mt-3 font-display text-xl font-bold tracking-tight-2">
                  {service.code}
                </p>
                <p className="mt-2 text-sm text-white/60">
                  {service.timeline} · {service.scope}
                </p>
              </a>
            ))}
          </div>
        </Container>
      </section>

      <ProductService service={services[0]} />
      <AutomationService service={services[1]} />
      <MediaService service={services[2]} />

      <section className="bg-offwhite py-16 sm:py-24 md:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <TechLabel tone="dark">ENGAGEMENT FIT</TechLabel>
              <h2 className="mt-5 text-balance font-display text-4xl font-extrabold leading-[0.95] tracking-tight-3 sm:text-5xl">
                The right conditions produce better systems.
              </h2>
            </div>
            <div className="grid gap-px bg-ink/15 sm:grid-cols-2 lg:col-span-7">
              <FitPanel
                title="Good fit"
                items={[
                  "A named business or user problem",
                  "An internal owner who can make decisions",
                  "Access to representative data and users",
                  "A useful first release that fits inside 10 weeks",
                ]}
              />
              <FitPanel
                title="Not a good fit"
                items={[
                  "Open-ended staff augmentation",
                  "A vague mandate to ‘add AI’ everywhere",
                  "Research with no route to production",
                  "Projects with no owner, data access, or launch path",
                ]}
              />
            </div>
          </div>
          <div className="mt-12 flex flex-col items-start justify-between gap-6 border-t border-ink/20 pt-8 sm:flex-row sm:items-center">
            <p className="max-w-2xl text-lg text-ink/70">
              If the scope is still unclear, that is fine. Send us the workflow and the outcome you
              need; we will tell you whether there is a focused first build.
            </p>
            <Button asChild variant="secondary" size="lg">
              <Link href="/contact">Discuss the scope →</Link>
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}

type Service = (typeof services)[number];

function ServiceIntro({ service }: { service: Service }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <TechLabel tone="dark">SERVICE_{service.index}</TechLabel>
        <TechLabel tone="dark">{service.timeline}</TechLabel>
      </div>
      <p className="mt-7 max-w-2xl text-lg font-medium leading-relaxed text-blueprint">
        {service.problem}
      </p>
      <h2 className="mt-4 max-w-4xl text-balance font-display text-4xl font-extrabold leading-[0.95] tracking-tight-3 sm:text-5xl md:text-6xl">
        {service.title}
      </h2>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/70">{service.summary}</p>
    </div>
  );
}

function ProductService({ service }: { service: Service }) {
  return (
    <section
      id={`service-${service.index}`}
      className="scroll-mt-16 bg-offwhite py-16 sm:py-24 md:py-28"
    >
      <Container>
        <ServiceIntro service={service} />
        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          <div className="border border-ink/20 bg-[#eef1f5] p-6 sm:p-10 lg:col-span-7">
            <ModuleStack
              tone="dark"
              showDimensions
              modules={[
                { code: "P.01", label: "INTERFACE", meta: "user workflow" },
                { code: "P.02", label: "INTELLIGENCE", meta: "model · tools · evals" },
                { code: "P.03", label: "DATA", meta: "retrieval · systems" },
              ]}
            />
          </div>
          <ServiceDetails service={service} className="lg:col-span-5" />
        </div>
      </Container>
    </section>
  );
}

function AutomationService({ service }: { service: Service }) {
  return (
    <section
      id={`service-${service.index}`}
      className="scroll-mt-16 bg-[#eef1f5] py-16 sm:py-24 md:py-28"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-6">
            <ServiceIntro service={service} />
          </div>
          <div className="border border-ink/20 bg-offwhite p-6 sm:p-10 lg:col-span-6">
            <Pipeline
              tone="dark"
              nodes={[
                { code: "A.01", label: "INPUT", caption: "source" },
                { code: "A.02", label: "RULE", caption: "deterministic" },
                { code: "A.03", label: "MODEL", caption: "judgement" },
                { code: "A.04", label: "REVIEW", caption: "audit" },
              ]}
            />
          </div>
        </div>
        <ServiceDetails
          service={service}
          className="mt-10 grid gap-8 border-t border-ink/20 pt-8 lg:grid-cols-2"
          horizontal
        />
      </Container>
    </section>
  );
}

function MediaService({ service }: { service: Service }) {
  return (
    <section
      id={`service-${service.index}`}
      className="scroll-mt-16 bg-offwhite py-16 sm:py-24 md:py-28"
    >
      <Container>
        <ServiceIntro service={service} />
        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          <ServiceDetails service={service} className="lg:order-1 lg:col-span-5" />
          <div className="border border-white/15 bg-[#061225] p-2 sm:p-3 lg:order-2 lg:col-span-7">
            <div className="aspect-[720/340] w-full">
              <MediaPipelineScene className="h-full w-full" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function ServiceDetails({
  service,
  className,
  horizontal = false,
}: {
  service: Service;
  className?: string;
  horizontal?: boolean;
}) {
  return (
    <div className={className}>
      <div>
        <TechLabel tone="dark">DELIVERABLES</TechLabel>
        <ul className="mt-4 divide-y divide-ink/15 border-y border-ink/15">
          {service.deliverables.map((item, index) => (
            <li key={item} className="flex gap-4 py-3 text-sm text-ink/75">
              <span className="font-mono text-[10px] text-blueprint">
                {String(index + 1).padStart(2, "0")}
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className={horizontal ? "" : "mt-8"}>
        <div className="grid grid-cols-2 gap-4 border-b border-ink/15 pb-5">
          <div>
            <TechLabel tone="dark">TIMELINE</TechLabel>
            <p className="mt-1 font-display text-xl font-bold">{service.timeline}</p>
          </div>
          <div>
            <TechLabel tone="dark">SCOPE</TechLabel>
            <p className="mt-1 text-sm font-medium leading-snug">{service.scope}</p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {service.examples.map((item) => (
            <span
              key={item}
              className="border border-ink/20 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-ink/70"
            >
              {item}
            </span>
          ))}
        </div>
        <Link
          href={service.proof.href}
          className="mt-6 block border-l-2 border-blueprint pl-4 transition-colors hover:border-warn"
        >
          <TechLabel tone="dark">PROOF · {service.proof.client}</TechLabel>
          <p className="mt-2 text-sm leading-relaxed text-ink/70">
            {service.proof.text} <span className="font-medium text-ink">View →</span>
          </p>
        </Link>
      </div>
    </div>
  );
}

function FitPanel({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-offwhite p-6 sm:p-8">
      <h3 className="font-display text-2xl font-bold tracking-tight-2">{title}</h3>
      <ul className="mt-5 space-y-4">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink/70">
            <span className="mt-2 h-1.5 w-1.5 flex-none bg-blueprint" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

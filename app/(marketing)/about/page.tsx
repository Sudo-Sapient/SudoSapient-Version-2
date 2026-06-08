import { Container } from "@/components/layout/Container";
import { GridBackground } from "@/components/blueprint/GridBackground";
import { SectionHeading } from "@/components/blueprint/SectionHeading";
import { TechLabel } from "@/components/blueprint/TechLabel";
import {
  FigureMeasuring,
  FigureClimbing,
  FigureSitting,
  FigurePointing,
} from "@/components/figures";

export const metadata = { title: "About — Sudo Sapient" };

const differentiators = [
  {
    n: "01",
    title: "We ship, not propose.",
    body: "You'll have something working in two weeks. Slide decks are for after.",
    Figure: FigureClimbing,
  },
  {
    n: "02",
    title: "AI where it earns its keep.",
    body: "If a rule works, we write a rule. The model handles the parts that need judgement.",
    Figure: FigureMeasuring,
  },
  {
    n: "03",
    title: "You own what we build.",
    body: "Code, weights, prompts, evals, dashboards. Hand-off is a deliverable, not a hope.",
    Figure: FigurePointing,
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-blueprint py-24 text-white sm:py-28">
        <GridBackground />
        <Container className="relative z-10">
          <SectionHeading
            index="A"
            eyebrow="ABOUT"
            title="A studio for shipping AI."
          />
          <div className="mt-12 grid max-w-4xl gap-6 text-lg leading-relaxed text-white/85">
            <p>
              Sudo Sapient is a small AI studio. We&rsquo;re a team of engineers,
              designers, and operators who&rsquo;d rather build a working system in
              six weeks than write a six-month plan.
            </p>
            <p>
              We work with founders and product teams who want AI to be more than
              a feature flag — who want it to ship in their product, run their
              operations, and produce their media.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-offwhite py-24">
        <Container>
          <SectionHeading
            tone="dark"
            index="A.01"
            eyebrow="HOW WE WORK"
            title="A studio, not a staffing shop."
            description="Small projects with senior people, billed for the system, not the hour."
          />

          <div className="mt-12 grid gap-px border border-ink/15 bg-ink/15 md:grid-cols-3">
            <Card
              code="W.01"
              title="Senior people only"
              body="No layered teams. The people on your calls are the people writing the code."
              Figure={FigureSitting}
            />
            <Card
              code="W.02"
              title="Fixed-scope sprints"
              body="6–10 weeks per build. We carve scope hard so the deadline is real."
              Figure={FigureMeasuring}
            />
            <Card
              code="W.03"
              title="Studio handoff"
              body="Code, evals, dashboards, runbook. You can run it without us by week 10."
              Figure={FigureClimbing}
            />
          </div>
        </Container>
      </section>

      <section className="bg-offwhite pb-24">
        <Container>
          <SectionHeading
            tone="dark"
            index="A.02"
            eyebrow="WHAT MAKES US DIFFERENT"
            title="Three opinions, held strongly."
          />
          <div className="mt-12 grid gap-12 md:grid-cols-3">
            {differentiators.map((d) => (
              <div key={d.n} className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <TechLabel tone="dark">{d.n}</TechLabel>
                  <div className="text-ink">
                    <d.Figure size={60} />
                  </div>
                </div>
                <div className="h-px w-full bg-ink/30" />
                <h3 className="font-display text-2xl font-bold tracking-tight-2 text-ink">
                  {d.title}
                </h3>
                <p className="text-base leading-relaxed text-ink/75">{d.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

function Card({
  code,
  title,
  body,
  Figure,
}: {
  code: string;
  title: string;
  body: string;
  Figure: React.FC<{ size?: number; className?: string }>;
}) {
  return (
    <div className="flex flex-col gap-4 bg-offwhite p-8 sm:p-10">
      <div className="flex items-center justify-between">
        <TechLabel tone="dark">{code}</TechLabel>
        <div className="text-ink">
          <Figure size={64} />
        </div>
      </div>
      <h3 className="font-display text-2xl font-bold tracking-tight-2 text-ink">
        {title}
      </h3>
      <p className="text-base leading-relaxed text-ink/75">{body}</p>
    </div>
  );
}

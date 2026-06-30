import { Container } from "@/components/layout/Container";
import { GridBackground } from "@/components/blueprint/GridBackground";
import { SectionHeading } from "@/components/blueprint/SectionHeading";
import { TechLabel } from "@/components/blueprint/TechLabel";
import { TeamGrid } from "@/components/sections/TeamGrid";
import { AnimatedFigure } from "@/components/figures/AnimatedFigure";
import {
  FigureMeasuring,
  FigureClimbing,
  FigureSitting,
  FigurePointing,
} from "@/components/figures";

export const metadata = {
  title: "About — Sudo Sapient",
  description:
    "Sudo Sapient is a small AI studio that ships working AI products, automation, and media in weeks — senior people, fixed-scope sprints, full handoff.",
};

// bio + focus are placeholder copy — edit freely; they show on the card's flip side.
const team = [
  {
    name: "Sabari K",
    role: "Managing Director",
    img: "/team/sabari-k.jpg",
    bio: "Runs the studio end to end — from the first client call to the final shipped build.",
    focus: ["Strategy", "Delivery", "Clients"],
  },
  {
    name: "Siddharth Bhat",
    role: "Advisor",
    img: "/team/siddharth-bhat.jpg",
    bio: "Advises on product direction and the hard architecture calls.",
    focus: ["Product", "Architecture"],
  },
  {
    name: "Deepak Kumaran",
    role: "Senior Developer",
    img: "/team/deepak-kumaran.jpg",
    bio: "Builds the core systems — APIs, pipelines, and the AI that runs them.",
    focus: ["Backend", "AI", "Pipelines"],
  },
  {
    name: "Janith Reddy",
    role: "Senior Developer",
    img: "/team/janith-reddy.jpg",
    bio: "Turns designs into fast, reliable front-ends people actually enjoy using.",
    focus: ["Frontend", "UX", "Perf"],
  },
  {
    name: "Gokul Krishnan",
    role: "Operations Head",
    img: "/team/gokul-krishnan.jpg",
    bio: "Keeps projects on rails — scope, timelines, and the day-to-day.",
    focus: ["Ops", "Delivery", "Process"],
  },
];

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
      <section className="relative overflow-hidden bg-blueprint py-16 text-white sm:py-24 md:py-28">
        <GridBackground />
        <Container className="relative z-10">
          <SectionHeading
            as="h1"
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

      <section className="bg-offwhite py-16 md:py-24">
        <Container>
          <SectionHeading
            tone="dark"
            index="A.01"
            eyebrow="HOW WE WORK"
            title="A studio, not a staffing shop."
            description="Small projects with senior people, billed for the system, not the hour."
          />

          <div className="mt-12 grid gap-px border border-ink/15 bg-ink/15 sm:grid-cols-2 lg:grid-cols-3">
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

      <section className="bg-offwhite pb-16 md:pb-24">
        <Container>
          <SectionHeading
            tone="dark"
            index="A.02"
            eyebrow="WHAT MAKES US DIFFERENT"
            title="Three opinions, held strongly."
          />
          <div className="mt-12 grid gap-8 sm:grid-cols-2 sm:gap-12 lg:grid-cols-3">
            {differentiators.map((d) => (
              <div key={d.n} className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <TechLabel tone="dark">{d.n}</TechLabel>
                  <AnimatedFigure className="inline-block text-ink">
                    <d.Figure size={60} />
                  </AnimatedFigure>
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

      <section className="bg-blueprint py-16 text-white sm:py-24 md:py-28">
        <Container>
          <SectionHeading
            index="A.03"
            eyebrow="THE TEAM"
            title="The people who build it."
            description="Senior people only. The names below are the ones on your calls and the ones writing the code."
          />

          <TeamGrid members={team} />
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
    <div className="flex flex-col gap-4 bg-offwhite p-6 sm:p-8 md:p-10">
      <div className="flex items-center justify-between">
        <TechLabel tone="dark">{code}</TechLabel>
        <AnimatedFigure className="inline-block text-ink">
          <Figure size={64} />
        </AnimatedFigure>
      </div>
      <h3 className="font-display text-2xl font-bold tracking-tight-2 text-ink">
        {title}
      </h3>
      <p className="text-base leading-relaxed text-ink/75">{body}</p>
    </div>
  );
}

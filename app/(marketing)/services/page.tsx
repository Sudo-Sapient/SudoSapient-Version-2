import { Container } from "@/components/layout/Container";
import { GridBackground } from "@/components/blueprint/GridBackground";
import { TechLabel } from "@/components/blueprint/TechLabel";
import { RiveScene } from "@/components/motion/RiveScene";
import { STAGES } from "@/lib/site";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata = {
  title: "Services | Sudo Sapient",
  description:
    "We learn how your team really works, then build the AI agents and automations that make the work faster, easier and more profitable.",
};

const services = [
  {
    artboard: "Agent",
    title: "AI agents",
    line: "Software that does the work your team keeps doing by hand.",
    examples: [
      "Sorting and answering the inbox",
      "Chasing follow ups and updating the CRM",
      "Pulling data out of documents",
    ],
    change: "Hours of busywork a week go back to your team.",
    alt: "An amber stickman agent walks along carrying a parcel.",
  },
  {
    artboard: "Flow",
    title: "Workflow automation",
    line: "Your tools, finally talking to each other.",
    examples: [
      "Leads flowing straight into the CRM",
      "Invoices and reports that build themselves",
      "Approvals reaching the right person",
    ],
    change: "Fewer handoffs, fewer mistakes, faster turnaround.",
    alt: "Two stickmen pass a box from one to the other.",
  },
  {
    artboard: "Button",
    title: "AI in your software",
    line: "Smart features your customers will actually use.",
    examples: [
      "An assistant inside your app",
      "Search and answers over your own data",
      "Smart suggestions where people need them",
    ],
    change: "Software that does more for every customer.",
    alt: "A stickman presses a big amber button.",
  },
];

const fit = {
  good: [
    "You have a team doing the same work every day",
    "Someone owns the problem and can make calls",
    "You want a working system, not a strategy deck",
  ],
  bad: [
    "You want AI because everyone else has it",
    "Nobody has time to work with us for a few weeks",
    "You need a full in house dev team for years",
  ],
};

// Draft answers: review before launch.
const faqs = [
  {
    q: "Is our data safe?",
    a: "Your data stays in your accounts wherever we can manage it. We sign an NDA before the audit, only touch what the workflow needs, and never use it to train anything.",
  },
  {
    q: "Will this replace my team?",
    a: "No. We take away the repetitive parts so your people spend their time on the work that needs a person. Most teams get busier with better work, not smaller.",
  },
  {
    q: "Do we have to change our tools?",
    a: "Usually not. We build around what you already use, like your inbox, CRM, spreadsheets and internal apps, and only suggest something new when it clearly pays off.",
  },
  {
    q: "How fast will we see results?",
    a: "The audit takes about two weeks. The first pilot is live with your team around two weeks after that.",
  },
  {
    q: "Who owns what you build?",
    a: "You do. The code, the prompts and the accounts are yours, and we train your team to run it without us.",
  },
];

function Stickman({
  artboard,
  alt,
  className = "w-28",
}: {
  artboard: string;
  alt: string;
  className?: string;
}) {
  return (
    <RiveScene
      className={className}
      src="/rive/services.riv"
      artboard={artboard}
      animation="loop"
      frameClassName="aspect-[140/110] w-full"
      ariaLabel={alt}
      fallback={null}
    />
  );
}

export default function ServicesPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-blueprint py-16 text-white sm:py-24 md:py-28">
        <GridBackground />
        <Container className="relative z-10 grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-9">
            <TechLabel>Services</TechLabel>
            <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-[1.02] tracking-[-0.02em] sm:text-7xl">
              What we do inside your company.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
              We sit with your team, learn how the work really gets done, and build the AI agents
              and automations that make it faster, easier and more profitable.
            </p>
          </div>
          <div className="hidden justify-end lg:col-span-3 lg:flex">
            <Stickman
              artboard="Hello"
              alt="Our developer waves hello."
              className="w-48 rounded-sm bg-[#eef1f5]"
            />
          </div>
        </Container>
      </section>

      <section className="bg-offwhite py-16 text-ink sm:py-24">
        <Container>
          <TechLabel tone="dark">What we build</TechLabel>
          <h2 className="mt-4 max-w-2xl font-serif text-[2.6rem] leading-[1.04] tracking-[-0.02em] sm:text-6xl">
            Three ways we take work off your plate.
          </h2>
          <div className="mt-12 grid gap-px border border-ink/15 bg-ink/15 md:grid-cols-3">
            {services.map((s) => (
              <article key={s.title} className="flex flex-col bg-offwhite p-6 sm:p-8">
                <div className="bg-[#eef1f5]">
                  <Stickman artboard={s.artboard} alt={s.alt} className="mx-auto w-44" />
                </div>
                <h3 className="mt-6 font-display text-2xl font-bold tracking-tight-2">{s.title}</h3>
                <p className="mt-2 text-ink/70">{s.line}</p>
                <ul className="mt-5 space-y-3 border-t border-ink/15 pt-5">
                  {s.examples.map((e) => (
                    <li key={e} className="flex gap-3 text-sm leading-relaxed text-ink/75">
                      <span className="mt-2 h-1.5 w-1.5 flex-none bg-blueprint" />
                      {e}
                    </li>
                  ))}
                </ul>
                <p className="mt-auto pt-6 text-sm font-medium text-blueprint">{s.change}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-[#eef1f5] py-16 text-ink sm:py-24">
        <Container>
          <TechLabel tone="dark">How it runs</TechLabel>
          <h2 className="mt-4 max-w-2xl font-serif text-[2.6rem] leading-[1.04] tracking-[-0.02em] sm:text-6xl">
            Small steps, each one proven.
          </h2>
          <ol className="mt-12 grid gap-px border border-ink/15 bg-ink/15 sm:grid-cols-2 lg:grid-cols-4">
            {STAGES.map((s) => (
              <li key={s.n} className="bg-[#eef1f5] p-6 sm:p-8">
                <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.14em] text-ink/50">
                  <span>{s.n}</span>
                  <span>{s.time}</span>
                </div>
                <h3 className="mt-4 font-display text-2xl font-bold tracking-tight-2">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{s.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-offwhite py-16 text-ink sm:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <TechLabel tone="dark">Is this you?</TechLabel>
              <h2 className="mt-4 font-serif text-[2.6rem] leading-[1.04] tracking-[-0.02em] sm:text-6xl">
                We work best with teams like this.
              </h2>
            </div>
            <div className="grid gap-px bg-ink/15 sm:grid-cols-2 lg:col-span-7">
              <FitPanel title="Good fit" items={fit.good} />
              <FitPanel title="Not a good fit" items={fit.bad} muted />
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-[#eef1f5] py-16 text-ink sm:py-24">
        <Container className="grid items-center gap-10 lg:grid-cols-12">
          <div className="flex justify-center lg:col-span-4">
            <Stickman
              artboard="Audit"
              alt="A stickman with glasses inspects a document through a magnifying glass."
              className="w-56"
            />
          </div>
          <div className="lg:col-span-8">
            <TechLabel tone="dark">How to start</TechLabel>
            <h2 className="mt-4 max-w-2xl font-serif text-[2.6rem] leading-[1.04] tracking-[-0.02em] sm:text-6xl">
              Start with a two week audit.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/70">
              We spend two weeks with the people who do the work. You get a map of where the time
              goes, the first fixes worth building, and what each one would save. If AI isn&rsquo;t
              the answer somewhere, we&rsquo;ll tell you.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-offwhite py-16 text-ink sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <TechLabel tone="dark">Questions</TechLabel>
            <h2 className="mt-4 font-serif text-[2.6rem] leading-[1.04] tracking-[-0.02em] sm:text-6xl">
              What people ask us.
            </h2>
          </div>
          <div className="divide-y divide-ink/15 border-y border-ink/15 lg:col-span-8">
            {faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-lg font-bold">
                  {f.q}
                  <span
                    aria-hidden
                    className="text-2xl font-normal text-blueprint transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl leading-relaxed text-ink/70">{f.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      <FinalCTA />
    </>
  );
}

function FitPanel({
  title,
  items,
  muted = false,
}: {
  title: string;
  items: string[];
  muted?: boolean;
}) {
  return (
    <div className="bg-offwhite p-6 sm:p-8">
      <h3 className="font-display text-2xl font-bold tracking-tight-2">{title}</h3>
      <ul className="mt-5 space-y-4">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink/70">
            <span
              className={`mt-2 h-1.5 w-1.5 flex-none ${muted ? "bg-ink/30" : "bg-blueprint"}`}
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

import { breadcrumbSchema, pageMetadata, teamSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/layout/Container";
import { GridBackground } from "@/components/blueprint/GridBackground";
import { TechLabel } from "@/components/blueprint/TechLabel";
import { RiveScene } from "@/components/motion/RiveScene";
import { TeamElevator, type Floor } from "@/components/sections/TeamElevator";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata = pageMetadata({
  title: "About Sudo Sapient | AI Transformation Team in Bangalore",
  description:
    "Meet the Sudo Sapient team in Bangalore: engineers and operators who sit with your people across India and Dubai, and automate the busywork with AI.",
  path: "/about/",
});

// gagMs mirror the `caught` lengths in scripts/rive/cabs.mjs.
const team: Floor[] = [
  {
    name: "Sabari K",
    role: "Managing Director",
    img: "/team/sabari-k.jpg",
    artboard: "Sabari",
    gagMs: 1200,
    caught: "Caught coding on three laptops. As usual.",
    bio: "Runs the studio, from the first call with you to the day your system goes live.",
  },
  {
    name: "Gokul Krishnan",
    role: "Director",
    img: "/team/gokul-krishnan.jpg",
    artboard: "Gokul",
    gagMs: 2950,
    caught: "Caught napping. That never happened.",
    bio: "Sets the direction and picks the problems worth solving first.",
  },
  {
    name: "Siddharth Bhat",
    role: "Operations Head",
    img: "/team/siddharth-bhat.jpg",
    artboard: "Siddharth",
    gagMs: 3100,
    caught: "Caught shooting hoops. Totally coding now.",
    bio: "Keeps every project on time and every client in the loop.",
  },
  {
    name: "Deepak Kumaran",
    role: "Forward Deployed Engineer",
    img: "/team/deepak-kumaran.jpg",
    artboard: "Deepak",
    gagMs: 3100,
    caught: "Caught dancing. Was definitely coding.",
    bio: "Works inside your team and wires the agents and automations into the tools you already use.",
  },
  {
    name: "Janith Reddy",
    role: "Forward Deployed Engineer",
    img: "/team/janith-reddy.jpg",
    artboard: "Janith",
    gagMs: 2670,
    caught: "Caught watching a movie with popcorn. Back to work.",
    bio: "Sits with the people doing the work and builds what they actually need.",
  },
  {
    name: "Kishen",
    role: "Mentor",
    artboard: "Kishen",
    gagMs: 4270,
    shotMs: 3800, // the shot lands on frame 224 of his `caught` in cabs.mjs
    caught: "Identity classified.",
    bio: "Mentor to the team. Everything else is on a need to know basis.",
  },
];

const beliefs = [
  {
    src: "/rive/about.riv",
    artboard: "Learn",
    title: "We learn before we build.",
    body: "We watch how the work really flows before we write a line of code.",
    alt: "Our developer stands behind someone at their desk, writes notes on a clipboard, and gets a lightbulb idea.",
  },
  {
    src: "/rive/about.riv",
    artboard: "Queue",
    title: "One fix at a time.",
    body: "Small, proven wins beat a big plan nobody finishes.",
    alt: "A queue of people at our developer's counter: he fixes the broken thing each one brings, they cheer and walk off, and the next one steps up.",
  },
  {
    src: "/rive/about.riv",
    artboard: "Key",
    title: "It stays yours.",
    body: "Your code, your accounts, your team running it. We hand over the keys.",
    alt: "A stickman hands another a key, and he holds it up and jingles it happily.",
  },
];

const serif = "font-serif text-[2.6rem] leading-[1.04] tracking-[-0.02em] sm:text-6xl";

export default function AboutPage() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema("About", "/about/"), teamSchema(team)]} />
      <section className="relative overflow-hidden bg-blueprint py-16 text-white sm:py-24 md:py-28">
        <GridBackground />
        <Container className="relative z-10 grid items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-9">
            <TechLabel>About</TechLabel>
            <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-[1.02] tracking-[-0.02em] sm:text-7xl">
              We&rsquo;re the people who sit next to your team.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
              Sudo Sapient is a small team of engineers and operators. We learn how your company
              really works, then build the AI that takes the busywork off it. Your people get their
              time back, and the business moves faster. We&rsquo;re based in Bangalore and work with
              teams across India and in Dubai.
            </p>
          </div>
          <div className="hidden justify-end lg:col-span-3 lg:flex">
            <RiveScene
              className="w-48 rounded-sm bg-[#eef1f5]"
              src="/rive/services.riv"
              artboard="Hello"
              animation="loop"
              frameClassName="aspect-[140/110] w-full"
              ariaLabel="Our developer waves hello."
              fallback={null}
            />
          </div>
        </Container>
      </section>

      <section className="bg-offwhite py-16 text-ink sm:py-24">
        <Container className="grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <TechLabel tone="dark">Why we exist</TechLabel>
            <h2 className={`mt-4 max-w-2xl ${serif}`}>We kept seeing the same thing.</h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/70">
              Smart people spending half their week copying, chasing and sorting. Not because they
              wanted to, but because nobody had fixed it. So that&rsquo;s what we do. We fix it, one
              workflow at a time.
            </p>
          </div>
          <div className="flex justify-center lg:col-span-5">
            <RiveScene
              className="w-full max-w-[400px] bg-[#eef1f5]"
              src="/rive/about.riv"
              artboard="Rescue"
              animation="loop"
              frameClassName="aspect-[220/120] w-full"
              ariaLabel="A worker sinks under a growing pile of paper. Our developer sends in a cute AI agent that swirls round the pile until every sheet sits in a neat stack, and the worker pops back up to cheer."
              fallback={null}
            />
          </div>
        </Container>
      </section>

      <section className="bg-[#eef1f5] py-16 text-ink sm:py-24">
        <Container>
          <TechLabel tone="dark">What we believe</TechLabel>
          <h2 className={`mt-4 max-w-2xl ${serif}`}>Three things we don&rsquo;t bend on.</h2>
          <div className="mt-12 grid gap-px border border-ink/15 bg-ink/15 md:grid-cols-3">
            {beliefs.map((b) => (
              <article key={b.title} className="bg-[#eef1f5] p-6 sm:p-8">
                <RiveScene
                  className="mx-auto w-44"
                  src={b.src}
                  artboard={b.artboard}
                  animation="loop"
                  frameClassName="aspect-[140/110] w-full"
                  ariaLabel={b.alt}
                  fallback={null}
                />
                <h3 className="mt-6 font-display text-2xl font-bold tracking-tight-2">{b.title}</h3>
                <p className="mt-2 leading-relaxed text-ink/70">{b.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="relative overflow-clip bg-blueprint py-16 text-white sm:py-24">
        <GridBackground />
        <Container className="relative z-10">
          <TechLabel>The team</TechLabel>
          <h2 className={`mt-4 max-w-2xl ${serif}`}>Take the lift. Meet the team.</h2>
          <p className="mt-4 max-w-xl text-lg text-white/75">
            Six floors, six people. These are the ones on your calls and the ones building your
            system.
          </p>
          <div className="mt-12">
            <TeamElevator floors={team} />
          </div>
        </Container>
      </section>

      {/* both sections are blueprint blue: a hairline keeps them apart */}
      <div className="border-t border-white/15 bg-blueprint">
        <FinalCTA />
      </div>
    </>
  );
}

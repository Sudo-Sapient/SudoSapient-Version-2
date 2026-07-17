import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { BlueprintFrame } from "@/components/blueprint/BlueprintFrame";
import { TechLabel } from "@/components/blueprint/TechLabel";
import { Button } from "@/components/ui/Button";
import { getProject, projects } from "@/lib/projects";
import { withBasePath } from "@/lib/site";
import {
  FigureCarrying,
  FigureClimbing,
  FigureMeasuring,
  FigurePointing,
  BreathingFigure,
} from "@/components/figures";

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "Case study — Sudo Sapient" };
  const title = `${project.title} — Sudo Sapient`;
  return {
    title,
    description: project.oneLiner,
    openGraph: {
      title,
      description: project.oneLiner,
      type: "article",
      images: project.image ? [{ url: project.image }] : undefined,
    },
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const currentIndex = projects.findIndex((item) => item.slug === project.slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];
  const Figure =
    project.discipline === "AI Product"
      ? FigureCarrying
      : project.discipline === "AI Automation"
        ? FigureClimbing
        : project.discipline === "Web & Brand"
          ? FigureMeasuring
          : FigurePointing;

  return (
    <>
      <section className="bg-blueprint py-12 text-white sm:py-16 md:py-20">
        <Container>
          <Link
            href="/work"
            className="mb-6 inline-block font-mono text-[11px] uppercase tracking-[0.16em] text-white/65 transition-colors hover:text-white"
          >
            ← All work
          </Link>
          <BlueprintFrame
            subject={project.client.toUpperCase()}
            type={project.discipline.toUpperCase()}
            version="CASE STUDY"
            date={project.year}
          >
            <div className="grid items-end gap-8 lg:grid-cols-12">
              <div className="flex flex-col gap-6 lg:col-span-9">
                <TechLabel>CLIENT · {project.client}</TechLabel>
                <h1 className="max-w-5xl text-balance font-display text-4xl font-extrabold leading-[0.94] tracking-tight-3 sm:text-5xl md:text-6xl">
                  {project.title}
                </h1>
                <p className="max-w-3xl text-lg leading-relaxed text-white/80">
                  {project.oneLiner}
                </p>
              </div>
              <div className="hidden justify-end text-white lg:col-span-3 lg:flex">
                <BreathingFigure>
                  <Figure size={130} />
                </BreathingFigure>
              </div>
            </div>
            {project.image && (
              <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden border border-white/25">
                {project.externalUrl ? (
                  <a
                    href={project.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 block"
                    aria-label={`Visit ${project.client}`}
                  >
                    <Image
                      src={withBasePath(project.image)}
                      alt={`${project.client} — ${project.title}`}
                      fill
                      priority
                      sizes="(min-width: 1024px) 1200px, 100vw"
                      className="object-cover transition-transform duration-500 hover:scale-[1.02]"
                    />
                  </a>
                ) : (
                  <Image
                    src={withBasePath(project.image)}
                    alt={`${project.client} — ${project.title}`}
                    fill
                    priority
                    sizes="(min-width: 1024px) 1200px, 100vw"
                    className="object-cover"
                  />
                )}
              </div>
            )}
          </BlueprintFrame>
        </Container>
      </section>

      <section className="bg-offwhite py-14 sm:py-20 md:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <aside className="lg:col-span-3">
              <div className="sticky top-24 border-y border-ink/20 py-5">
                <TechLabel tone="dark">PROJECT RECORD</TechLabel>
                <dl className="mt-5 space-y-5">
                  <Fact label="Client" value={project.client} />
                  <Fact label="Discipline" value={project.discipline} />
                  <Fact label="Year" value={project.year} />
                  {project.metrics[0] && (
                    <Fact label={project.metrics[0].label} value={project.metrics[0].value} />
                  )}
                </dl>
              </div>
            </aside>
            <div className="space-y-16 lg:col-span-9">
              <StoryBlock
                index="01"
                label="THE PROBLEM"
                title="What had to change"
                body={project.problem}
              />
              <StoryBlock
                index="02"
                label="THE BUILD"
                title="What we designed and shipped"
                body={project.approach}
              />
              <StoryBlock
                index="03"
                label="THE RESULT"
                title="What changed after launch"
                body={project.outcome}
              />
            </div>
          </div>

          <div className="mt-16 grid gap-px border-y border-ink/20 bg-ink/15 py-px sm:grid-cols-3 md:mt-24">
            {project.metrics.map((metric) => (
              <div key={metric.label} className="bg-offwhite p-6 sm:p-8">
                <TechLabel tone="dark">{metric.label}</TechLabel>
                <p className="mt-2 font-display text-2xl font-bold tracking-tight-2 text-ink sm:text-3xl">
                  {metric.value}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-[#eef1f5] py-14 sm:py-20">
        <Container>
          <div className="grid items-end gap-8 border-b border-ink/20 pb-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <TechLabel tone="dark">HAVE A RELATED WORKFLOW?</TechLabel>
              <h2 className="mt-4 text-balance font-display text-4xl font-extrabold leading-[0.95] tracking-tight-3 sm:text-5xl">
                Let&rsquo;s identify the smallest useful system to ship first.
              </h2>
            </div>
            <div className="lg:col-span-4 lg:text-right">
              <Button asChild variant="secondary" size="lg">
                <Link href={`/contact?project=${encodeURIComponent(project.discipline)}`}>
                  Discuss a similar build →
                </Link>
              </Button>
            </div>
          </div>
          <div className="mt-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <TechLabel tone="dark">NEXT CASE STUDY</TechLabel>
            <Link
              href={`/work/${nextProject.slug}`}
              className="group max-w-2xl font-display text-2xl font-bold leading-tight tracking-tight-2 text-ink transition-colors hover:text-blueprint sm:text-right"
            >
              {nextProject.title}{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/45">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-ink">{value}</dd>
    </div>
  );
}

function StoryBlock({
  index,
  label,
  title,
  body,
}: {
  index: string;
  label: string;
  title: string;
  body: string;
}) {
  return (
    <article className="grid gap-6 sm:grid-cols-12">
      <div className="sm:col-span-3">
        <TechLabel tone="dark">
          {index} · {label}
        </TechLabel>
      </div>
      <div className="sm:col-span-9">
        <h2 className="font-display text-3xl font-bold tracking-tight-2 text-ink sm:text-4xl">
          {title}
        </h2>
        <p className="mt-5 max-w-3xl text-lg leading-[1.75] text-ink/75">{body}</p>
      </div>
    </article>
  );
}

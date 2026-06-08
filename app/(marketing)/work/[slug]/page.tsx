import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { BlueprintFrame } from "@/components/blueprint/BlueprintFrame";
import { TechLabel } from "@/components/blueprint/TechLabel";
import { Button } from "@/components/ui/Button";
import { getProject, projects } from "@/lib/projects";
import {
  FigureCarrying,
  FigureClimbing,
  FigureMeasuring,
  FigurePointing,
} from "@/components/figures";

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

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
      <section className="bg-blueprint py-20 text-white">
        <Container>
          <BlueprintFrame
            subject={project.title.toUpperCase()}
            type={project.discipline.toUpperCase()}
            version="V1.0"
            date={project.year}
          >
            <div className="grid items-end gap-10 md:grid-cols-12">
              <div className="md:col-span-8 flex flex-col gap-6">
                <TechLabel>CLIENT · {project.client}</TechLabel>
                <h1 className="font-display text-4xl font-extrabold leading-[0.95] tracking-tight-2 sm:text-5xl md:text-6xl">
                  {project.title}
                </h1>
                <p className="max-w-2xl text-lg text-white/80">{project.oneLiner}</p>
              </div>
              <div className="md:col-span-4 flex justify-end text-white">
                <Figure size={140} />
              </div>
            </div>

            {project.image && (
              <div className="mt-10 relative aspect-[16/9] w-full overflow-hidden border border-white/25">
                {project.externalUrl ? (
                  <a
                    href={project.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 block"
                    aria-label={`Visit ${project.client}`}
                  >
                    <Image
                      src={project.image}
                      alt={`${project.client} — ${project.title}`}
                      fill
                      priority
                      sizes="(min-width: 1024px) 1024px, 100vw"
                      className="object-cover transition-transform duration-500 hover:scale-[1.02]"
                    />
                  </a>
                ) : (
                  <Image
                    src={project.image}
                    alt={`${project.client} — ${project.title}`}
                    fill
                    priority
                    sizes="(min-width: 1024px) 1024px, 100vw"
                    className="object-cover"
                  />
                )}
              </div>
            )}
          </BlueprintFrame>
        </Container>
      </section>

      <section className="bg-offwhite py-20">
        <Container className="grid gap-16 md:grid-cols-12">
          <Block index="01" label="PROBLEM" body={project.problem} />
          <Block index="02" label="APPROACH" body={project.approach} />
          <Block index="03" label="OUTCOME" body={project.outcome} />

          <div className="md:col-span-12 mt-4 grid grid-cols-3 gap-6 border-y border-ink/20 py-8">
            {project.metrics.map((m) => (
              <div key={m.label} className="flex flex-col gap-1">
                <TechLabel tone="dark">{m.label}</TechLabel>
                <span className="font-display text-2xl font-bold tracking-tight-2 text-ink sm:text-3xl">
                  {m.value}
                </span>
              </div>
            ))}
          </div>

          <div className="md:col-span-12">
            <Button asChild variant="secondary" size="lg">
              <Link href="/work">← All work</Link>
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}

function Block({
  index,
  label,
  body,
}: {
  index: string;
  label: string;
  body: string;
}) {
  return (
    <div className="md:col-span-4 flex flex-col gap-4">
      <div className="flex items-baseline gap-3">
        <TechLabel tone="dark">{index}</TechLabel>
        <TechLabel tone="dark">{label}</TechLabel>
      </div>
      <div className="h-px w-full bg-ink/30" />
      <p className="text-base leading-relaxed text-ink/85">{body}</p>
    </div>
  );
}

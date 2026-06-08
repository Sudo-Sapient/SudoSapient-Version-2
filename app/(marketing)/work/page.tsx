import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/blueprint/SectionHeading";
import { TechLabel } from "@/components/blueprint/TechLabel";
import { projects } from "@/lib/projects";

export const metadata = {
  title: "Work — Sudo Sapient",
};

export default function WorkIndexPage() {
  return (
    <>
      <section className="bg-blueprint py-24 text-white sm:py-28">
        <Container>
          <SectionHeading
            index="W"
            eyebrow="ALL WORK"
            title="Systems we've shipped."
            description="Each one a working slice of what an AI studio can do in 4–10 weeks."
          />
        </Container>
      </section>

      <section className="bg-offwhite py-20">
        <Container>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <Link
                key={p.slug}
                href={`/work/${p.slug}`}
                className="group flex flex-col gap-4 border border-ink/15 bg-white p-6 transition-colors hover:border-ink/40"
              >
                <div className="flex items-center justify-between">
                  <TechLabel tone="dark">{p.discipline.toUpperCase()}</TechLabel>
                  <TechLabel tone="dark">{p.year}</TechLabel>
                </div>
                <div className="relative aspect-[4/3] w-full overflow-hidden border border-ink/20">
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={`${p.client} — ${p.title}`}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <svg
                      viewBox="0 0 200 150"
                      fill="none"
                      stroke="#0F172A"
                      strokeWidth="1.25"
                      className="h-full w-full"
                    >
                      <rect x="20" y="20" width="160" height="110" />
                      <line x1="20" y1="40" x2="180" y2="40" />
                      <circle cx="32" cy="30" r="2" />
                      <line x1="40" y1="30" x2="80" y2="30" />
                      <rect x="40" y="60" width="50" height="50" />
                      <rect x="100" y="60" width="60" height="22" />
                      <rect x="100" y="88" width="60" height="22" />
                    </svg>
                  )}
                </div>
                <h3 className="font-display text-xl font-bold leading-tight tracking-tight-2 text-ink">
                  {p.title}
                </h3>
                <p className="text-sm text-ink/70">{p.oneLiner}</p>
                {p.isPlaceholder && (
                  <TechLabel tone="warn">{"// PLACEHOLDER — REPLACE"}</TechLabel>
                )}
              </Link>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}

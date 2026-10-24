import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { GridBackground } from "@/components/blueprint/GridBackground";
import { TechLabel } from "@/components/blueprint/TechLabel";
import { RiveScene } from "@/components/motion/RiveScene";
import { Button } from "@/components/ui/Button";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { JsonLd } from "@/components/seo/JsonLd";
import { CTA_LABEL, STAGES } from "@/lib/site";
import { SERVICES, getService } from "@/lib/services";
import { breadcrumbSchema, faqSchema, pageMetadata, serviceSchema } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return pageMetadata({
    title: s.metaTitle,
    description: s.metaDescription,
    path: `/services/${s.slug}/`,
  });
}

// Mid sentence casing that keeps "AI" capitalised: "AI agents", "workflow automation".
const inSentence = (name: string) =>
  name.startsWith("AI") ? name : name[0].toLowerCase() + name.slice(1);

const serif = "font-serif text-[2.6rem] leading-[1.04] tracking-[-0.02em] sm:text-6xl";

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();
  const path = `/services/${s.slug}/`;
  const others = SERVICES.filter((o) => o.slug !== s.slug);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(s.name, path, [["Services", "/services/"]]),
          serviceSchema(s.name, `${s.intro} ${s.outcome}`, path),
          faqSchema(s.faqs),
        ]}
      />

      <section className="relative overflow-hidden bg-blueprint py-16 text-white sm:py-24">
        <GridBackground />
        <Container className="relative z-10 grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <nav
              aria-label="Breadcrumb"
              className="font-mono text-[12px] uppercase tracking-[0.14em] text-white/70"
            >
              <Link href="/services/" className="hover:text-warn">
                Services
              </Link>
              <span aria-hidden className="mx-2">
                /
              </span>
              <span aria-current="page">{s.name}</span>
            </nav>
            <h1 className="mt-5 max-w-3xl font-serif text-5xl leading-[1.02] tracking-[-0.02em] sm:text-6xl md:text-7xl">
              {s.h1}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">{s.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="solid" size="lg">
                <Link href="/contact/">{CTA_LABEL}</Link>
              </Button>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="mx-auto max-w-[360px] rounded-sm bg-[#eef1f5]">
              <RiveScene
                src="/rive/services.riv"
                artboard={s.artboard}
                animation="loop"
                frameClassName="aspect-[140/110] w-full"
                ariaLabel={`An animation of ${inSentence(s.name)} at work.`}
                fallback={null}
              />
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-offwhite py-16 text-ink sm:py-24">
        <Container>
          <TechLabel tone="dark">What it handles</TechLabel>
          <h2 className={`mt-4 max-w-3xl ${serif}`}>
            What {inSentence(s.name)} can handle for you.
          </h2>
          <ul className="mt-12 grid gap-px border border-ink/15 bg-ink/15 sm:grid-cols-2">
            {s.handles.map((h) => (
              <li key={h.title} className="bg-offwhite p-6 sm:p-8">
                <h3 className="font-display text-2xl font-bold tracking-tight-2">{h.title}</h3>
                <p className="mt-2 leading-relaxed text-ink/70">{h.body}</p>
              </li>
            ))}
          </ul>
          <div className="mt-12 grid gap-6 border-t border-ink/15 pt-8 md:grid-cols-2">
            <div>
              <TechLabel tone="dark">What changes</TechLabel>
              <p className="mt-3 font-serif text-3xl leading-tight text-blueprint">{s.outcome}</p>
            </div>
            <div>
              <TechLabel tone="dark">Done for clients</TechLabel>
              <p className="mt-3 text-lg leading-relaxed text-ink/80">{s.proof}</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-[#eef1f5] py-16 text-ink sm:py-24">
        <Container>
          <TechLabel tone="dark">How it runs</TechLabel>
          <h2 className={`mt-4 max-w-2xl ${serif}`}>Start small, prove it, then scale.</h2>
          <ol className="mt-12 grid gap-px border border-ink/15 bg-ink/15 sm:grid-cols-2 lg:grid-cols-4">
            {STAGES.map((st) => (
              <li key={st.n} className="bg-[#eef1f5] p-6 sm:p-8">
                <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.14em] text-ink/60">
                  <span>{st.n}</span>
                  <span>{st.time}</span>
                </div>
                <h3 className="mt-4 font-display text-2xl font-bold tracking-tight-2">
                  {st.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{st.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-offwhite py-16 text-ink sm:py-24">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <TechLabel tone="dark">Questions</TechLabel>
            <h2 className={`mt-4 ${serif}`}>About {inSentence(s.name)}.</h2>
          </div>
          <div className="divide-y divide-ink/15 border-y border-ink/15 lg:col-span-8">
            {s.faqs.map((f) => (
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
        <Container className="mt-16">
          <TechLabel tone="dark">Also from Sudo Sapient</TechLabel>
          <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
            {others.map((o) => (
              <li key={o.slug}>
                <Link
                  href={`/services/${o.slug}/`}
                  className="inline-flex min-h-11 items-center border-b border-ink/40 font-serif text-2xl hover:border-blueprint hover:text-blueprint"
                >
                  {o.name}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <FinalCTA />
    </>
  );
}

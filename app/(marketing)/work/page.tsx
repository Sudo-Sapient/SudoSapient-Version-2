import { SITE_URL, breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { FILMS } from "@/lib/films";
import { withBasePath } from "@/lib/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/layout/Container";
import { GridBackground } from "@/components/blueprint/GridBackground";
import { PortfolioSoon } from "@/components/sections/PortfolioSoon";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata = pageMetadata({
  title: "Our Work: Shipzy and Taamul | Sudo Sapient",
  description:
    "Short films on what Sudo Sapient built for Shipzy, a logistics company, and Taamul, a credit review firm in the UAE: AI agents, dashboards and decisions that went from days to minutes.",
  path: "/work/",
});

const filmSchema = {
  "@context": "https://schema.org",
  "@graph": FILMS.map((f) => ({
    "@type": "VideoObject",
    name: `Sudo Sapient × ${f.client}: ${f.title}`,
    description: f.summary,
    thumbnailUrl: `${SITE_URL}${f.poster}`,
    contentUrl: `${SITE_URL}${f.src}`,
    uploadDate: f.uploaded,
    duration: f.duration,
  })),
};

// Full write-ups for /work/[slug] stay built but unlinked until they're public.
export default function WorkIndexPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema("Work", "/work/")} />
      <JsonLd data={filmSchema} />
      <section className="relative overflow-hidden bg-blueprint py-16 text-white sm:py-24">
        <GridBackground />
        <Container className="relative z-10">
          <h1 className="max-w-3xl font-heading text-5xl font-semibold leading-[1.02] tracking-[-0.02em] sm:text-6xl md:text-7xl">
            What we built, in our clients&rsquo; words.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
            Two one-minute films: a logistics team buried in chats, and a credit firm buried in
            paperwork.
          </p>
        </Container>
      </section>

      <section className="bg-offwhite py-16 text-ink sm:py-24">
        <Container className="flex flex-col gap-20 sm:gap-28">
          {FILMS.map((f, i) => (
            <article
              key={f.slug}
              id={f.slug}
              className="grid scroll-mt-24 items-start gap-8 lg:grid-cols-12 lg:gap-12"
            >
              <div className={`lg:col-span-7 ${i % 2 ? "lg:order-2" : ""}`}>
                <video
                  className="aspect-video w-full rounded-2xl bg-ink shadow-[0_24px_60px_-28px_rgba(15,23,42,0.55)]"
                  controls
                  playsInline
                  preload="none"
                  poster={withBasePath(f.poster)}
                  aria-label={`Sudo Sapient × ${f.client}: ${f.title}`}
                >
                  <source src={withBasePath(f.src)} type="video/mp4" />
                </video>
              </div>
              <div className="lg:col-span-5">
                <p className="text-sm font-semibold text-blueprint">{f.sector}</p>
                <h2 className="mt-2 font-heading text-4xl font-semibold leading-[1.05] tracking-[-0.02em] sm:text-5xl">
                  Sudo Sapient × {f.client}
                </h2>
                <p className="mt-1 text-lg text-ink/60">{f.title}</p>
                <p className="mt-5 leading-relaxed text-ink/75">{f.summary}</p>
                <ul className="mt-6 space-y-3">
                  {f.facts.map((fact) => (
                    <li key={fact} className="flex gap-3 text-ink/80">
                      <span className="mt-2.5 h-1.5 w-1.5 flex-none rounded-full bg-blueprint" />
                      {fact}
                    </li>
                  ))}
                </ul>
                <blockquote className="mt-8 border-l-2 border-blueprint pl-4">
                  <p className="text-lg leading-snug text-ink">&ldquo;{f.quote}&rdquo;</p>
                  <footer className="mt-2 text-sm text-ink/60">{f.quotee}</footer>
                </blockquote>
              </div>
            </article>
          ))}
        </Container>
      </section>

      <PortfolioSoon />
      <FinalCTA />
    </>
  );
}

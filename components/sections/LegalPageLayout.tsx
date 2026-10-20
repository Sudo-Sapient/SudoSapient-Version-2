import { Container } from "@/components/layout/Container";
import { TechLabel } from "@/components/blueprint/TechLabel";
import { RiveScene } from "@/components/motion/RiveScene";

type Section = [string, string];

type Props = {
  title: string;
  intro: string;
  updated: string;
  /** Three plain lines that say the whole thing before the detail. */
  summary: string[];
  scene: { src: string; artboard: string; alt: string };
  sections: Section[];
};

export function LegalPageLayout({ title, intro, updated, summary, scene, sections }: Props) {
  return (
    <div className="bg-offwhite text-ink">
      <section className="border-b border-ink/15 py-14 sm:py-20">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <TechLabel tone="dark">Legal · Updated {updated}</TechLabel>
              <h1 className="mt-5 font-serif text-5xl leading-[1.02] tracking-[-0.02em] sm:text-7xl">
                {title}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/70">{intro}</p>
            </div>
            <div className="lg:col-span-5">
              <div className="mx-auto max-w-[320px] bg-[#eef1f5]">
                <RiveScene
                  src={scene.src}
                  artboard={scene.artboard}
                  animation="loop"
                  frameClassName="aspect-[140/110] w-full"
                  ariaLabel={scene.alt}
                  fallback={null}
                />
              </div>
            </div>
          </div>

          <div className="mt-12 border border-ink/15 bg-white p-6 sm:p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/50">
              The short version
            </p>
            <ul className="mt-5 grid gap-5 sm:grid-cols-3">
              {summary.map((line) => (
                <li key={line} className="flex gap-3 leading-relaxed text-ink/80">
                  <span className="mt-2 h-1.5 w-1.5 flex-none bg-warn" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <aside className="hidden lg:col-span-3 lg:block">
              <nav aria-label="On this page" className="lg:sticky lg:top-28">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/50">
                  On this page
                </p>
                <ol className="mt-5 space-y-3 border-l border-ink/15 pl-4">
                  {sections.map(([heading], index) => (
                    <li key={heading}>
                      <a
                        href={`#legal-${index + 1}`}
                        className="text-sm text-ink/60 transition-colors hover:text-ink"
                      >
                        {heading}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>

            <div className="lg:col-span-9">
              {sections.map(([heading, body], index) => (
                <section
                  id={`legal-${index + 1}`}
                  key={heading}
                  className="scroll-mt-28 border-t border-ink/20 py-8 first:border-t-0 first:pt-0"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-[11px] text-blueprint">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h2 className="font-serif text-3xl leading-tight tracking-[-0.01em] sm:text-4xl">
                      {heading}
                    </h2>
                  </div>
                  <p className="mt-4 max-w-2xl text-base leading-8 text-ink/75">{body}</p>
                </section>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

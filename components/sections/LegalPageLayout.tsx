import { Container } from "@/components/layout/Container";
import { TechLabel } from "@/components/blueprint/TechLabel";
import {
  LegalOperationsScene,
  type LegalSceneVariant,
} from "@/components/scenes/LegalOperationsScene";
import { LegalMicroScene, type MicroKind } from "@/components/scenes/LegalMicroScene";

type Section = [string, string];

type Props = {
  title: string;
  intro: string;
  updated: string;
  variant: LegalSceneVariant;
  sections: Section[];
};

const microKinds: Record<LegalSceneVariant, MicroKind[]> = {
  privacy: ["no-transfer", "your-control", "direct-contact"],
  terms: ["use-boundary", "clear-ownership", "external-edge"],
};

export function LegalPageLayout({ title, intro, updated, variant, sections }: Props) {
  const sceneAt = variant === "privacy" ? [2, 4, 5] : [0, 3, 4];

  return (
    <main className="bg-offwhite text-ink">
      <section className="border-b border-ink/15 py-14 sm:py-20 lg:py-24">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <TechLabel tone="dark">LEGAL · UPDATED {updated}</TechLabel>
              <h1 className="mt-5 text-balance font-display text-5xl font-extrabold leading-[.92] tracking-tight-3 sm:text-6xl lg:text-7xl">
                {title}
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-8 text-ink/65">{intro}</p>
              <div className="text-ink/42 mt-8 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[.14em]">
                <span className="h-px w-10 bg-warn" />
                Plain-language operating record
              </div>
            </div>
            <div className="lg:col-span-7">
              <LegalOperationsScene variant={variant} />
            </div>
          </div>
        </Container>
      </section>

      <section className="py-14 sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <aside className="lg:col-span-3">
              <div className="lg:sticky lg:top-28">
                <p className="text-ink/42 font-mono text-[9px] uppercase tracking-[.16em]">
                  Document index
                </p>
                <ol className="mt-5 space-y-3 border-l border-ink/15 pl-4">
                  {sections.map(([heading], index) => (
                    <li key={heading}>
                      <a
                        href={`#legal-${index + 1}`}
                        className="text-ink/48 font-mono text-[9px] uppercase tracking-[.1em] transition-colors hover:text-ink"
                      >
                        {String(index + 1).padStart(2, "0")} · {heading}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>

            <div className="lg:col-span-8">
              {sections.map(([heading, body], index) => {
                const microIndex = sceneAt.indexOf(index);
                const micro = microIndex >= 0 ? microKinds[variant][microIndex] : null;
                return (
                  <section
                    id={`legal-${index + 1}`}
                    key={heading}
                    className="scroll-mt-28 border-t border-ink/20 py-8 first:pt-0"
                  >
                    <div
                      className={micro ? "grid gap-7 sm:grid-cols-[1fr_12rem] sm:items-start" : ""}
                    >
                      <div>
                        <div className="flex items-baseline gap-4">
                          <span className="font-mono text-[9px] text-warn">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <h2 className="font-display text-2xl font-bold tracking-[-.035em] sm:text-3xl">
                            {heading}
                          </h2>
                        </div>
                        <p className="text-ink/72 mt-4 max-w-2xl text-base leading-8">{body}</p>
                      </div>
                      {micro && <LegalMicroScene kind={micro} />}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

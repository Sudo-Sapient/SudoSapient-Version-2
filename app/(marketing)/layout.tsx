import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { LadderClimber } from "@/components/scenes/LadderClimber";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[10000] -translate-y-24 bg-warn px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.12em] text-ink transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <Nav />
      <LadderClimber />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </>
  );
}

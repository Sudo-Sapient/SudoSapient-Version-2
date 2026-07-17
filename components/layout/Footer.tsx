import Link from "next/link";
import { Container } from "./Container";
import { FooterScene } from "./FooterScene";

const links = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[#0a1020] text-white">
      <Container className="py-8 sm:py-9 lg:py-10">
        <div className="grid gap-5 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <p className="max-w-4xl text-balance font-display text-4xl leading-[0.9] tracking-[-0.055em] sm:text-5xl">
              Ready when
              <span className="block text-warn">the problem is.</span>
            </p>
          </div>

          <div className="flex flex-col items-start justify-end lg:col-span-5 lg:pb-1">
            <p className="text-white/58 max-w-md text-base leading-relaxed">
              Send us the workflow, the constraint, and what better should look like.
            </p>
            <Link
              href="/contact"
              className="group mt-4 inline-flex items-center border-b border-white/35 pb-1.5 font-display text-lg tracking-[-0.035em] transition-colors hover:border-warn hover:text-warn"
            >
              Start a project
              <span className="ml-8 inline-block transition-transform duration-500 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>

        <div className="mt-6 border-y border-white/10 bg-white/[0.015]">
          <FooterScene />
        </div>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              href="/"
              aria-label="Sudo Sapient home"
              className="font-display text-2xl tracking-[-0.045em] text-white"
            >
              Sudo Sapient<span className="text-warn">.</span>
            </Link>
            <a
              href="mailto:sudosapient@gmail.com"
              className="text-white/42 mt-2 block text-xs transition-colors hover:text-white"
            >
              sudosapient@gmail.com
            </a>
          </div>

          <div className="flex flex-col gap-5 sm:items-end">
            <nav aria-label="Footer navigation">
              <ul className="flex flex-wrap gap-x-6 gap-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/55 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="text-white/28 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[9px] uppercase tracking-[0.14em]">
              <span>© {year}</span>
              <Link href="/privacy" className="transition-colors hover:text-white">
                Privacy
              </Link>
              <Link href="/terms" className="transition-colors hover:text-white">
                Terms
              </Link>
              <Link href="#top" className="transition-colors hover:text-warn">
                Top ↑
              </Link>
            </div>
          </div>
        </div>
      </Container>

      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -right-16 h-48 w-48 rounded-full border border-white/[0.045] sm:h-64 sm:w-64"
      />
    </footer>
  );
}

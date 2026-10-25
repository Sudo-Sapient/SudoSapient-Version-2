import Link from "next/link";
import { Container } from "./Container";
import { FooterScene } from "./FooterScene";
import { MobileFooterLaunch } from "./MobileFooterLaunch";
import { CTA_LABEL } from "@/lib/site";
import { RiveScene } from "@/components/motion/RiveScene";

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
        <div className="border-y border-white/10 bg-white/[0.015] sm:hidden">
          <RiveScene
            src="/rive/footer.riv"
            artboard="Mobile"
            stateMachine="Launch"
            frameClassName="aspect-[3/4] w-full"
            ariaLabel="The crew builds and launches a rocket"
            fallback={<MobileFooterLaunch />}
          />
        </div>
        <div className="hidden border-y border-white/10 bg-white/[0.015] sm:block">
          <RiveScene
            src="/rive/footer.riv"
            artboard="Desktop"
            stateMachine="Launch"
            frameClassName="aspect-[4/1] w-full"
            ariaLabel="The crew builds and launches a rocket"
            fallback={<FooterScene />}
          />
        </div>

        <div className="mt-5 flex flex-col gap-6 sm:mt-4 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
          <div>
            <Link
              href="/"
              aria-label="Sudo Sapient home"
              className="font-brand text-2xl tracking-[-0.045em] text-white"
            >
              Sudo Sapient<span className="text-warn">.</span>
            </Link>
            <a
              href="mailto:hello@sudosapient.com"
              className="text-white/42 mt-2 block text-xs transition-colors hover:text-white"
            >
              hello@sudosapient.com
            </a>
          </div>

          <div className="flex flex-col gap-5 sm:items-end">
            <nav aria-label="Footer navigation" className="w-full sm:w-auto">
              <ul className="grid grid-cols-2 gap-x-5 gap-y-3 sm:flex sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex min-h-11 items-center text-sm text-white/55 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/contact"
                    className="inline-flex min-h-11 items-center text-sm text-warn transition-colors hover:text-white"
                  >
                    {CTA_LABEL}
                  </Link>
                </li>
              </ul>
            </nav>
            <div className="flex w-full items-center justify-between gap-3 border-t border-white/10 pt-4 text-[13px] font-medium text-white/60 sm:w-auto sm:justify-start sm:border-0 sm:pt-0">
              <span>© {year}</span>
              <Link
                href="/privacy"
                className="inline-flex min-h-11 items-center transition-colors hover:text-white"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="inline-flex min-h-11 items-center transition-colors hover:text-white"
              >
                Terms
              </Link>
              <Link
                href="#top"
                className="inline-flex min-h-11 items-center transition-colors hover:text-warn"
              >
                Top
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

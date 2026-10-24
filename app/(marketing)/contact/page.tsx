import { Container } from "@/components/layout/Container";
import { GridBackground } from "@/components/blueprint/GridBackground";
import { TechLabel } from "@/components/blueprint/TechLabel";
import { RiveScene } from "@/components/motion/RiveScene";

export const metadata = {
  title: "Start your transformation | Sudo Sapient",
  description:
    "Message us on WhatsApp or email us. Tell us how your team works today and we reply within one working day.",
};

const WHATSAPP_NUMBER = "918050029848"; // +91 80500 29848, country code first, digits only
const EMAIL = "sudosapient@gmail.com";
const HELLO = "Hi Sudo Sapient, I'd like to talk about automating some of the work at my company.";

const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(HELLO)}`;
const emailHref = `mailto:${EMAIL}?subject=${encodeURIComponent("Start our transformation")}&body=${encodeURIComponent(
  `${HELLO}\n\nOur company:\nWhat takes up most of our week:\n`
)}`;

const steps = [
  ["You message us", "A few lines on your team and where the work piles up is plenty."],
  ["We reply within a working day", "A real person, not an auto reply, with a time for a call."],
  ["A thirty minute call", "You leave with the first three things worth automating."],
];

export default function ContactPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-blueprint py-16 text-white sm:py-24">
        <GridBackground />
        <Container className="relative z-10 grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <TechLabel>Start your transformation</TechLabel>
            <h1 className="mt-5 font-serif text-5xl leading-[1.02] tracking-[-0.02em] sm:text-6xl md:text-7xl">
              Say hello. We&rsquo;ll take it from there.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
              Tell us how your team works today and what you would love to stop doing by hand. Pick
              whichever is easier for you.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-14 items-center justify-center gap-3 bg-[#25D366] px-6 font-mono text-[13px] uppercase tracking-[0.14em] text-ink transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warn"
              >
                <ChatIcon />
                Message us on WhatsApp
              </a>
              <a
                href={emailHref}
                className="inline-flex min-h-14 items-center justify-center gap-3 border border-white/60 px-6 font-mono text-[13px] uppercase tracking-[0.14em] text-white transition-colors hover:bg-white hover:text-blueprint focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warn"
              >
                <MailIcon />
                Email us
              </a>
            </div>
            <p className="mt-5 text-sm text-white/70">
              Or reach us directly at{" "}
              <a href={`mailto:${EMAIL}`} className="underline underline-offset-4 hover:text-warn">
                {EMAIL}
              </a>{" "}
              or{" "}
              <a href="tel:+918050029848" className="underline underline-offset-4 hover:text-warn">
                +91 80500 29848
              </a>
              .
            </p>
          </div>
          <div className="lg:col-span-6">
            <RiveScene
              src="/rive/contact.riv"
              animation="loop"
              frameClassName="aspect-[300/170] w-full"
              ariaLabel="A visitor types a message on his phone. A cute AI agent flies it over to our developer, who catches it, jumps for joy and sends a reply back."
              fallback={null}
            />
          </div>
        </Container>
      </section>

      <section className="bg-offwhite py-16 text-ink sm:py-24">
        <Container>
          <TechLabel tone="dark">What happens next</TechLabel>
          <ol className="mt-8 grid gap-px border border-ink/15 bg-ink/15 md:grid-cols-3">
            {steps.map(([title, body], i) => (
              <li key={title} className="bg-offwhite p-6 sm:p-8">
                <span className="font-mono text-[12px] text-blueprint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="mt-3 font-serif text-3xl leading-tight">{title}</h2>
                <p className="mt-2 leading-relaxed text-ink/70">{body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>
    </>
  );
}

function ChatIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    >
      <path d="M4 5h16v11H9l-5 4z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="14" />
      <path d="m3 6 9 7 9-7" />
    </svg>
  );
}

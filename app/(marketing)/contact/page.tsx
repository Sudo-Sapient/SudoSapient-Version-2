import { ContactForm } from "@/components/sections/ContactForm";
import { Container } from "@/components/layout/Container";
import { GridBackground } from "@/components/blueprint/GridBackground";
import { TechLabel } from "@/components/blueprint/TechLabel";
import { BlueprintFrame } from "@/components/blueprint/BlueprintFrame";

export const metadata = {
  title: "Start your transformation | Sudo Sapient",
  description:
    "Tell us how your company runs today. We reply within a working day with whether we're the right studio for it and what a first sprint looks like.",
};

export default function ContactPage() {
  return (
    <section className="relative overflow-hidden bg-blueprint py-16 text-white sm:py-24 md:py-28">
      <GridBackground />
      <Container className="relative z-10">
        <BlueprintFrame
          subject="PROJECT INTAKE FORM"
          type="START · TRANSFORMATION"
          version="V1.0"
          date="2026"
        >
          <div className="grid gap-8 md:gap-12 lg:grid-cols-12">
            <div className="flex flex-col gap-6 lg:col-span-5">
              <TechLabel>{"// SPEC SHEET"}</TechLabel>
              <h1 className="font-serif text-4xl leading-[1.02] tracking-[-0.02em] sm:text-5xl md:text-6xl">
                Tell us how your company runs today.
              </h1>
              <p className="text-white/80">
                Give us the context: your teams, where work piles up, and what you would love to
                stop doing by hand. We&rsquo;ll reply within one working day with whether
                we&rsquo;re the right partner and what an audit would cover.
              </p>
              <div className="mt-2 grid grid-cols-2 gap-3 border-t border-white/20 pt-4">
                <Metadatum label="RESPONSE" value="< 24 HRS" />
                <Metadatum label="FORMAT" value="EMAIL" />
                <Metadatum label="FIRST CALL" value="30 MIN" />
                <Metadatum label="NEXT STEP" value="SCOPE NOTE" />
              </div>
            </div>
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </BlueprintFrame>
      </Container>
    </section>
  );
}

function Metadatum({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <TechLabel>{label}</TechLabel>
      <span className="font-mono text-[13px] text-white">{value}</span>
    </div>
  );
}

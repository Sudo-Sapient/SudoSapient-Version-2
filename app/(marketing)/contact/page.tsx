import { ContactForm } from "@/components/sections/ContactForm";
import { Container } from "@/components/layout/Container";
import { GridBackground } from "@/components/blueprint/GridBackground";
import { TechLabel } from "@/components/blueprint/TechLabel";
import { BlueprintFrame } from "@/components/blueprint/BlueprintFrame";

export const metadata = { title: "Start a Project — Sudo Sapient" };

export default function ContactPage() {
  return (
    <section className="relative overflow-hidden bg-blueprint py-20 text-white sm:py-28">
      <GridBackground />
      <Container className="relative z-10">
        <BlueprintFrame
          subject="PROJECT INTAKE FORM"
          type="START · A · PROJECT"
          version="V1.0"
          date="2026"
        >
          <div className="grid gap-12 md:grid-cols-12">
            <div className="md:col-span-5 flex flex-col gap-6">
              <TechLabel>{"// SPEC SHEET"}</TechLabel>
              <h1 className="font-display text-4xl font-extrabold leading-[0.95] tracking-tight-2 sm:text-5xl">
                Tell us what you want to build.
              </h1>
              <p className="text-white/80">
                Four fields. We&rsquo;ll come back within a working day with whether
                we&rsquo;re the right studio for it, and if so, what a first sprint
                would look like.
              </p>
              <div className="mt-2 grid grid-cols-2 gap-3 border-t border-white/20 pt-4">
                <Metadatum label="RESPONSE" value="< 24 HRS" />
                <Metadatum label="FORMAT" value="EMAIL" />
                <Metadatum label="FIRST CALL" value="30 MIN" />
                <Metadatum label="NEXT STEP" value="SCOPE NOTE" />
              </div>
            </div>
            <div className="md:col-span-7">
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

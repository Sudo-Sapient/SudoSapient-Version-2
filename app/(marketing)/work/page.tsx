import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/blueprint/SectionHeading";
import { WorkGrid } from "@/components/sections/WorkGrid";
import { projects } from "@/lib/projects";

export const metadata = {
  title: "Work | Sudo Sapient",
  description:
    "Selected work: the AI agents and automations Sudo Sapient has built and handed over to our clients.",
};

export default function WorkIndexPage() {
  return (
    <>
      <section className="bg-blueprint py-16 text-white sm:py-24 md:py-28">
        <Container>
          <SectionHeading
            as="h1"
            index="W"
            eyebrow="ALL WORK"
            title="Systems we've shipped."
            description="Each one a working system we built, tested with the team and handed over."
          />
        </Container>
      </section>

      <section className="bg-offwhite py-12 sm:py-16 md:py-20">
        <Container>
          <WorkGrid projects={projects} />
        </Container>
      </section>
    </>
  );
}

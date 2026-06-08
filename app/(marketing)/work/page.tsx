import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/blueprint/SectionHeading";
import { WorkGrid } from "@/components/sections/WorkGrid";
import { projects } from "@/lib/projects";

export const metadata = {
  title: "Work — Sudo Sapient",
};

export default function WorkIndexPage() {
  return (
    <>
      <section className="bg-blueprint py-24 text-white sm:py-28">
        <Container>
          <SectionHeading
            index="W"
            eyebrow="ALL WORK"
            title="Systems we've shipped."
            description="Each one a working slice of what an AI studio can do in 4–10 weeks."
          />
        </Container>
      </section>

      <section className="bg-offwhite py-20">
        <Container>
          <WorkGrid projects={projects} />
        </Container>
      </section>
    </>
  );
}

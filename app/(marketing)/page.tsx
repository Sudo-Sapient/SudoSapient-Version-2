import { Hero } from "@/components/sections/Hero";
import { Pillars } from "@/components/sections/Pillars";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { FeaturedCaseStudy } from "@/components/sections/FeaturedCaseStudy";
import { Process } from "@/components/sections/Process";
import { Proof } from "@/components/sections/Proof";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Pillars />
      <SelectedWork />
      <FeaturedCaseStudy />
      <Process />
      <Proof />
      <FinalCTA />
    </>
  );
}

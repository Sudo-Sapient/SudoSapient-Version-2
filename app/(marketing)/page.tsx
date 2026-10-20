import { Hero } from "@/components/sections/Hero";
import { Pillars } from "@/components/sections/Pillars";
import { PortfolioSoon } from "@/components/sections/PortfolioSoon";
import { Process } from "@/components/sections/Process";
import { Testimonials } from "@/components/sections/Testimonials";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Pillars />
      <PortfolioSoon />
      <Process />
      <Testimonials />
      <FinalCTA />
    </>
  );
}

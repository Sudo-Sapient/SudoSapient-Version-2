import { PortfolioSoon } from "@/components/sections/PortfolioSoon";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata = {
  title: "Work | Sudo Sapient",
  description: "Our case studies are on the way. Talk to us about what we could automate for you.",
};

// Case studies are coming soon; the /work/[slug] pages stay built but unlinked until then.
export default function WorkIndexPage() {
  return (
    <>
      <PortfolioSoon as="h1" />
      <FinalCTA />
    </>
  );
}

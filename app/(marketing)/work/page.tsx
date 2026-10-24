import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { PortfolioSoon } from "@/components/sections/PortfolioSoon";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata = pageMetadata({
  title: "Our Work | Sudo Sapient",
  description:
    "Case studies of the AI agents and automations Sudo Sapient has built are on the way. Talk to us about what we could automate for your team.",
  path: "/work/",
});

// Case studies are coming soon; the /work/[slug] pages stay built but unlinked until then.
export default function WorkIndexPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema("Work", "/work/")} />
      <PortfolioSoon as="h1" />
      <FinalCTA />
    </>
  );
}

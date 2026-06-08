import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { LadderClimber } from "@/components/scenes/LadderClimber";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <LadderClimber />
      <main>{children}</main>
      <Footer />
    </>
  );
}

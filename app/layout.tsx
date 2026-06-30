import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { BlueprintCursor } from "@/components/cursor/BlueprintCursor";
import { ClientErrorGuard } from "@/components/system/ClientErrorGuard";

// Editorial serif — the eye-catching display face for the wordmark + headings.
const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

// Technical grotesque — body copy.
const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

// CAD annotation mono — pairs with Space Grotesk as a superfamily.
const mono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sudosapient.dev"),
  title: {
    default: "Sudo Sapient",
    template: "%s",
  },
  description:
    "An AI studio that builds AI products, AI automation, and AI media. Working systems in weeks, not quarters.",
  openGraph: {
    title: "Sudo Sapient",
    description:
      "An AI studio that builds AI products, AI automation, and AI media. Working systems in weeks, not quarters.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${grotesk.variable} ${mono.variable}`}>
      <body>
        <ClientErrorGuard />
        {children}
        <BlueprintCursor />
      </body>
    </html>
  );
}

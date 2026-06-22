import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import { BlueprintCursor } from "@/components/cursor/BlueprintCursor";

// Technical grotesque — body + display (used bold/tight for headings).
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
  title: "Sudo Sapient",
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
    <html lang="en" className={`${grotesk.variable} ${mono.variable}`}>
      <body>
        {children}
        <BlueprintCursor />
      </body>
    </html>
  );
}

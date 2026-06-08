import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const interDisplay = Inter({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-inter-display",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sudo Sapient — We build AI systems that automate, create, and scale.",
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
    <html
      lang="en"
      className={`${inter.variable} ${interDisplay.variable} ${mono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}

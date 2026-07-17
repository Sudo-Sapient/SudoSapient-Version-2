import type { Metadata, Viewport } from "next";
import { Archivo, Archivo_Black, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { BlueprintCursor } from "@/components/cursor/BlueprintCursor";
import { ClientErrorGuard } from "@/components/system/ClientErrorGuard";

// Wide industrial display face: blunt, modern, and more ownable than the previous editorial serif.
const display = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

// Calm grotesque for long-form readability and interface copy.
const grotesk = Archivo({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

// Technical annotation face for labels and blueprint metadata.
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl =
  process.env.GITHUB_PAGES === "true"
    ? "https://sudo-sapient.github.io/SudoSapient-Version-2/"
    : "https://sudosapient.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
    siteName: "Sudo Sapient",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Sudo Sapient — production AI systems, shipped in weeks",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sudo Sapient",
    description: "Production AI systems, shipped in weeks.",
    images: ["/opengraph-image"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${grotesk.variable} ${mono.variable}`}
    >
      <body id="top">
        <ClientErrorGuard />
        {children}
        <BlueprintCursor />
      </body>
    </html>
  );
}

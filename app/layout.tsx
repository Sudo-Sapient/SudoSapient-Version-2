import type { Metadata, Viewport } from "next";
import { Archivo, Archivo_Black, IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { BlueprintCursor } from "@/components/cursor/BlueprintCursor";
import { ClientErrorGuard } from "@/components/system/ClientErrorGuard";
import { MotionPrefs } from "@/components/system/MotionPrefs";

// Wide industrial display face
const display = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

// Calm grotesque for readability
const grotesk = Archivo({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
});

// Technical annotation font
// Editorial serif for statement lines (section 1).
const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

// ✅ Always use your custom domain
const siteUrl = "https://sudosapient.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sudo Sapient",
    template: "%s",
  },
  description:
    "We learn how your team really works, then build the AI agents and automations that make it faster, easier and more profitable.",
  openGraph: {
    title: "Sudo Sapient",
    description:
      "We learn how your team really works, then build the AI agents and automations that make it faster, easier and more profitable.",
    url: siteUrl,
    siteName: "Sudo Sapient",
    type: "website",
    images: [
      {
        url: `${siteUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Sudo Sapient, AI transformation for your company",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sudo Sapient",
    description:
      "AI transformation for your company. Sudo Sapient sits with your team and automates the busywork with AI agents.",
    images: [`${siteUrl}/opengraph-image`],
  },
  alternates: {
    canonical: siteUrl,
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
      className={`${display.variable} ${grotesk.variable} ${mono.variable} ${serif.variable}`}
    >
      <body id="top">
        <ClientErrorGuard />
        <MotionPrefs>
          {children}
          <BlueprintCursor />
        </MotionPrefs>
      </body>
    </html>
  );
}

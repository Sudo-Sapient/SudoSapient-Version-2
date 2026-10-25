import type { Metadata, Viewport } from "next";
import { HOME, SITE_NAME, SITE_URL, organizationSchema } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { Analytics } from "@/components/seo/Analytics";
import { Archivo, Archivo_Black, Bricolage_Grotesque, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { BlueprintCursor } from "@/components/cursor/BlueprintCursor";
import { ClientErrorGuard } from "@/components/system/ClientErrorGuard";
import { MotionPrefs } from "@/components/system/MotionPrefs";

// Wide industrial face, kept for the wordmark
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

// Friendly grotesque for headings
const heading = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

// Site wide defaults. Every page sets its own title, description and canonical URL
// through pageMetadata() in lib/seo.ts, so nothing here may hard code a canonical.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: HOME.title, template: "%s" },
  description: HOME.description,
  applicationName: SITE_NAME,
  // Google Search Console ownership check (the same code also works as a DNS TXT record)
  verification: { google: "HRhmj3aqfDDmTIzzkojOUc6sU6K_7iNwcU7sNPhn_dY" },
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
    locale: "en_IN",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: HOME.title }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
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
      className={`${display.variable} ${grotesk.variable} ${mono.variable} ${heading.variable}`}
    >
      <body id="top">
        <JsonLd data={organizationSchema} />
        <Analytics />
        <ClientErrorGuard />
        <MotionPrefs>
          {children}
          <BlueprintCursor />
        </MotionPrefs>
      </body>
    </html>
  );
}

import type { Metadata } from "next";

/**
 * SEO and GEO (answer engine) helpers: per page metadata and the schema.org JSON-LD
 * that tells search engines and AI assistants who Sudo Sapient is and what it does.
 * Keep the facts here in step with the visible copy on the pages.
 */

export const SITE_URL = "https://sudosapient.com";
export const SITE_NAME = "Sudo Sapient";
export const EMAIL = "sudosapient@gmail.com";
export const PHONE = "+91-80500-29848";
export const WHATSAPP_URL = "https://wa.me/918050029848";
export const INSTAGRAM_URL = "https://www.instagram.com/sudo.sapient/";
/** Google Analytics 4 measurement ID ("G-XXXXXXXXXX"). Empty turns analytics off. */
export const GA_ID = "";
export const FOUNDER_LINKEDIN_URL = "https://www.linkedin.com/in/sabari8956/";

/** The homepage's search title and description, also the site wide default. */
export const HOME = {
  title: "AI Agents and Workflow Automation for Businesses | Sudo Sapient",
  description:
    "Sudo Sapient is an AI transformation company in Bangalore, serving India and Dubai. We build AI agents and automations that save your team hours every week.",
};

const OG_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "Sudo Sapient: AI agents and workflow automation for your business",
};

/**
 * Metadata for one page: its own title, description, canonical URL and social card.
 * `path` is the public URL path with the trailing slash the site uses ("/services/").
 */
export function pageMetadata({
  title,
  description,
  path,
  noindex = false,
}: {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      type: "website",
      locale: "en_IN",
      images: [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE.url] },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

const ORG_ID = `${SITE_URL}/#organization`;

// Where we work: based in Bangalore, serving India first, Dubai next, and remote clients anywhere.
const AREA_SERVED = [
  { "@type": "City", name: "Bengaluru" },
  { "@type": "Country", name: "India" },
  { "@type": "City", name: "Dubai" },
  { "@type": "Country", name: "United Arab Emirates" },
  "Worldwide",
];

/** Who we are. Rendered once on every page from the root layout. */
export const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/icon.svg`,
      description:
        "Sudo Sapient is an AI transformation company based in Bangalore, India, working with teams across India, in Dubai and worldwide. We learn how a team really works, then build the AI agents and workflow automations that take the busywork off it.",
      email: EMAIL,
      telephone: PHONE,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bengaluru",
        addressRegion: "Karnataka",
        addressCountry: "IN",
      },
      areaServed: AREA_SERVED,
      knowsAbout: [
        "AI transformation",
        "AI agents",
        "Workflow automation",
        "Business process automation",
        "AI integration in software",
        "Large language models",
      ],
      sameAs: [INSTAGRAM_URL],
      founder: { "@type": "Person", name: "Sabari K", sameAs: [FOUNDER_LINKEDIN_URL] },
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "sales",
          email: EMAIL,
          telephone: PHONE,
          url: WHATSAPP_URL,
          areaServed: ["IN", "AE", "Worldwide"],
          availableLanguage: ["English"],
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      publisher: { "@id": ORG_ID },
      inLanguage: "en",
    },
  ],
};

/** Breadcrumbs: Home, then any parent pages ([name, path] pairs), then this page. */
export const breadcrumbSchema = (name: string, path: string, parents: [string, string][] = []) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [["Home", "/"], ...parents, [name, path]].map(([n, p], i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: n,
    item: `${SITE_URL}${p}`,
  })),
});

/** A service we offer, provided by the organization. */
export const serviceSchema = (name: string, description: string, path?: string) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name,
  ...(path ? { url: `${SITE_URL}${path}` } : {}),
  description,
  serviceType: name,
  provider: { "@id": ORG_ID },
  areaServed: AREA_SERVED,
});

/** FAQPage built from the questions actually shown on the page. */
export const faqSchema = (faqs: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
});

/** The team as Person entries that work for the organization. */
export const teamSchema = (people: { name: string; role: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "AboutPage",
  url: `${SITE_URL}/about/`,
  mainEntity: {
    "@id": ORG_ID,
    employee: people.map(({ name, role }) => ({ "@type": "Person", name, jobTitle: role })),
  },
});

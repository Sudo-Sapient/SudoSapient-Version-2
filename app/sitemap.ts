import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static"; // emitted as a file in the static export

// The public pages, with the trailing slash the site serves. The parked /work/<slug>
// case studies stay out until they are relinked (they are noindex too).
const PAGES: {
  path: string;
  priority: number;
  changeFrequency: "weekly" | "monthly" | "yearly";
}[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/services/", priority: 0.9, changeFrequency: "monthly" },
  { path: "/about/", priority: 0.8, changeFrequency: "monthly" },
  { path: "/contact/", priority: 0.8, changeFrequency: "yearly" },
  { path: "/work/", priority: 0.5, changeFrequency: "monthly" },
  { path: "/privacy/", priority: 0.2, changeFrequency: "yearly" },
  { path: "/terms/", priority: 0.2, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return PAGES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}

/**
 * Client films on the Work page, and their VideoObject schema. Facts come from the
 * approved cuts (~/sudosapient-videos/opsroom and taamul2); keep them in step with the
 * films. Web encodes live in public/media (1080p30 H.264, faststart) with a poster each.
 */
export type Film = {
  slug: string;
  client: string;
  sector: string;
  title: string;
  summary: string;
  facts: string[];
  quote: string;
  quotee: string;
  src: string;
  poster: string;
  /** ISO 8601 duration for schema.org, e.g. "PT1M9S". */
  duration: string;
  uploaded: string;
};

export const FILMS: Film[] = [
  {
    slug: "shipzy",
    client: "Shipzy",
    sector: "Logistics · India",
    title: "The ops room",
    summary:
      "Shipzy's ops team was running shipments across six carrier dashboards, phone calls and years of WhatsApp chats. We put every carrier, shipment and order in one place and gave their WhatsApp an agent that answers the routine questions.",
    facts: [
      "Six carrier dashboards brought into one",
      "Only about 3 in 10 chats now need a person",
      "Two to three hours a day back for three people",
    ],
    quote: "Our people now spend the day on exceptions, not data entry.",
    quotee: "Kishen, Shipzy",
    src: "/media/shipzy.mp4",
    poster: "/media/shipzy-poster.jpg",
    duration: "PT1M9S",
    uploaded: "2026-10-28",
  },
  {
    slug: "taamul",
    client: "Taamul",
    sector: "Credit review · UAE",
    title: "Hiring and credit, in minutes",
    summary:
      "Every new hire and every loan file at Taamul meant days of reading documents one by one. We built HireFast, an applicant tracking system that screens every CV and moves candidates to a shortlist, and a Credit Engine that reads bank statements, checks the numbers and prepares a decision with a clear trail.",
    facts: [
      "Credit checks went from days to minutes",
      "Every CV screened, the shortlist built for you",
      "Each decision keeps an audit trail for the bank partner",
    ],
    quote: "Decisions that took days of manual checks now run on their own with a clear trail.",
    quotee: "Bhoopal, Taamul",
    src: "/media/taamul.mp4",
    poster: "/media/taamul-poster.jpg",
    duration: "PT1M6S",
    uploaded: "2026-10-28",
  },
];

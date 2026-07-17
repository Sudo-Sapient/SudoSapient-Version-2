export type Project = {
  slug: string;
  title: string;
  client: string;
  year: string;
  discipline: "AI Product" | "AI Automation" | "AI Media" | "Web & Brand";
  oneLiner: string;
  problem: string;
  approach: string;
  outcome: string;
  metrics: { label: string; value: string }[];
  isPlaceholder: boolean;
  /** Featured on the home page in the dedicated Case Study section. */
  featured?: boolean;
  /** Hero image path served from /public. */
  image?: string;
  /** External site to open when the hero image is clicked. */
  externalUrl?: string;
};

// TODO: replace placeholder case studies with real ones as they're approved.
export const projects: Project[] = [
  {
    slug: "jgsaw",
    title: "An AI-native GTM engine with one source of truth.",
    client: "Jgsaw",
    year: "2026",
    discipline: "AI Product",
    oneLiner:
      "A B2B 'Control Center' where Core Context — ICP, personas, competitors, brand world — drives every deal, campaign, and asset.",
    problem:
      "GTM teams run on duct-taped intelligence: a slide deck for ICP, a different doc for personas, a wiki for competitors, and none of it lining up with the deals actually open. Jgsaw needed to be a single engine — one where context lived as structured data and pushed into execution in real time, across multiple tenants, each with its own market and its own playbook.",
    approach:
      "We built two coupled layers. An Intelligence layer of six modules — Business Profile, Product Intelligence, ICP, Personas, Competitors, Brand World — that generates and maintains automated context. A Motion layer of five modules that turns that context into deals, campaigns, content, and assets. A 'GTM View' dashboard tracks active accounts (like the Cloudflare deal) end-to-end, and a freshness signal flags stale intelligence so nothing executes off old data.",
    outcome:
      "Jgsaw's customers now read the room before every sales standup. Updating Brand World or Competitive Intel ripples into the Asset Playbook and Campaign Builder instantly — strategy and execution stay in lockstep instead of drifting apart. The engine hit its live deal-tracking milestone the week of May 11, 2026.",
    metrics: [
      { label: "INTELLIGENCE MODULES", value: "6" },
      { label: "EXECUTION MODULES", value: "5" },
      { label: "DELIVERY WINDOW", value: "12 weeks" },
    ],
    isPlaceholder: false,
    image: "/case-studies/jgsaw.jpeg",
  },
  {
    slug: "be-pawsh",
    title: "SudoSapient — voice note in, Reel out.",
    client: "SudoSapient",
    year: "2026",
    discipline: "AI Media",
    oneLiner:
      "A single-call production line that turns a reference link or a voice note into a finished, platform-ready short — no camera, no edit bay.",
    problem:
      "An entrepreneur wanted to grow a niche Instagram page from scratch and refused to spend life behind a camera. Traditional production was too slow to ride trends and too expensive to run at the volume the algorithm rewards. The brief: a fully AI-generated visual and audio stack that still felt premium — not the uncanny-valley filler everyone scrolls past — and a workflow frictionless enough that a voice note could become a post.",
    approach:
      "We built a Single-Call Workflow as the production engine. Client sends a reference link or a voice note; an automated scripting layer turns it into a beat-by-beat narrative; text-to-video and image-to-video models render the visuals against a locked style spec so characters and aesthetic stay consistent across drops; an AI voiceover stack handles the audio; a post layer trims, captions, and outputs Reels and Shorts ready to publish. Prompt engineering, narrative design, and QC sit at every step so 'speed' never trades against 'premium'.",
    outcome:
      "Concept-to-finished cut dropped from days to hours, so the page jumps on viral trends the same hour they break. The entrepreneur runs a consistent posting cadence with no filming, no editor, and no studio — just the production engine, the references they care about, and a single approval step.",
    metrics: [
      { label: "PRODUCTION TIME", value: "Hours" },
      { label: "CAMERA / EDIT BAY", value: "Not required" },
      { label: "HUMAN REVIEW", value: "1 approval" },
    ],
    isPlaceholder: false,
  },
  {
    slug: "mayaakars",
    title: "A digital studio for a design studio.",
    client: "Mayaakars",
    year: "2026",
    discipline: "Web & Brand",
    oneLiner:
      "An end-to-end portfolio platform for a premier architecture and interior design firm — shipped in record time.",
    problem:
      "Mayaakars designs high-end spaces, but their work lived in PDFs and a scattered Instagram grid. The firm operated on a traditional outreach model and had no central place for press, prospects, or partners to see the catalogue at full resolution. They needed a web experience that felt as well-constructed as the rooms they build — and a brand positioned to lead in a digital-first design market without losing the credibility they'd already earned.",
    approach:
      "We ran the project end-to-end: brand positioning, custom website experience design, and the digital-first architecture under it. The build pairs a tuned design system with a portfolio backend sized for hundreds of high-resolution projects, plus intake flows that route inquiries straight to the studio. Every page was designed to feel like a curated room — premium, considered, and built for scale.",
    outcome:
      "Mayaakars moved from traditional outreach to a digital-first brand in weeks. The portfolio launched with the firm's full catalogue and a backend ready to scale as new projects ship — credibility intact, distribution finally unblocked, inquiries now landing in one inbox instead of five.",
    metrics: [
      { label: "DELIVERY", value: "Brand + website" },
      { label: "CONTENT SYSTEM", value: "Portfolio CMS" },
      { label: "LEAD ROUTING", value: "Single intake" },
    ],
    isPlaceholder: false,
    featured: true,
    image: "/case-studies/mayaakars.jpeg",
    externalUrl: "https://www.mayaakars.com/",
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

/**
 * One page per service at /services/<slug>/. Each page targets one search intent and
 * carries its own FAQs (also published as FAQPage schema), so keep answers honest and
 * in step with the privacy and terms pages. Client proof comes from the approved
 * testimonials. Copy rules: no dashes as connectors, no arrows, never "product".
 */

export type ServiceDetail = {
  slug: string;
  /** Artboard in public/rive/services.riv for the hero. */
  artboard: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  handles: { title: string; body: string }[];
  outcome: string;
  proof: string;
  faqs: { q: string; a: string }[];
};

export const SERVICES: ServiceDetail[] = [
  {
    slug: "ai-agents",
    artboard: "Agent",
    name: "AI agents",
    metaTitle: "AI Agents for Business in Bangalore and Dubai | Sudo Sapient",
    metaDescription:
      "Custom AI agents that answer the inbox, chase follow ups, update your CRM and pull data from documents. For teams in Bangalore, across India and in Dubai.",
    h1: "AI agents that do the work your team keeps doing by hand.",
    intro:
      "An AI agent is software that reads, decides and acts inside the tools you already use. We build each agent around one clear job, test it with your team, and keep a person in the loop wherever it matters.",
    handles: [
      {
        title: "Inbox and support",
        body: "Reads incoming email, sorts it, drafts replies and hands the tricky ones to a person.",
      },
      {
        title: "Follow ups and the CRM",
        body: "Chases leads and clients on time and keeps the CRM up to date without anyone typing.",
      },
      {
        title: "Documents",
        body: "Pulls the names, dates and numbers out of invoices, contracts and forms and puts them where they belong.",
      },
      {
        title: "Research and reports",
        body: "Gathers what a report needs and drafts it, ready for a person to check and send.",
      },
    ],
    outcome: "Hours of busywork a week go back to your team.",
    proof:
      "We automated the logistics busywork for Shipzy, so their ops team spends the day on exceptions instead of data entry, and built Taamul an automated credit engine and hiring tool.",
    faqs: [
      {
        q: "What is an AI agent?",
        a: "Software that can read, decide and take actions across your tools, a bit like a teammate who never gets tired of the repetitive parts. It works within limits you set and asks a person when it isn't sure.",
      },
      {
        q: "Which AI models do you use?",
        a: "We pick the model that fits the job and your data rules, from providers such as OpenAI, Anthropic and Google, and agree the choice with you before we build.",
      },
      {
        q: "Will the agent make mistakes?",
        a: "Sometimes, which is why we build in checks and human review where it matters and test every agent with your team before it runs on its own.",
      },
      {
        q: "Can it work with the tools we already use?",
        a: "Usually, yes. We build around your inbox, CRM, spreadsheets and internal apps, and only suggest something new when it clearly pays off.",
      },
    ],
  },
  {
    slug: "workflow-automation",
    artboard: "Flow",
    name: "Workflow automation",
    metaTitle: "Workflow Automation Services in Bangalore | Sudo Sapient",
    metaDescription:
      "Workflow automation that connects your tools: leads into the CRM, reports that build themselves, approvals that reach the right person. India and Dubai.",
    h1: "Your tools, finally talking to each other.",
    intro:
      "Most busywork lives in the gaps between tools: copying a lead into the CRM, rebuilding the same report, chasing an approval. We connect those tools and add AI where a step needs judgement, so the work moves on its own.",
    handles: [
      {
        title: "Leads into the CRM",
        body: "New enquiries from forms, email and ads land in the CRM, sorted and assigned, without anyone copying them over.",
      },
      {
        title: "Invoices and reports",
        body: "The numbers are pulled together on schedule and the invoice or report builds itself.",
      },
      {
        title: "Approvals",
        body: "Requests reach the right person with everything they need to say yes or no, and nothing waits in an inbox.",
      },
      {
        title: "Keeping systems in sync",
        body: "The same customer, order or record stays up to date across every tool, with no double entry.",
      },
    ],
    outcome: "Fewer handoffs, fewer mistakes, faster turnaround.",
    proof:
      "We automated how the Vencuts media agency runs, from briefs to edits to delivery, and the Jgsaw go to market tool from research to outreach.",
    faqs: [
      {
        q: "What is the difference between workflow automation and AI agents?",
        a: "Workflow automation moves work between your tools along a set path. AI agents handle the steps that need reading or judgement. Most of our projects use both together.",
      },
      {
        q: "Do we have to change our tools?",
        a: "Usually not. We build around what you already use, like your inbox, CRM, spreadsheets and internal apps, and only suggest something new when it clearly pays off.",
      },
      {
        q: "How fast will we see results?",
        a: "The audit takes about two weeks. The first pilot is live with your team around two weeks after that.",
      },
      {
        q: "What happens when something breaks?",
        a: "Every automation is built with checks and alerts, and your team learns how to run and fix it before we step back.",
      },
    ],
  },
  {
    slug: "ai-in-your-software",
    artboard: "Button",
    name: "AI in your software",
    metaTitle: "AI Features for Your Software | Sudo Sapient",
    metaDescription:
      "Add AI to your software: an assistant in your app, search and answers over your own data, smart suggestions. Built with your developers; the code is yours.",
    h1: "Smart features your customers will actually use.",
    intro:
      "If you run a software platform, AI can make it do more for every customer. We design and build AI features that fit your app and your data, work alongside your developers, and hand the code over to your team.",
    handles: [
      {
        title: "An assistant inside your app",
        body: "Customers ask in plain words and get help, answers or actions without leaving your app.",
      },
      {
        title: "Search and answers over your data",
        body: "Your documents, records and help pages become something people can simply ask.",
      },
      {
        title: "Smart suggestions",
        body: "The next best step, item or reply, offered where people need it.",
      },
      {
        title: "Summaries and first drafts",
        body: "Long records, tickets or documents turned into short summaries and drafts a person can finish.",
      },
    ],
    outcome: "Software that does more for every customer.",
    proof:
      "We built Fabplay an AI music curator that picks and sequences tracks the way their own team would.",
    faqs: [
      {
        q: "Do we need our own AI team?",
        a: "No. We build it with your developers and leave them able to run and extend it.",
      },
      {
        q: "Who owns what you build?",
        a: "You do. The code, the prompts and the accounts are yours, and we train your team to run it without us.",
      },
      {
        q: "Is our customers' data safe?",
        a: "Your data stays in your accounts wherever we can manage it. We only touch what the feature needs and never use it to train anything.",
      },
    ],
  },
];

export const getService = (slug: string) => SERVICES.find((s) => s.slug === slug);

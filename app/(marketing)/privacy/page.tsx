import { LegalPageLayout } from "@/components/sections/LegalPageLayout";

export const metadata = {
  title: "Privacy | Sudo Sapient",
  description:
    "How Sudo Sapient handles your information on this website and your business data when we automate your workflows.",
};

// Plain-language draft: have it reviewed by a lawyer before relying on it.
export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Privacy policy"
      intro="We spend our days inside other companies' workflows, so we take their data seriously. This page covers what you share on this website and what happens to your business data when we work together."
      updated="21 October 2026"
      summary={[
        "Your data stays yours, and in your own accounts wherever we can manage it.",
        "We never use your data to train AI models, ours or anyone else's.",
        "We only touch what a workflow needs, and our access ends when the work does.",
      ]}
      scene={{
        src: "/rive/services.riv",
        artboard: "Vault",
        alt: "A stickman puts a document into a safe, shuts the door, spins the dial and gives a thumbs up.",
      }}
      sections={[
        [
          "Who we are",
          "Sudo Sapient helps companies with AI transformation. We learn how your team works, then build AI agents and automations that take the busywork off it. This policy covers this website and the work we do for clients.",
        ],
        [
          "What we collect on this website",
          "When you contact us, we collect what you send: your name, work email, company, and what you would like to automate. Our contact form is delivered by a form provider (Formspree) on our behalf. We do not run advertising trackers on this site.",
        ],
        [
          "How we use it",
          "We use it to reply to you, plan a possible engagement, keep basic business records, and keep the site safe from abuse. We do not sell your information or use it for anything else.",
        ],
        [
          "Your business data during an engagement",
          "To audit and automate a workflow we may need to see the data that flows through it, such as emails, documents, records in your CRM, or spreadsheets. We work inside your own accounts and tools wherever possible, ask only for the access a workflow needs, and agree all of this with you in writing before we start. When the work ends, our access is removed.",
        ],
        [
          "AI models and your data",
          "Some automations send data to an AI model to read, sort or write something. We agree with you which model providers are used, and we choose providers and settings that do not use your data to train their models wherever those options exist. We never use your data to train our own models or reuse it for another client.",
        ],
        [
          "Who else handles data",
          "Hosting, email and form providers process some information on our behalf, and any AI model providers we agree with you process data for your automations. Each one only receives what it needs to do its job.",
        ],
        [
          "How long we keep it",
          "Enquiries are kept only as long as reasonably needed for business, legal and security reasons. Data from an engagement is handled as set out in our agreement with you, and is returned or deleted when the work is done.",
        ],
        [
          "Keeping it safe",
          "We keep access tight, use the security features of the tools involved, and limit who on our team can see client data. No system is perfectly secure, but we treat your data the way we would want ours treated.",
        ],
        [
          "Your choices",
          "You can ask us to show, correct or delete the information you have shared with us by emailing sudosapient@gmail.com.",
        ],
        [
          "Changes and contact",
          "If this policy changes, we will update the date at the top of this page. Questions can be sent to sudosapient@gmail.com.",
        ],
      ]}
    />
  );
}

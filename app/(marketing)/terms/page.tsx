import { pageMetadata } from "@/lib/seo";
import { LegalPageLayout } from "@/components/sections/LegalPageLayout";

export const metadata = pageMetadata({
  title: "Terms of Use | Sudo Sapient",
  description:
    "Terms for using the Sudo Sapient website and how our AI transformation engagements work, from audit to pilot to scale.",
  path: "/terms/",
});

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Terms of use"
      intro="How this website works, and the ground rules for working with us when we automate parts of your business with AI."
      updated="21 October 2026"
      summary={[
        "Nothing starts until we both sign a written agreement.",
        "What we build for you is yours: the code, the prompts and the automations.",
        "AI is powerful but not perfect, so we build in checks and you keep the final say.",
      ]}
      scene={{
        src: "/rive/about.riv",
        artboard: "Key",
        alt: "A stickman hands another a key, and he holds it up and jingles it happily.",
      }}
      sections={[
        [
          "About these terms",
          "These terms cover your use of this website. Any work we do together is covered by a separate written agreement, and if the two ever disagree, the agreement wins.",
        ],
        [
          "Using this website",
          "This website explains who we are and how we help companies with AI transformation. Please do not misuse it, interfere with how it runs, or try to access anything you are not meant to.",
        ],
        [
          "Enquiries are not engagements",
          "Getting in touch or talking with us does not make you a client. An engagement starts only when both sides sign a written agreement setting out the scope, timeline and fees.",
        ],
        [
          "How engagements work",
          "We usually start with an audit of how the work really flows, then pilot one fix with your team, then roll out what works. Each step, what it includes and what it costs is agreed in writing before it begins. Timelines depend on your workflows, your tools and how quickly we can get access.",
        ],
        [
          "You own what we build",
          "Once our invoices are paid, the code, prompts, configurations and automations we build for you belong to you, as set out in our agreement. We keep our general know how and any tools we made before or outside your project, and may reuse those for other work.",
        ],
        [
          "AI is powerful, not perfect",
          "AI can misread, miss things or get things wrong. We design automations with checks and human review where it matters, and test them with your team before they run on their own. Decisions made using these systems remain yours.",
        ],
        [
          "Your tools and accounts",
          "Automations often run on tools and AI model providers that have their own terms and usage costs. Those accounts usually belong to you, and their fees are separate from ours unless we agree otherwise.",
        ],
        [
          "Confidentiality",
          "We keep what we learn about your business confidential, and are happy to sign an NDA before an audit. Client names and quotes appear on this website only with permission.",
        ],
        [
          "This website's content",
          "The design, text, animations and code of this website belong to Sudo Sapient or are used with permission. Client names and materials belong to their owners.",
        ],
        [
          "Links and limits",
          "Links to other websites are provided for convenience and are run by their owners, not us. This website is provided as it is, and to the extent the law allows we are not responsible for losses from using it.",
        ],
        ["Contact", "Questions about these terms can be sent to sudosapient@gmail.com."],
      ]}
    />
  );
}

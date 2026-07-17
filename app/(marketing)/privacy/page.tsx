import { LegalPageLayout } from "@/components/sections/LegalPageLayout";

export const metadata = {
  title: "Privacy — Sudo Sapient",
  description: "How Sudo Sapient handles information submitted through this website.",
};

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Privacy policy"
      intro="A clear record of what enters our enquiry workflow, why we use it, and how long it stays there."
      updated="14 JULY 2026"
      variant="privacy"
      sections={[
        [
          "Information we collect",
          "When you use the project enquiry form, we collect the details you submit, such as your name, work email, company, website, budget range, timeline, and project description.",
        ],
        [
          "How we use it",
          "We use this information only to assess and respond to your enquiry, communicate about a potential engagement, maintain business records, and protect the website from abuse.",
        ],
        [
          "Service providers",
          "Form submissions may be processed by infrastructure and email-delivery providers acting on our behalf. We do not sell your personal information.",
        ],
        [
          "Retention",
          "We retain enquiry information only for as long as reasonably necessary for business, legal, and security purposes.",
        ],
        [
          "Your choices",
          "You may ask us to access, correct, or delete information you submitted by emailing sudosapient@gmail.com.",
        ],
        ["Contact", "Questions about this policy can be sent to sudosapient@gmail.com."],
      ]}
    />
  );
}

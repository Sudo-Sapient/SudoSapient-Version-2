import { LegalPageLayout } from "@/components/sections/LegalPageLayout";

export const metadata = {
  title: "Terms — Sudo Sapient",
  description: "Terms for using the Sudo Sapient website.",
};

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Terms of use"
      intro="The operating boundaries for this website, our materials, external services, and the point where an enquiry becomes an engagement."
      updated="14 JULY 2026"
      variant="terms"
      sections={[
        [
          "Website use",
          "This website provides general information about Sudo Sapient and our services. You may not misuse the website, interfere with its operation, or attempt unauthorized access.",
        ],
        [
          "No engagement created",
          "Submitting an enquiry or communicating with us does not create a client relationship. An engagement begins only when both parties sign a written agreement.",
        ],
        [
          "Information and availability",
          "We aim to keep website information accurate, but service descriptions, timelines, availability, and examples may change. Project outcomes depend on scope, inputs, and operating conditions.",
        ],
        [
          "Intellectual property",
          "Unless otherwise stated, the website design, copy, graphics, and code are owned by Sudo Sapient or used with permission. Client names and materials remain the property of their respective owners.",
        ],
        [
          "External links",
          "External websites are controlled by their respective operators. We are not responsible for their content, security, or privacy practices.",
        ],
        ["Contact", "Questions about these terms can be sent to sudosapient@gmail.com."],
      ]}
    />
  );
}

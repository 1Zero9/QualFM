import { LegalPage } from "@/components/site/legal-page";
import { siteContent } from "@/lib/content";

export const metadata = {
  title: "Privacy Policy",
  description: "How QualFM collects, uses and protects your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      hero={siteContent.privacyPolicy.hero}
      sections={siteContent.privacyPolicy.sections}
    />
  );
}

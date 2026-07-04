import { LegalPage } from "@/components/site/legal-page";
import { siteContent } from "@/lib/content";

export const metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for using the QualFM website.",
};

export default function TermsPage() {
  return (
    <LegalPage
      hero={siteContent.termsConditions.hero}
      sections={siteContent.termsConditions.sections}
    />
  );
}

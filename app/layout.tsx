import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.qualfm.ie"),
  title: {
    default: "Facilities Management Services Ireland | QualFM",
    template: "%s | QualFM",
  },
  description:
    "QualFM provides integrated facilities management and maintenance services across Ireland — electrical, mechanical, fitout projects, soft services, and compliance auditing.",
  alternates: { canonical: "./" },
  openGraph: {
    type: "website",
    siteName: "QualFM",
    images: ["/images/og-image.jpg"],
  },
  twitter: { card: "summary_large_image" },
};

const LOCAL_BUSINESS_JSON_LD = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "ProfessionalService"],
  name: "QualFM Ltd",
  url: "https://www.qualfm.ie",
  logo: "https://www.qualfm.ie/images/qualfm-mainlogo-trans.png",
  image: "https://www.qualfm.ie/images/og-image.jpg",
  email: "service@qualfm.ie",
  telephone: "+353-86-821-6215",
  description:
    "QualFM delivers integrated facilities and maintenance services across Ireland, including planned maintenance, electrical and mechanical services, fitout projects, soft services, and compliance auditing.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dublin",
    addressRegion: "Dublin",
    addressCountry: "IE",
  },
  areaServed: { "@type": "Country", name: "Ireland" },
  knowsAbout: [
    "Facilities Management",
    "Planned Preventive Maintenance",
    "Electrical Services",
    "Mechanical Services",
    "Fitout Projects",
    "Compliance Auditing",
    "Soft Services",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(LOCAL_BUSINESS_JSON_LD),
          }}
        />
        {children}
      </body>
    </html>
  );
}

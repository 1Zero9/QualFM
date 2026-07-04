import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import { SectionHeading } from "@/components/site/cards";
import { JsonLd, breadcrumbLd } from "@/components/site/json-ld";
import { siteContent } from "@/lib/content";
import { getPublishedFaqs } from "@/lib/public-queries";

export const metadata = {
  title: "FM & Maintenance Services Ireland | Electrical, Mechanical, Fitout",
  description:
    "QualFM services: integrated FM, planned and reactive maintenance, electrical and mechanical services, fitout projects up to €1.5m, soft services, and compliance auditing across Ireland.",
};

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const content = siteContent.services;
  const faqItems = await getPublishedFaqs();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: content.groups.map((group, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "Service",
              name: group.title,
              description: group.summary,
              provider: { "@id": "https://www.qualfm.ie/#business" },
              areaServed: { "@type": "Country", name: "Ireland" },
            },
          })),
        }}
      />
      {faqItems.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: { "@type": "Answer", text: item.answer },
            })),
          }}
        />
      )}
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />
      <section className="relative isolate overflow-hidden bg-navy py-16">
        <Image
          src="/images/background/stock/shop-fitout2.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-25"
          aria-hidden
        />
        <div className="relative mx-auto max-w-[760px] px-4 text-center">
          <h1 className="text-3xl font-bold text-white md:text-5xl">
            {content.hero.title}
          </h1>
          <p className="mt-3 text-white/85">{content.hero.subtitle}</p>
        </div>
      </section>

      <section className="mx-auto max-w-[1120px] px-4 py-14 md:px-6">
        <SectionHeading title={content.intro.title} intro={content.intro.body} />
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {content.groups.map((group) => (
            <div key={group.id} className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-navy">{group.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/75">{group.summary}</p>
              <ul className="mt-4 space-y-2">
                {group.points.map((point) => (
                  <li key={point.id} className="flex items-start gap-2 text-sm text-ink">
                    <Check size={15} className="mt-0.5 shrink-0 text-forest" aria-hidden />
                    {point.text}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {(content.credentials.items.length > 0 || content.credentials.flags.length > 0) && (
      <section className="bg-teal-soft py-14">
        <div className="mx-auto max-w-[1120px] px-4 md:px-6">
          <SectionHeading title={content.credentials.title} />
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {content.credentials.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-white p-4 text-sm font-semibold text-navy shadow-sm">
                <ShieldCheck size={18} className="shrink-0 text-forest" aria-hidden />
                {item.text}
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {content.credentials.flags.map((flag) => (
              <span key={flag.id} className="rounded-full border border-forest/30 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-forest">
                {flag.text}
              </span>
            ))}
          </div>
        </div>
      </section>
      )}

      {faqItems.length > 0 && (
      <section className="mx-auto max-w-[820px] px-4 py-14 md:px-6">
        <SectionHeading title={content.faq.title} />
        <div className="mt-6 space-y-3">
          {faqItems.map((item) => (
            <details
              key={item.id}
              className="group rounded-2xl border border-ink/10 bg-white shadow-sm open:shadow-md"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-sm font-semibold text-navy [&::-webkit-details-marker]:hidden">
                {item.question}
                <span
                  className="shrink-0 text-forest transition-transform group-open:rotate-45"
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <p className="px-5 pb-5 text-sm leading-relaxed text-ink/75">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </section>
      )}

      <section className="bg-forest py-14 text-center">
        <div className="mx-auto max-w-[720px] px-4">
          <h2 className="text-2xl font-bold text-white md:text-3xl">{content.cta.title}</h2>
          <p className="mt-2 text-white/85">{content.cta.body}</p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold uppercase tracking-wide text-forest transition hover:bg-teal-soft"
          >
            {content.cta.button} <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}

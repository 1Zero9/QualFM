import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/site/cards";
import { siteContent } from "@/lib/content";

export const metadata = {
  title: "About QualFM | Facilities Management Company Ireland",
  description:
    "QualFM is a compliance-led facilities management company based in Dublin, serving commercial, pharmaceutical and healthcare clients across Ireland.",
};

export default function AboutPage() {
  const content = siteContent.about;

  return (
    <>
      <section className="bg-navy py-16 text-center">
        <div className="mx-auto max-w-[760px] px-4">
          <h1 className="text-3xl font-bold uppercase italic text-white md:text-5xl">
            {content.hero.title}
          </h1>
          <p className="mt-3 text-white/80">{content.hero.subtitle}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1120px] grid-cols-1 items-center gap-10 px-4 py-14 md:grid-cols-2 md:px-6">
        <div>
          <SectionHeading title={content.intro.title} />
          <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-ink/85">
            {content.intro.paragraphs.map((p) => (
              <p key={p.id}>{p.text}</p>
            ))}
          </div>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg">
          <Image
            src="/images/background/stock/shop-fitout1.jpg"
            alt="QualFM professional working on a commercial fitout"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-[1120px] px-4 md:px-6">
          <SectionHeading title={content.values.title} />
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {content.values.cards.map((card) => (
              <div key={card.id} className="rounded-2xl border border-ink/10 bg-page p-6">
                <h3 className="text-lg font-bold uppercase italic text-forest">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/80">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1120px] px-4 py-14 md:px-6">
        <SectionHeading title={content.approach.title} />
        <ul className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
          {content.approach.points.map((point) => (
            <li key={point.id} className="flex items-start gap-3 rounded-xl bg-white p-4 text-sm text-ink shadow-sm">
              <span className="mt-0.5 size-2 shrink-0 rounded-full bg-forest" aria-hidden />
              {point.text}
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-teal-soft py-14">
        <div className="mx-auto max-w-[1120px] px-4 md:px-6">
          <SectionHeading title={content.scope.title} />
          <div className="mt-4 max-w-2xl space-y-4 text-[15px] leading-relaxed text-ink/85">
            {content.scope.paragraphs.map((p) => (
              <p key={p.id}>{p.text}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-forest py-14 text-center">
        <h2 className="text-2xl font-bold uppercase italic text-white md:text-3xl">
          {content.cta.title}
        </h2>
        <Link
          href="/contact"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold uppercase tracking-wide text-forest transition hover:bg-teal-soft"
        >
          {content.cta.button} <ArrowRight size={16} />
        </Link>
      </section>
    </>
  );
}

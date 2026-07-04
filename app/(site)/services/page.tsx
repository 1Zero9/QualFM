import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import { SectionHeading } from "@/components/site/cards";
import { siteContent } from "@/lib/content";

export const metadata = {
  title: "FM & Maintenance Services Ireland | Electrical, Mechanical, Fitout",
  description:
    "QualFM services: integrated FM, planned and reactive maintenance, electrical and mechanical services, fitout projects up to €1.5m, soft services, and compliance auditing across Ireland.",
};

export default function ServicesPage() {
  const content = siteContent.services;

  return (
    <>
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
          <h1 className="text-3xl font-bold uppercase italic text-white md:text-5xl">
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
              <h3 className="text-lg font-bold uppercase italic text-navy">{group.title}</h3>
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

      <section className="bg-navy py-14">
        <div className="mx-auto max-w-[1120px] px-4 md:px-6">
          <SectionHeading title={content.credentials.title} light />
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {content.credentials.items.map((item) => (
              <div key={item.id} className="glass-dark flex items-center gap-3 p-4 text-sm font-semibold text-white">
                <ShieldCheck size={18} className="shrink-0 text-emerald-300" aria-hidden />
                {item.text}
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {content.credentials.flags.map((flag) => (
              <span key={flag.id} className="rounded-full border border-white/25 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/85">
                {flag.text}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-forest py-14 text-center">
        <div className="mx-auto max-w-[720px] px-4">
          <h2 className="text-2xl font-bold uppercase italic text-white md:text-3xl">{content.cta.title}</h2>
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

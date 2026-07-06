import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  MapPin,
  Phone,
  ShieldCheck,
  Wrench,
} from "lucide-react";

type TextItem = { id: string; text: string };

export type HeroContent = {
  kicker: string;
  title: string;
  body: string;
  primaryCta: string;
  secondaryCta: string;
  whyTitle: string;
  whyPoints: TextItem[];
  imageUrl: string;
};

const POINT_ICONS = [Wrench, BadgeCheck, MapPin, Phone];

const TRUST_BADGES = ["Safe Electric QC", "F-Gas registered", "Nationwide"];

function WhyList({ points }: { points: TextItem[] }) {
  return (
    <ul className="mt-5 space-y-4">
      {points.map((point, i) => {
        const Icon = POINT_ICONS[i % POINT_ICONS.length];
        const isPhone = /\+\d/.test(point.text);
        return (
          <li key={point.id} className="flex items-start gap-3 text-sm leading-snug">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white text-forest shadow-sm ring-1 ring-forest/15">
              <Icon size={14} aria-hidden />
            </span>
            {isPhone ? (
              <a
                href="tel:+353868216215"
                className="mt-1 font-semibold text-forest underline underline-offset-2 hover:text-forest/80"
              >
                {point.text}
              </a>
            ) : (
              <span className="mt-1 text-ink/85">{point.text}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function Hero({ content }: { content: HeroContent }) {
  return (
    <>
      {/* Single page h1 (visual headings below are decorative duplicates) */}
      <h1 className="sr-only">{content.title}</h1>

      <section className="relative isolate overflow-hidden">
        <Image
          src={content.imageUrl}
          alt="QualFM technicians fitting out a commercial unit"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/25 to-transparent"
          aria-hidden
        />
        <div
          className="absolute inset-0 hidden bg-gradient-to-r from-navy/75 via-navy/30 to-transparent lg:block"
          aria-hidden
        />

        {/* Mobile-only logo plate (desktop header already carries the logo) */}
        <div className="absolute inset-x-0 top-5 flex justify-center lg:hidden">
          <span className="rounded-2xl bg-white/95 px-6 py-4 shadow-lg backdrop-blur-sm">
            <Image
              src="/images/qualfm-logo-tight.png"
              alt=""
              width={312}
              height={104}
              priority
              className="h-[76px] w-auto"
              aria-hidden
            />
          </span>
        </div>

        <div className="relative mx-auto flex min-h-[70svh] max-w-[1120px] flex-col justify-end px-4 pb-8 pt-28 lg:grid lg:min-h-[560px] lg:grid-cols-[1fr_380px] lg:items-center lg:gap-12 lg:px-6 lg:py-16">
          <div>
            {content.kicker && (
              <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-white/90 lg:text-xs">
                <span className="h-0.5 w-7 rounded-full bg-forest" aria-hidden />
                {content.kicker}
              </p>
            )}
            <p
              className="mt-3 text-[2rem] font-bold leading-tight tracking-tight text-white lg:text-5xl"
              aria-hidden
            >
              {content.title}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/85 lg:hidden">
              Facilities management &amp; maintenance across Ireland — planned,
              preventative and reactive.
            </p>
            {content.body && (
              <p className="mt-4 hidden max-w-xl text-lg leading-relaxed text-white/85 lg:block">
                {content.body}
              </p>
            )}
            <div className="mt-5 flex flex-wrap gap-3 lg:mt-8">
              <a
                href="tel:+353868216215"
                className="inline-flex items-center gap-2 rounded-lg bg-forest px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-forest/90"
              >
                <Phone size={16} /> Call us now
              </a>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-navy shadow-md transition hover:bg-teal-soft"
              >
                {content.primaryCta} <ArrowRight size={16} />
              </Link>
            </div>
            <div className="mt-5 flex items-center justify-between gap-2 lg:mt-7 lg:justify-start lg:gap-6">
              {TRUST_BADGES.map((badge) => (
                <span
                  key={badge}
                  className="flex items-center gap-1.5 whitespace-nowrap text-[11px] font-semibold tracking-tight text-white/90 lg:text-xs"
                >
                  <ShieldCheck size={12} className="shrink-0 text-forest" aria-hidden />
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Desktop: Why QualFM card over the photo */}
          {content.whyPoints.length > 0 && (
            <aside className="hidden rounded-2xl bg-white/95 p-7 text-navy shadow-xl backdrop-blur lg:block">
              <h2 className="text-lg font-bold text-navy">{content.whyTitle}</h2>
              <WhyList points={content.whyPoints} />
            </aside>
          )}
        </div>
      </section>

      {/* Mobile: Why QualFM panel below the photo */}
      {content.whyPoints.length > 0 && (
        <section className="border-b border-forest/15 bg-teal-soft p-6 lg:hidden">
          <div className="mx-auto max-w-[1120px]">
            <h2 className="text-lg font-bold text-navy">{content.whyTitle}</h2>
            <WhyList points={content.whyPoints} />
          </div>
        </section>
      )}
    </>
  );
}

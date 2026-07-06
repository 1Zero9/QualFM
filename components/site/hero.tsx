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

export function Hero({ content }: { content: HeroContent }) {
  return (
    <>
      {/* Single page h1 for all breakpoints (visual headings below are breakpoint-specific) */}
      <h1 className="sr-only">{content.title}</h1>

      {/* Mobile: photo-led hero */}
      <section className="relative isolate flex min-h-[70svh] flex-col justify-end overflow-hidden lg:hidden">
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
        <div className="absolute inset-x-0 top-5 flex justify-center">
          <span className="rounded-2xl bg-white/95 px-6 py-4 shadow-lg backdrop-blur-sm">
            <Image
              src="/images/qualfm-logo-tight.png"
              alt="QualFM — Facilities & Maintenance Services"
              width={312}
              height={104}
              priority
              className="h-[76px] w-auto"
            />
          </span>
        </div>
        <div className="relative px-4 pb-8 pt-28">
          {content.kicker && (
            <p className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-white/90">
              <span className="h-0.5 w-7 rounded-full bg-forest" aria-hidden />
              {content.kicker}
            </p>
          )}
          <p className="mt-3 text-[2rem] font-bold leading-tight tracking-tight text-white" aria-hidden>
            {content.title}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-white/85">
            Facilities management &amp; maintenance across Ireland — planned,
            preventative and reactive.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="tel:+353868216215"
              className="inline-flex items-center gap-2 rounded-lg bg-forest px-6 py-3.5 text-sm font-semibold text-white shadow-md"
            >
              <Phone size={16} /> Call us now
            </a>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-navy shadow-md"
            >
              {content.primaryCta} <ArrowRight size={16} />
            </Link>
          </div>
          <div className="mt-5 flex items-center justify-between gap-2">
            {TRUST_BADGES.map((badge) => (
              <span
                key={badge}
                className="flex items-center gap-1.5 whitespace-nowrap text-[11px] font-semibold tracking-tight text-white/90"
              >
                <ShieldCheck size={12} className="shrink-0 text-forest" aria-hidden />
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1120px] grid-cols-1 lg:grid-cols-[1fr_360px] lg:gap-6 lg:px-6 lg:py-8">
        {/* Desktop: light card hero */}
        <div className="relative hidden overflow-hidden rounded-2xl border border-ink/10 bg-white p-8 shadow-sm md:p-12 lg:block">
          <div
            className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-teal-soft blur-3xl"
            aria-hidden
          />
          <Image
            src="/images/van.png"
            alt=""
            width={960}
            height={540}
            className="pointer-events-none absolute right-0 top-1/2 w-2/3 -translate-y-1/2 opacity-15 select-none [mask-image:linear-gradient(to_left,black_40%,transparent)]"
            aria-hidden
          />
          <div className="relative max-w-xl">
            {content.kicker && (
              <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-forest">
                <span className="h-0.5 w-8 rounded-full bg-forest" aria-hidden />
                {content.kicker}
              </p>
            )}
            <p className="mt-4 text-4xl font-bold leading-tight tracking-tight text-navy md:text-5xl" aria-hidden>
              {content.title}
            </p>
            {content.body && (
              <p className="mt-4 text-base leading-relaxed text-ink/75 md:text-lg">
                {content.body}
              </p>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-lg bg-forest px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-forest/90 hover:shadow-md"
              >
                {content.primaryCta} <ArrowRight size={16} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-lg border border-forest/25 bg-teal-soft px-6 py-3 text-sm font-semibold text-forest transition hover:bg-teal-soft/70"
              >
                {content.secondaryCta}
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-ink/10 pt-5">
              {TRUST_BADGES.map((badge) => (
                <span
                  key={badge}
                  className="flex items-center gap-1.5 text-xs font-semibold text-ink/70"
                >
                  <ShieldCheck size={13} className="text-forest" aria-hidden />
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Why QualFM panel (both breakpoints) */}
        {content.whyPoints.length > 0 && (
      <aside className="relative overflow-hidden border-b border-forest/15 bg-teal-soft p-6 text-navy shadow-sm lg:rounded-2xl lg:border lg:p-7">
          <div
            className="pointer-events-none absolute -bottom-16 -right-16 size-48 rounded-full bg-white/60 blur-2xl"
            aria-hidden
          />
          <h2 className="text-lg font-bold text-navy">{content.whyTitle}</h2>
          <ul className="relative mt-5 space-y-4">
            {content.whyPoints.map((point, i) => {
              const Icon = POINT_ICONS[i % POINT_ICONS.length];
              const isPhone = /\+\d/.test(point.text);
              return (
                <li key={point.id} className="flex items-start gap-3 text-sm leading-snug">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-white text-forest shadow-sm">
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
        </aside>
        )}
      </section>
    </>
  );
}

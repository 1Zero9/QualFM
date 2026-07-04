/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowRight, BadgeCheck, MapPin, Phone, Wrench } from "lucide-react";
import { Hero } from "@/components/site/hero";
import {
  JobCard,
  NoticeCard,
  SectionHeading,
  TestimonialCard,
} from "@/components/site/cards";
import { siteContent } from "@/lib/content";
import {
  getActiveHeroSlides,
  getFeaturedJobs,
  getPublishedTestimonials,
  getRotationSeconds,
  getSpotlightNotices,
} from "@/lib/public-queries";

export const dynamic = "force-dynamic";

const POINT_ICONS = [Wrench, BadgeCheck, MapPin, Phone];

export default async function HomePage() {
  const content = siteContent.home;
  const [slides, rotationSeconds, spotlight, featuredJobs, publishedTestimonials] =
    await Promise.all([
      getActiveHeroSlides(),
      getRotationSeconds(),
      getSpotlightNotices(),
      getFeaturedJobs(3),
      getPublishedTestimonials(),
    ]);

  return (
    <>
      <Hero slides={slides} rotationSeconds={rotationSeconds} />

      {/* Why QualFM strip */}
      <section className="border-b border-ink/10 bg-white">
        <div className="mx-auto grid max-w-[1120px] grid-cols-1 gap-3 px-4 py-8 sm:grid-cols-2 md:px-6 lg:grid-cols-4">
          {content.hero.whyPoints.slice(0, 4).map((point, i) => {
            const Icon = POINT_ICONS[i % POINT_ICONS.length];
            const isPhone = /\+\d/.test(point.text);
            return (
              <div key={point.id} className="flex items-center gap-3 text-sm font-medium text-ink">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-teal-soft text-forest">
                  <Icon size={16} />
                </span>
                {isPhone ? (
                  <a href="tel:+353868216215" className="hover:text-forest">{point.text}</a>
                ) : (
                  point.text
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Spotlight notices */}
      {spotlight.length > 0 && (
        <section className="mx-auto max-w-[1120px] px-4 py-14 md:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading title="Latest from QualFM" />
            <Link href="/news" className="flex items-center gap-1 text-sm font-bold uppercase tracking-wide text-forest hover:underline">
              See all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
            {spotlight.slice(0, 3).map((n) => (
              <NoticeCard key={n.id} notice={n} />
            ))}
          </div>
        </section>
      )}

      {/* Core services */}
      <section className="bg-navy py-14">
        <div className="mx-auto max-w-[1120px] px-4 md:px-6">
          <SectionHeading title={content.coreServices.title} light />
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {content.coreServices.pillars.map((pillar) => (
              <Link
                key={pillar.id}
                href="/services"
                className="glass-dark group flex items-center justify-between gap-3 p-5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                {pillar.text}
                <ArrowRight size={16} className="shrink-0 text-emerald-300 transition group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors */}
      <section className="mx-auto max-w-[1120px] px-4 py-14 md:px-6">
        <SectionHeading title={content.sectors.title} intro={content.sectors.intro} />
        <div className="mt-6 flex flex-wrap gap-2">
          {content.sectors.tags.map((sector) => (
            <span key={sector.id} className="rounded-full border border-forest/30 bg-teal-soft px-4 py-1.5 text-sm font-semibold text-forest">
              {sector.text}
            </span>
          ))}
        </div>
      </section>

      {/* Latest projects */}
      {featuredJobs.length > 0 && (
        <section className="bg-white py-14">
          <div className="mx-auto max-w-[1120px] px-4 md:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                title="Recent projects"
                intro="A sample of recently completed work across Ireland."
              />
              <Link href="/projects" className="flex items-center gap-1 text-sm font-bold uppercase tracking-wide text-forest hover:underline">
                All projects <ArrowRight size={14} />
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
              {featuredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {publishedTestimonials.length > 0 && (
        <section className="mx-auto max-w-[1120px] px-4 py-14 md:px-6">
          <SectionHeading title={content.feedback.title} intro={content.feedback.intro} />
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
            {publishedTestimonials.slice(0, 3).map((t) => (
              <TestimonialCard key={t.id} t={t} />
            ))}
          </div>
        </section>
      )}

      {/* Trust + stats */}
      <section className="bg-teal-soft py-14">
        <div className="mx-auto max-w-[1120px] px-4 md:px-6">
          <SectionHeading title={content.trust.title} />
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { value: "25+", label: "Years sector experience" },
              { value: "Nationwide", label: "Coverage across Ireland" },
              { value: "€1.5m", label: "Fitout project delivery" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-white p-6 text-center shadow-sm">
                <p className="text-3xl font-bold text-navy">{stat.value}</p>
                <p className="mt-1 text-sm text-ink/70">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {content.trust.points.map((point) => (
              <span key={point.id} className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-navy shadow-sm">
                {point.text}
              </span>
            ))}
          </div>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-ink/80">{content.trust.closing}</p>
          <Link href="/about" className="mt-2 inline-flex items-center gap-1 text-sm font-bold uppercase tracking-wide text-forest hover:underline">
            {content.trust.linkText} <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Clients */}
      <section className="mx-auto max-w-[1120px] px-4 py-14 md:px-6">
        <SectionHeading title={content.clients.title} intro={content.clients.intro} />
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {siteContent.clients.map((client) => (
            <a
              key={client.id}
              href={client.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${client.name}`}
              title={client.name}
              className="flex h-24 items-center justify-center rounded-2xl border border-ink/10 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <img src={client.logoSrc} alt={client.logoAlt} loading="lazy" className="max-h-12 max-w-full object-contain" />
            </a>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest py-14 text-center">
        <div className="mx-auto max-w-[720px] px-4">
          <h2 className="text-2xl font-bold uppercase italic text-white md:text-3xl">
            Ready to work together?
          </h2>
          <p className="mt-2 text-white/85">
            Talk to us about planned maintenance, reactive support or your next fitout project.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-bold uppercase tracking-wide text-forest transition hover:bg-teal-soft"
          >
            Get in touch <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}

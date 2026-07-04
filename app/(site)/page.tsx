/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import { Hero } from "@/components/site/hero";
import {
  JobCard,
  NoticeCard,
  SectionHeading,
  TestimonialCard,
} from "@/components/site/cards";
import { siteContent } from "@/lib/content";
import {
  getFeaturedJobs,
  getHeroContent,
  getPublishedClients,
  getPublishedTestimonials,
  getSpotlightNotices,
} from "@/lib/public-queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = siteContent.home;
  const [hero, spotlight, featuredJobs, publishedTestimonials, clientList] =
    await Promise.all([
      getHeroContent(),
      getSpotlightNotices(),
      getFeaturedJobs(3),
      getPublishedTestimonials(),
      getPublishedClients(),
    ]);

  return (
    <>
      <Hero content={hero} />

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
      <section className="py-14">
        <div className="mx-auto max-w-[1120px] px-4 md:px-6">
          <SectionHeading title={content.coreServices.title} />
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {content.coreServices.pillars.map((pillar) => (
              <Link
                key={pillar.id}
                href="/services"
                className="group flex items-center justify-between gap-3 rounded-2xl border border-ink/10 bg-white p-5 text-sm font-semibold text-navy shadow-sm transition hover:-translate-y-0.5 hover:border-forest/40 hover:shadow-md"
              >
                {pillar.text}
                <ArrowRight size={16} className="shrink-0 text-forest transition group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Sectors */}
      {content.sectors.tags.length > 0 && (
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
      )}

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
      {clientList.length > 0 && (
      <section className="mx-auto max-w-[1120px] px-4 py-14 md:px-6">
        <SectionHeading title={content.clients.title} intro={content.clients.intro} />
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {clientList.map((client) => (
            <a
              key={client.id}
              href={client.websiteUrl || undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${client.name}`}
              title={client.name}
              className="flex h-24 items-center justify-center rounded-2xl border border-ink/10 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <img src={client.logoUrl} alt={`${client.name} logo`} loading="lazy" className="max-h-12 max-w-full object-contain" />
            </a>
          ))}
        </div>
      </section>
      )}

      {/* CTA */}
      <section className="mx-auto max-w-[1120px] px-4 pb-14 md:px-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy to-forest px-6 py-12 text-center shadow-sm md:px-12 md:py-14">
          <div
            className="pointer-events-none absolute -left-16 -top-16 size-56 rounded-full bg-white/10 blur-2xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-20 -right-12 size-64 rounded-full bg-forest/40 blur-3xl"
            aria-hidden
          />
          <div className="relative">
            <h2 className="text-2xl font-bold text-white md:text-3xl">
              Ready to work together?
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-white/85">
              Talk to us about planned maintenance, reactive support or your next
              fitout project.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-7 py-3.5 text-sm font-semibold text-navy shadow-md transition hover:bg-teal-soft"
              >
                Get in touch <ArrowRight size={16} />
              </Link>
              <a
                href="tel:+353868216215"
                className="inline-flex items-center gap-2 rounded-lg border border-white/40 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                <Phone size={16} /> +353 86 821 6215
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

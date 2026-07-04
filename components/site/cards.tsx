import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Quote, Star } from "lucide-react";
import type { jobs, notices, testimonials } from "@/lib/db";

export function SectionHeading({
  title,
  intro,
  light = false,
}: {
  title: string;
  intro?: string;
  light?: boolean;
}) {
  return (
    <div className="max-w-2xl">
      <h2
        className={`text-2xl font-bold uppercase italic tracking-tight md:text-3xl ${
          light ? "text-white" : "text-navy"
        }`}
      >
        {title}
      </h2>
      {intro && (
        <p className={`mt-2 text-sm md:text-base ${light ? "text-white/75" : "text-ink/70"}`}>
          {intro}
        </p>
      )}
    </div>
  );
}

export function NoticeCard({ notice }: { notice: typeof notices.$inferSelect }) {
  return (
    <Link
      href={`/news/${notice.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      {notice.imageUrl && (
        <div className="relative h-44 w-full">
          <Image
            src={notice.imageUrl}
            alt=""
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap gap-2">
          <span
            className={`rounded px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${
              notice.type === "campaign"
                ? "bg-forest text-white"
                : "bg-teal-soft text-forest"
            }`}
          >
            {notice.type}
          </span>
          <span className="rounded bg-ink/5 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-ink/60">
            {notice.label}
          </span>
        </div>
        <h3 className="mt-3 text-lg font-bold leading-snug text-navy group-hover:underline">
          {notice.title}
        </h3>
        <p className="mt-auto pt-3 text-xs text-ink/50">
          {(notice.publishFrom ?? notice.createdAt).toLocaleDateString("en-IE", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>
    </Link>
  );
}

export function JobCard({ job }: { job: typeof jobs.$inferSelect }) {
  const image = job.imageUrls[0];
  return (
    <Link
      href={`/projects/${job.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      {image && (
        <div className="relative h-44 w-full">
          <Image
            src={image}
            alt=""
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5">
        <span className="self-start rounded bg-teal-soft px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-forest">
          {job.sector || "Project"}
        </span>
        <h3 className="mt-3 text-lg font-bold leading-snug text-navy group-hover:underline">
          {job.title}
        </h3>
        {job.summary && (
          <p className="mt-2 line-clamp-2 text-sm text-ink/70">{job.summary}</p>
        )}
        <p className="mt-auto flex items-center gap-1 pt-3 text-xs font-semibold uppercase tracking-wide text-forest">
          View project <ArrowRight size={13} />
        </p>
      </div>
    </Link>
  );
}

export function TestimonialCard({
  t,
}: {
  t: typeof testimonials.$inferSelect;
}) {
  return (
    <figure className="flex flex-col rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
      <div className="flex gap-0.5 text-amber-400" aria-hidden>
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={14} fill="currentColor" />
        ))}
      </div>
      <Quote size={18} className="mt-3 text-forest" aria-hidden />
      <blockquote className="mt-2 flex-1 text-sm leading-relaxed text-ink">
        {t.quote}
      </blockquote>
      <figcaption className="mt-4">
        <p className="text-sm font-bold text-navy">{t.author}</p>
        {t.company && <p className="text-xs text-ink/60">{t.company}</p>}
      </figcaption>
    </figure>
  );
}

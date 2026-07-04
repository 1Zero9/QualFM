import Link from "next/link";
import { count, eq } from "drizzle-orm";
import { db, heroSlides, jobs, notices, testimonials } from "@/lib/db";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const [slideCount] = await db
    .select({ n: count() })
    .from(heroSlides)
    .where(eq(heroSlides.active, true));
  const [noticeCount] = await db
    .select({ n: count() })
    .from(notices)
    .where(eq(notices.status, "published"));
  const [testimonialCount] = await db
    .select({ n: count() })
    .from(testimonials)
    .where(eq(testimonials.published, true));
  const [draftTestimonials] = await db
    .select({ n: count() })
    .from(testimonials)
    .where(eq(testimonials.published, false));
  const [jobCount] = await db
    .select({ n: count() })
    .from(jobs)
    .where(eq(jobs.published, true));

  const cards = [
    { label: "Active hero slides", value: slideCount.n, href: "/admin/hero" },
    { label: "Published notices", value: noticeCount.n, href: "/admin/noticeboard" },
    { label: "Published testimonials", value: testimonialCount.n, href: "/admin/testimonials" },
    { label: "Published jobs", value: jobCount.n, href: "/admin/jobs" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold italic uppercase text-navy">Dashboard</h1>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-xl border border-ink/10 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <p className="text-3xl font-bold text-navy">{card.value}</p>
            <p className="mt-1 text-sm text-ink/70">{card.label}</p>
          </Link>
        ))}
      </div>
      {draftTestimonials.n > 0 && (
        <div className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <strong>{draftTestimonials.n} testimonial(s) are unpublished.</strong>{" "}
          The original site testimonials were seeded as drafts because their
          provenance was flagged in the July 2026 audit — verify them with
          Richard, then publish or replace.{" "}
          <Link href="/admin/testimonials" className="font-semibold underline">
            Review now
          </Link>
        </div>
      )}
      <p className="mt-8 text-sm text-ink/60">
        View the live site at{" "}
        <a href="/" className="text-forest underline" target="_blank">
          qualfm.ie
        </a>
        . Changes here appear on the site immediately after saving.
      </p>
    </div>
  );
}

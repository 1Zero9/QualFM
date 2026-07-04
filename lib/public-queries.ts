import { and, asc, desc, eq, gt, isNull, lt, or } from "drizzle-orm";
import { db, heroSlides, jobs, notices, settings, testimonials } from "@/lib/db";

export async function getActiveHeroSlides() {
  return db
    .select()
    .from(heroSlides)
    .where(eq(heroSlides.active, true))
    .orderBy(asc(heroSlides.sort));
}

function liveNoticeFilter() {
  const now = new Date();
  return and(
    eq(notices.status, "published"),
    or(isNull(notices.publishFrom), lt(notices.publishFrom, now)),
    or(isNull(notices.publishTo), gt(notices.publishTo, now))
  );
}

export async function getLiveNotices() {
  return db
    .select()
    .from(notices)
    .where(liveNoticeFilter())
    .orderBy(desc(notices.pinned), desc(notices.createdAt));
}

export async function getSpotlightNotices() {
  return db
    .select()
    .from(notices)
    .where(and(liveNoticeFilter(), eq(notices.spotlight, true)))
    .orderBy(desc(notices.pinned), desc(notices.createdAt))
    .limit(5);
}

export async function getLiveNoticeBySlug(slug: string) {
  const [notice] = await db
    .select()
    .from(notices)
    .where(and(liveNoticeFilter(), eq(notices.slug, slug)))
    .limit(1);
  return notice ?? null;
}

export async function getPublishedTestimonials() {
  return db
    .select()
    .from(testimonials)
    .where(eq(testimonials.published, true))
    .orderBy(desc(testimonials.spotlight), asc(testimonials.sort));
}

export async function getPublishedJobs() {
  return db
    .select()
    .from(jobs)
    .where(eq(jobs.published, true))
    .orderBy(desc(jobs.featured), desc(jobs.completedAt), desc(jobs.createdAt));
}

export async function getFeaturedJobs(limit = 3) {
  const all = await getPublishedJobs();
  return all.slice(0, limit);
}

export async function getPublishedJobBySlug(slug: string) {
  const [job] = await db
    .select()
    .from(jobs)
    .where(and(eq(jobs.published, true), eq(jobs.slug, slug)))
    .limit(1);
  return job ?? null;
}

export async function getRotationSeconds(): Promise<number> {
  const [row] = await db
    .select()
    .from(settings)
    .where(eq(settings.key, "spotlight_rotation_seconds"));
  const parsed = Number(row?.value ?? 8);
  return Number.isFinite(parsed) ? Math.min(30, Math.max(3, parsed)) : 8;
}

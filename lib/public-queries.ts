import { and, asc, desc, eq, gt, isNull, lt, or } from "drizzle-orm";
import { clients, db, faqs, jobs, notices, settings, testimonials } from "@/lib/db";
import { siteContent } from "@/lib/content";

export type PublicFaq = { id: number | string; question: string; answer: string };

export async function getPublishedFaqs(): Promise<PublicFaq[]> {
  const rows = await db
    .select()
    .from(faqs)
    .where(eq(faqs.published, true))
    .orderBy(asc(faqs.sort), asc(faqs.id));
  if (rows.length > 0) return rows;
  return siteContent.services.faq.items;
}

export type PublicClient = {
  id: number | string;
  name: string;
  websiteUrl: string;
  logoUrl: string;
};

export async function getPublishedClients(): Promise<PublicClient[]> {
  const rows = await db
    .select()
    .from(clients)
    .where(eq(clients.published, true))
    .orderBy(asc(clients.sort), asc(clients.id));
  if (rows.length > 0) return rows;
  return siteContent.clients.map((c) => ({
    id: c.id,
    name: c.name,
    websiteUrl: c.websiteUrl,
    logoUrl: c.logoSrc,
  }));
}

export type HeroOverrides = {
  kicker: string;
  title: string;
  body: string;
  imageUrl: string;
};

const DEFAULT_HERO_IMAGE = "/images/hero/qualfm-fitout.jpg";

export async function getHeroContent() {
  const defaults = siteContent.home.hero;
  const [row] = await db
    .select()
    .from(settings)
    .where(eq(settings.key, "hero_content"));
  let overrides: Partial<HeroOverrides> = {};
  try {
    overrides = row ? JSON.parse(row.value) : {};
  } catch {
    overrides = {};
  }
  return {
    ...defaults,
    kicker: overrides.kicker || defaults.kicker,
    title: overrides.title || defaults.title,
    body: overrides.body || defaults.body,
    imageUrl: overrides.imageUrl || DEFAULT_HERO_IMAGE,
  };
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


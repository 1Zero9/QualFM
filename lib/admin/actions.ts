"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { put } from "@vercel/blob";
import {
  db,
  heroSlides,
  jobs,
  notices,
  settings,
  testimonials,
} from "@/lib/db";
import { getSession } from "@/lib/auth/session";

async function assertAdmin() {
  const session = await getSession();
  if (!session) throw new Error("Not authenticated");
  return session;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function text(form: FormData, key: string): string {
  return String(form.get(key) ?? "").trim();
}

function optionalDate(form: FormData, key: string): Date | null {
  const value = text(form, key);
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

async function maybeUploadImage(
  form: FormData,
  folder: string
): Promise<string | null> {
  const file = form.get("imageFile");
  if (file instanceof File && file.size > 0) {
    if (file.size > 8 * 1024 * 1024) throw new Error("Image too large (max 8 MB)");
    if (!file.type.startsWith("image/")) throw new Error("Not an image");
    const safeName = slugify(file.name.replace(/\.[^.]+$/, "")) || "image";
    const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
    const blob = await put(`${folder}/${Date.now()}-${safeName}.${ext}`, file, {
      access: "public",
    });
    return blob.url;
  }
  const url = text(form, "imageUrl");
  return url || null;
}

function refreshPublic() {
  revalidatePath("/", "layout");
}

/* ---------------- Hero ---------------- */

export async function saveHeroSlide(form: FormData) {
  await assertAdmin();
  const id = Number(form.get("id") || 0);
  const imageUrl = await maybeUploadImage(form, "hero");
  const values = {
    kicker: text(form, "kicker"),
    title: text(form, "title"),
    subtitle: text(form, "subtitle"),
    ctaLabel: text(form, "ctaLabel"),
    ctaHref: text(form, "ctaHref"),
    sort: Number(form.get("sort") || 0),
    active: form.get("active") === "on",
    updatedAt: new Date(),
  };
  if (!values.title) throw new Error("Title is required");

  if (id) {
    await db
      .update(heroSlides)
      .set(imageUrl ? { ...values, imageUrl } : values)
      .where(eq(heroSlides.id, id));
  } else {
    if (!imageUrl) throw new Error("An image is required for a new slide");
    await db.insert(heroSlides).values({ ...values, imageUrl });
  }
  refreshPublic();
  redirect("/admin/hero");
}

export async function toggleHeroSlide(id: number, active: boolean) {
  await assertAdmin();
  await db
    .update(heroSlides)
    .set({ active, updatedAt: new Date() })
    .where(eq(heroSlides.id, id));
  refreshPublic();
}

export async function deleteHeroSlide(id: number) {
  await assertAdmin();
  await db.delete(heroSlides).where(eq(heroSlides.id, id));
  refreshPublic();
}

/* ---------------- Notices ---------------- */

export async function saveNotice(form: FormData) {
  await assertAdmin();
  const id = Number(form.get("id") || 0);
  const title = text(form, "title");
  if (!title) throw new Error("Title is required");
  const imageUrl = await maybeUploadImage(form, "notices");

  const values = {
    type: (text(form, "type") === "campaign" ? "campaign" : "news") as
      | "news"
      | "campaign",
    label: text(form, "label") || "Company update",
    title,
    bodyMd: text(form, "bodyMd"),
    publishFrom: optionalDate(form, "publishFrom"),
    publishTo: optionalDate(form, "publishTo"),
    pinned: form.get("pinned") === "on",
    spotlight: form.get("spotlight") === "on",
    status: (text(form, "status") === "published" ? "published" : "draft") as
      | "draft"
      | "published",
    updatedAt: new Date(),
  };

  if (id) {
    await db
      .update(notices)
      .set(imageUrl ? { ...values, imageUrl } : values)
      .where(eq(notices.id, id));
  } else {
    let slug = slugify(title);
    const clash = await db
      .select({ id: notices.id })
      .from(notices)
      .where(eq(notices.slug, slug));
    if (clash.length > 0) slug = `${slug}-${Date.now().toString(36)}`;
    await db.insert(notices).values({ ...values, slug, imageUrl });
  }
  refreshPublic();
  redirect("/admin/noticeboard");
}

export async function deleteNotice(id: number) {
  await assertAdmin();
  await db.delete(notices).where(eq(notices.id, id));
  refreshPublic();
}

/* ---------------- Testimonials ---------------- */

export async function saveTestimonial(form: FormData) {
  await assertAdmin();
  const id = Number(form.get("id") || 0);
  const values = {
    quote: text(form, "quote"),
    author: text(form, "author"),
    company: text(form, "company"),
    sort: Number(form.get("sort") || 0),
    updatedAt: new Date(),
  };
  if (!values.quote || !values.author) throw new Error("Quote and author required");

  if (id) {
    await db.update(testimonials).set(values).where(eq(testimonials.id, id));
  } else {
    await db.insert(testimonials).values(values);
  }
  refreshPublic();
  redirect("/admin/testimonials");
}

export async function setTestimonialFlags(
  id: number,
  flags: { published?: boolean; spotlight?: boolean }
) {
  await assertAdmin();
  await db
    .update(testimonials)
    .set({ ...flags, updatedAt: new Date() })
    .where(eq(testimonials.id, id));
  refreshPublic();
}

export async function deleteTestimonial(id: number) {
  await assertAdmin();
  await db.delete(testimonials).where(eq(testimonials.id, id));
  refreshPublic();
}

/* ---------------- Jobs ---------------- */

export async function saveJob(form: FormData) {
  await assertAdmin();
  const id = Number(form.get("id") || 0);
  const title = text(form, "title");
  if (!title) throw new Error("Title is required");
  const imageUrl = await maybeUploadImage(form, "jobs");

  const values = {
    title,
    client: text(form, "client"),
    sector: text(form, "sector"),
    summary: text(form, "summary"),
    bodyMd: text(form, "bodyMd"),
    completedAt: optionalDate(form, "completedAt"),
    published: form.get("published") === "on",
    featured: form.get("featured") === "on",
    updatedAt: new Date(),
  };

  if (id) {
    const [existing] = await db
      .select({ imageUrls: jobs.imageUrls })
      .from(jobs)
      .where(eq(jobs.id, id));
    const imageUrls = imageUrl
      ? [imageUrl, ...(existing?.imageUrls ?? [])].slice(0, 6)
      : existing?.imageUrls ?? [];
    await db.update(jobs).set({ ...values, imageUrls }).where(eq(jobs.id, id));
  } else {
    let slug = slugify(title);
    const clash = await db
      .select({ id: jobs.id })
      .from(jobs)
      .where(eq(jobs.slug, slug));
    if (clash.length > 0) slug = `${slug}-${Date.now().toString(36)}`;
    await db
      .insert(jobs)
      .values({ ...values, slug, imageUrls: imageUrl ? [imageUrl] : [] });
  }
  refreshPublic();
  redirect("/admin/jobs");
}

export async function deleteJob(id: number) {
  await assertAdmin();
  await db.delete(jobs).where(eq(jobs.id, id));
  refreshPublic();
}

/* ---------------- Settings ---------------- */

export async function saveRotationSeconds(form: FormData) {
  await assertAdmin();
  const seconds = Math.min(30, Math.max(3, Number(form.get("seconds") || 8)));
  await db
    .insert(settings)
    .values({ key: "spotlight_rotation_seconds", value: String(seconds) })
    .onConflictDoUpdate({
      target: settings.key,
      set: { value: String(seconds), updatedAt: new Date() },
    });
  refreshPublic();
}

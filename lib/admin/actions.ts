"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { put } from "@vercel/blob";
import {
  clients,
  db,
  faqs,
  jobs,
  notices,
  settings,
  testimonials,
} from "@/lib/db";
import { getSession } from "@/lib/auth/session";
import { pingIndexNow } from "@/lib/indexnow";

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
  pingIndexNow();
}

/* ---------------- Homepage hero ---------------- */

export async function saveHeroContent(form: FormData) {
  await assertAdmin();
  const imageUrl = await maybeUploadImage(form, "hero");

  const [existing] = await db
    .select()
    .from(settings)
    .where(eq(settings.key, "hero_content"));
  let current: Record<string, string> = {};
  try {
    current = existing ? JSON.parse(existing.value) : {};
  } catch {
    current = {};
  }

  const value = JSON.stringify({
    kicker: text(form, "kicker"),
    title: text(form, "title"),
    body: text(form, "body"),
    imageUrl: imageUrl || current.imageUrl || "",
  });

  await db
    .insert(settings)
    .values({ key: "hero_content", value })
    .onConflictDoUpdate({
      target: settings.key,
      set: { value, updatedAt: new Date() },
    });
  refreshPublic();
  redirect("/admin/hero");
}

/* ---------------- FAQs ---------------- */

export async function saveFaq(form: FormData) {
  await assertAdmin();
  const id = Number(form.get("id") || 0);
  const values = {
    question: text(form, "question"),
    answer: text(form, "answer"),
    sort: Number(form.get("sort") || 0),
    updatedAt: new Date(),
  };
  if (!values.question || !values.answer)
    throw new Error("Question and answer required");

  if (id) {
    await db.update(faqs).set(values).where(eq(faqs.id, id));
  } else {
    await db.insert(faqs).values(values);
  }
  refreshPublic();
  redirect("/admin/faqs");
}

export async function setFaqPublished(id: number, published: boolean) {
  await assertAdmin();
  await db
    .update(faqs)
    .set({ published, updatedAt: new Date() })
    .where(eq(faqs.id, id));
  refreshPublic();
}

export async function deleteFaq(id: number) {
  await assertAdmin();
  await db.delete(faqs).where(eq(faqs.id, id));
  refreshPublic();
}

/* ---------------- Clients ---------------- */

export async function saveClient(form: FormData) {
  await assertAdmin();
  const id = Number(form.get("id") || 0);
  const logoUrl = await maybeUploadImage(form, "clients");
  const values = {
    name: text(form, "name"),
    websiteUrl: text(form, "websiteUrl"),
    sort: Number(form.get("sort") || 0),
    updatedAt: new Date(),
  };
  if (!values.name) throw new Error("Client name is required");

  if (id) {
    await db
      .update(clients)
      .set(logoUrl ? { ...values, logoUrl } : values)
      .where(eq(clients.id, id));
  } else {
    if (!logoUrl) throw new Error("A logo is required for a new client");
    await db.insert(clients).values({ ...values, logoUrl });
  }
  refreshPublic();
  redirect("/admin/clients");
}

export async function setClientPublished(id: number, published: boolean) {
  await assertAdmin();
  await db
    .update(clients)
    .set({ published, updatedAt: new Date() })
    .where(eq(clients.id, id));
  refreshPublic();
}

export async function deleteClient(id: number) {
  await assertAdmin();
  await db.delete(clients).where(eq(clients.id, id));
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


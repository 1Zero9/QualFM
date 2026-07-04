import { readFile } from "node:fs/promises";
import { put } from "@vercel/blob";
import { db, heroSlides, notices, settings, testimonials } from "../lib/db";

import siteContent from "../content/site-content.json";

async function main() {
  const existing = await db.select().from(heroSlides);
  if (existing.length > 0) {
    console.log("Seed skipped: hero_slides already has rows.");
    return;
  }

  const heroImage = await readFile("public/images/hero/qualfm-fitout.jpg");
  const blob = await put("hero/qualfm-fitout.jpg", heroImage, {
    access: "public",
    contentType: "image/jpeg",
  });
  console.log("Hero image uploaded:", blob.url);

  await db.insert(heroSlides).values({
    kicker: "Quality · Compliance · Value",
    title: "Facilities support that keeps your business running",
    subtitle:
      "Integrated facilities management and maintenance across Ireland — planned, preventative and reactive, delivered by qualified professionals.",
    ctaLabel: "View our services",
    ctaHref: "/services",
    imageUrl: blob.url,
    sort: 0,
    active: true,
  });

  const seedTestimonials = (
    siteContent as {
      home: {
        feedback: {
          testimonials: { quote: string; author: string; company: string }[];
        };
      };
    }
  ).home.feedback.testimonials;

  // Seeded unpublished: provenance unverified (2026-07-04 audit finding).
  await db.insert(testimonials).values(
    seedTestimonials.map((t, i) => ({
      quote: t.quote,
      author: t.author,
      company: t.company,
      published: false,
      sort: i,
    }))
  );

  await db.insert(notices).values({
    type: "news",
    label: "Company update",
    title: "QualFM launches its new website",
    slug: "qualfm-launches-new-website",
    bodyMd:
      "QualFM has launched a refreshed website with a new look, live news and project updates.\n\nKeep an eye on this page for service announcements, completed projects and compliance insights.",
    status: "draft",
  });

  await db
    .insert(settings)
    .values({ key: "spotlight_rotation_seconds", value: "8" })
    .onConflictDoNothing();

  console.log("Seed complete.");
}

main().then(() => process.exit(0));

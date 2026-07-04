import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const heroSlides = pgTable("hero_slides", {
  id: serial("id").primaryKey(),
  kicker: text("kicker").notNull().default(""),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull().default(""),
  ctaLabel: text("cta_label").notNull().default(""),
  ctaHref: text("cta_href").notNull().default(""),
  imageUrl: text("image_url").notNull(),
  sort: integer("sort").notNull().default(0),
  active: boolean("active").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const notices = pgTable("notices", {
  id: serial("id").primaryKey(),
  type: text("type", { enum: ["news", "campaign"] }).notNull().default("news"),
  label: text("label").notNull().default("Company update"),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  bodyMd: text("body_md").notNull().default(""),
  imageUrl: text("image_url"),
  publishFrom: timestamp("publish_from"),
  publishTo: timestamp("publish_to"),
  pinned: boolean("pinned").notNull().default(false),
  spotlight: boolean("spotlight").notNull().default(false),
  status: text("status", { enum: ["draft", "published"] })
    .notNull()
    .default("draft"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  quote: text("quote").notNull(),
  author: text("author").notNull(),
  company: text("company").notNull().default(""),
  published: boolean("published").notNull().default(false),
  spotlight: boolean("spotlight").notNull().default(false),
  sort: integer("sort").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  client: text("client").notNull().default(""),
  sector: text("sector").notNull().default(""),
  summary: text("summary").notNull().default(""),
  bodyMd: text("body_md").notNull().default(""),
  imageUrls: jsonb("image_urls").$type<string[]>().notNull().default([]),
  completedAt: timestamp("completed_at"),
  published: boolean("published").notNull().default(false),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const loginTokens = pgTable("login_tokens", {
  id: serial("id").primaryKey(),
  tokenHash: text("token_hash").notNull().unique(),
  email: text("email").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

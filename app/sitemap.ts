import type { MetadataRoute } from "next";
import { getLiveNotices, getPublishedJobs } from "@/lib/public-queries";

const BASE = "https://www.qualfm.ie";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [noticeRows, jobRows] = await Promise.all([
    getLiveNotices(),
    getPublishedJobs(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/services`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/projects`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/news`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/contact`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/privacy-policy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];

  return [
    ...staticRoutes,
    ...noticeRows.map((n) => ({
      url: `${BASE}/news/${n.slug}`,
      lastModified: n.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...jobRows.map((j) => ({
      url: `${BASE}/projects/${j.slug}`,
      lastModified: j.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}

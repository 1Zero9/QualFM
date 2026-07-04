import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { getLiveNoticeBySlug } from "@/lib/public-queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const notice = await getLiveNoticeBySlug(slug);
  if (!notice) return { title: "Not found" };
  return {
    title: notice.title,
    description: notice.bodyMd.slice(0, 155).replace(/\n/g, " "),
    openGraph: notice.imageUrl ? { images: [notice.imageUrl] } : undefined,
  };
}

export default async function NoticeArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const notice = await getLiveNoticeBySlug(slug);
  if (!notice) notFound();

  const published = notice.publishFrom ?? notice.createdAt;
  const html = await marked.parse(notice.bodyMd);

  return (
    <article className="mx-auto max-w-[760px] px-4 py-14 md:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            headline: notice.title,
            datePublished: published.toISOString(),
            dateModified: notice.updatedAt.toISOString(),
            image: notice.imageUrl ? [notice.imageUrl] : undefined,
            publisher: { "@type": "Organization", name: "QualFM Ltd" },
          }),
        }}
      />
      <Link href="/news" className="text-sm font-semibold text-forest hover:underline">
        ← All news
      </Link>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className={`rounded px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${notice.type === "campaign" ? "bg-forest text-white" : "bg-teal-soft text-forest"}`}>
          {notice.type}
        </span>
        <span className="rounded bg-ink/5 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-ink/60">
          {notice.label}
        </span>
      </div>
      <h1 className="mt-3 text-3xl font-bold uppercase italic leading-tight text-navy md:text-4xl">
        {notice.title}
      </h1>
      <p className="mt-2 text-sm text-ink/50">
        {published.toLocaleDateString("en-IE", { day: "numeric", month: "long", year: "numeric" })}
      </p>
      {notice.imageUrl && (
        <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl">
          <Image src={notice.imageUrl} alt="" fill sizes="760px" className="object-cover" />
        </div>
      )}
      <div
        className="prose-md mt-6 text-[15px] leading-relaxed text-ink"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}

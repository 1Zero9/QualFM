import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { JsonLd, breadcrumbLd } from "@/components/site/json-ld";
import { getPublishedJobBySlug } from "@/lib/public-queries";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = await getPublishedJobBySlug(slug);
  if (!job) return { title: "Not found" };
  return {
    title: `${job.title} — Project`,
    description: job.summary || `${job.title}, delivered by QualFM.`,
    openGraph: job.imageUrls[0] ? { images: [job.imageUrls[0]] } : undefined,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = await getPublishedJobBySlug(slug);
  if (!job) notFound();

  const html = await marked.parse(job.bodyMd);

  return (
    <article className="mx-auto max-w-[760px] px-4 py-14 md:px-6">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: job.title,
          description: job.summary || undefined,
          image: job.imageUrls.length > 0 ? job.imageUrls : undefined,
          dateModified: job.updatedAt.toISOString(),
          mainEntityOfPage: `https://www.qualfm.ie/projects/${job.slug}`,
          author: { "@id": "https://www.qualfm.ie/#business" },
          publisher: {
            "@type": "Organization",
            name: "QualFM Ltd",
            logo: {
              "@type": "ImageObject",
              url: "https://www.qualfm.ie/images/qualfm-logo-tight.png",
            },
          },
        }}
      />
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Projects", path: "/projects" },
          { name: job.title, path: `/projects/${job.slug}` },
        ])}
      />
      <Link href="/projects" className="text-sm font-semibold text-forest hover:underline">
        ← All projects
      </Link>
      <div className="mt-4 flex flex-wrap gap-2 text-sm text-ink/60">
        <span className="rounded bg-teal-soft px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-forest">
          {job.sector || "Project"}
        </span>
        {job.completedAt && (
          <span>
            Completed{" "}
            {job.completedAt.toLocaleDateString("en-IE", { month: "long", year: "numeric" })}
          </span>
        )}
      </div>
      <h1 className="mt-3 text-3xl font-bold leading-tight text-navy md:text-4xl">
        {job.title}
      </h1>
      {job.client && <p className="mt-2 text-sm text-ink/60">Client: {job.client}</p>}
      {job.summary && <p className="mt-4 text-lg text-ink/80">{job.summary}</p>}
      {job.imageUrls[0] && (
        <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl">
          <Image src={job.imageUrls[0]} alt="" fill sizes="760px" className="object-cover" />
        </div>
      )}
      <div
        className="prose-md mt-6 text-[15px] leading-relaxed text-ink"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      {job.imageUrls.length > 1 && (
        <div className="mt-8 grid grid-cols-2 gap-4">
          {job.imageUrls.slice(1).map((url) => (
            <div key={url} className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <Image src={url} alt="" fill sizes="380px" className="object-cover" />
            </div>
          ))}
        </div>
      )}
      <div className="mt-10 rounded-2xl bg-teal-soft p-6 text-center">
        <p className="font-semibold text-navy">Planning something similar?</p>
        <Link href="/contact" className="mt-3 inline-block rounded-full bg-forest px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-white hover:bg-forest/85">
          Talk to QualFM
        </Link>
      </div>
    </article>
  );
}

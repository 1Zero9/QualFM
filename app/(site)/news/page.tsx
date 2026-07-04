import { NoticeCard, SectionHeading } from "@/components/site/cards";
import { getLiveNotices } from "@/lib/public-queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "News & Updates",
  description:
    "News, project updates and service announcements from QualFM — facilities management across Ireland.",
};

export default async function NewsPage() {
  const all = await getLiveNotices();

  return (
    <div className="mx-auto max-w-[1120px] px-4 py-14 md:px-6">
      <SectionHeading
        title="News & Updates"
        intro="What's happening at QualFM — completed projects, service announcements and compliance insights."
      />
      {all.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-ink/20 p-10 text-center text-ink/60">
          No updates published yet — check back soon.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {all.map((n) => (
            <NoticeCard key={n.id} notice={n} />
          ))}
        </div>
      )}
    </div>
  );
}

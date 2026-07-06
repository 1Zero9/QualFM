import { JobCard, SectionHeading } from "@/components/site/cards";
import { getPublishedJobs } from "@/lib/public-queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Projects",
  description:
    "Recently completed facilities, maintenance and fitout projects delivered by QualFM across Ireland.",
};

export default async function ProjectsPage() {
  const all = await getPublishedJobs();

  return (
    <div className="mx-auto max-w-[1120px] px-4 py-14 md:px-6">
      <SectionHeading
        as="h1"
        title="Projects"
        intro="Recently completed work — maintenance contracts, compliance programmes and fitout projects up to €1.5m."
      />
      {all.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-ink/20 p-10 text-center text-ink/60">
          Project case studies are on the way — talk to us about recent work in your sector.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {all.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}

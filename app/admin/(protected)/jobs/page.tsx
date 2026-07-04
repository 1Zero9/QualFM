import Link from "next/link";
import { desc } from "drizzle-orm";
import { db, jobs } from "@/lib/db";
import { deleteJob } from "@/lib/admin/actions";
import { Badge, PageHeader, btnDanger, btnGhost, btnPrimary } from "../ui";

export const metadata = { title: "Jobs" };

export default async function JobsPage() {
  const all = await db.select().from(jobs).orderBy(desc(jobs.createdAt));

  return (
    <div>
      <PageHeader
        title="Jobs"
        subtitle="Completed projects. Published jobs appear at /projects; featured ones also appear on the homepage."
        action={
          <Link href="/admin/jobs/new" className={btnPrimary}>
            + New job
          </Link>
        }
      />
      <div className="mt-6 space-y-3">
        {all.length === 0 && (
          <p className="rounded-xl border border-dashed border-ink/20 p-8 text-center text-ink/60">
            No jobs yet. Add your first completed project — it&apos;s the
            strongest sales content the site can have.
          </p>
        )}
        {all.map((job) => (
          <div key={job.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-ink/10 bg-white p-4 shadow-sm">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="green">{job.sector || "General"}</Badge>
                {job.published ? <Badge tone="live">Published</Badge> : <Badge tone="amber">Draft</Badge>}
                {job.featured && <Badge tone="navy">Featured</Badge>}
              </div>
              <p className="mt-1.5 truncate text-lg font-bold text-navy">{job.title}</p>
              <p className="text-xs text-ink/60">
                {job.client && `${job.client} · `}
                {job.completedAt ? job.completedAt.toLocaleDateString("en-IE") : "no date"}
              </p>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/jobs/${job.id}`} className={btnGhost}>
                Edit
              </Link>
              <form action={deleteJob.bind(null, job.id)}>
                <button className={btnDanger}>Delete</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

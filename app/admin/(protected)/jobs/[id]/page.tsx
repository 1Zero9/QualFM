import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, jobs } from "@/lib/db";
import { JobForm } from "../job-form";
import { PageHeader } from "../../ui";

export const metadata = { title: "Edit job" };

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [job] = await db.select().from(jobs).where(eq(jobs.id, Number(id)));
  if (!job) notFound();

  return (
    <div>
      <Link href="/admin/jobs" className="text-sm text-ink/60 hover:text-ink">
        ← Back to jobs
      </Link>
      <div className="mt-2">
        <PageHeader title="Edit job" subtitle={`/projects/${job.slug}`} />
      </div>
      <div className="mt-6 rounded-xl border border-ink/10 bg-white p-6 shadow-sm">
        <JobForm job={job} />
      </div>
    </div>
  );
}

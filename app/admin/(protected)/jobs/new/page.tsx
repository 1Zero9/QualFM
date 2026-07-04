import Link from "next/link";
import { JobForm } from "../job-form";
import { PageHeader } from "../../ui";

export const metadata = { title: "New job" };

export default function NewJobPage() {
  return (
    <div>
      <Link href="/admin/jobs" className="text-sm text-ink/60 hover:text-ink">
        ← Back to jobs
      </Link>
      <div className="mt-2">
        <PageHeader title="New job" />
      </div>
      <div className="mt-6 rounded-xl border border-ink/10 bg-white p-6 shadow-sm">
        <JobForm />
      </div>
    </div>
  );
}

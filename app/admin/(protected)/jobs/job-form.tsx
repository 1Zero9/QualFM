import { saveJob } from "@/lib/admin/actions";
import type { jobs } from "@/lib/db";
import { btnPrimary, inputCls, labelCls } from "../ui";

const SECTORS = [
  "Commercial Offices",
  "Telecom & Critical Environments",
  "Healthcare",
  "Pharmaceutical",
  "Industrial",
  "Retail",
];

export function JobForm({ job }: { job?: typeof jobs.$inferSelect }) {
  return (
    <form action={saveJob} className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {job && <input type="hidden" name="id" value={job.id} />}
      <label className={labelCls}>
        Title *
        <input name="title" required defaultValue={job?.title} className={inputCls} placeholder="Retail unit fitout, Dublin 2" />
      </label>
      <label className={labelCls}>
        Client <span className="font-normal text-ink/50">(optional, get permission)</span>
        <input name="client" defaultValue={job?.client} className={inputCls} />
      </label>
      <label className={labelCls}>
        Sector
        <select name="sector" defaultValue={job?.sector ?? SECTORS[0]} className={inputCls}>
          {SECTORS.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
      <label className={labelCls}>
        Completed on
        <input type="date" name="completedAt" defaultValue={job?.completedAt ? job.completedAt.toISOString().slice(0, 10) : ""} className={inputCls} />
      </label>
      <label className={`${labelCls} md:col-span-2`}>
        Summary <span className="font-normal text-ink/50">(one or two sentences for the card)</span>
        <textarea name="summary" rows={2} defaultValue={job?.summary} className={inputCls} />
      </label>
      <label className={`${labelCls} md:col-span-2`}>
        Full write-up <span className="font-normal text-ink/50">(markdown — scope, challenges, outcome)</span>
        <textarea name="bodyMd" rows={8} defaultValue={job?.bodyMd} className={inputCls} />
      </label>
      <label className={labelCls}>
        Add photo {job?.imageUrls?.length ? `(${job.imageUrls.length} attached)` : ""}
        <input type="file" name="imageFile" accept="image/*" className={inputCls} />
      </label>
      <label className={labelCls}>
        …or image URL
        <input name="imageUrl" className={inputCls} placeholder="https://…" />
      </label>
      <div className="flex flex-wrap gap-6 md:col-span-2">
        <label className="flex items-center gap-2 text-sm font-medium text-ink">
          <input type="checkbox" name="published" defaultChecked={job?.published} className="size-4 accent-forest" />
          Published
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-ink">
          <input type="checkbox" name="featured" defaultChecked={job?.featured} className="size-4 accent-forest" />
          Featured (homepage &ldquo;Latest projects&rdquo;)
        </label>
      </div>
      <div className="md:col-span-2">
        <button className={btnPrimary}>{job ? "Save job" : "Create job"}</button>
      </div>
    </form>
  );
}

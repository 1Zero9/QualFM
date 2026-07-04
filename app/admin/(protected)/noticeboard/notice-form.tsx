import { saveNotice } from "@/lib/admin/actions";
import type { notices } from "@/lib/db";
import { btnPrimary, inputCls, labelCls } from "../ui";

const LABELS = [
  "Company update",
  "Project news",
  "Compliance insight",
  "Service announcement",
  "Hiring",
];

function toLocalInput(date: Date | null): string {
  if (!date) return "";
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export function NoticeForm({
  notice,
}: {
  notice?: typeof notices.$inferSelect;
}) {
  return (
    <form action={saveNotice} className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {notice && <input type="hidden" name="id" value={notice.id} />}

      <fieldset className="md:col-span-2">
        <legend className="text-sm font-medium text-ink">What are you posting?</legend>
        <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-ink/15 bg-white p-4 has-checked:border-navy has-checked:bg-navy has-checked:text-white">
            <input
              type="radio"
              name="type"
              value="news"
              defaultChecked={(notice?.type ?? "news") === "news"}
              className="mt-1 accent-forest"
            />
            <span>
              <strong className="block text-sm font-bold uppercase">News</strong>
              <span className="text-xs opacity-80">Something that happened — updates, completions, notices</span>
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-ink/15 bg-white p-4 has-checked:border-navy has-checked:bg-navy has-checked:text-white">
            <input
              type="radio"
              name="type"
              value="campaign"
              defaultChecked={notice?.type === "campaign"}
              className="mt-1 accent-forest"
            />
            <span>
              <strong className="block text-sm font-bold uppercase">Campaign</strong>
              <span className="text-xs opacity-80">Something to do — enquire, book a survey, hire us</span>
            </span>
          </label>
        </div>
      </fieldset>

      <label className={labelCls}>
        Title * <span className="font-normal text-ink/50">(short and punchy — shown big on the site)</span>
        <input name="title" required defaultValue={notice?.title} className={inputCls} placeholder="Pharma cleanroom fitout completed" />
      </label>
      <label className={labelCls}>
        Label *
        <select name="label" defaultValue={notice?.label ?? LABELS[0]} className={inputCls}>
          {LABELS.map((l) => (
            <option key={l}>{l}</option>
          ))}
        </select>
      </label>

      <label className={`${labelCls} md:col-span-2`}>
        Body <span className="font-normal text-ink/50">(markdown, 2–3 paragraphs)</span>
        <textarea name="bodyMd" rows={8} defaultValue={notice?.bodyMd} className={inputCls} />
      </label>

      <label className={labelCls}>
        Image <span className="font-normal text-ink/50">(optional — card + article page)</span>
        <input type="file" name="imageFile" accept="image/*" className={inputCls} />
      </label>
      <label className={labelCls}>
        …or image URL
        <input name="imageUrl" defaultValue={notice?.imageUrl ?? ""} className={inputCls} placeholder="https://…" />
      </label>

      <label className={labelCls}>
        Publish from <span className="font-normal text-ink/50">(empty = immediately)</span>
        <input type="datetime-local" name="publishFrom" defaultValue={toLocalInput(notice?.publishFrom ?? null)} className={inputCls} />
      </label>
      <label className={labelCls}>
        Publish until <span className="font-normal text-ink/50">(empty = no end date)</span>
        <input type="datetime-local" name="publishTo" defaultValue={toLocalInput(notice?.publishTo ?? null)} className={inputCls} />
      </label>

      <div className="flex flex-wrap gap-6 md:col-span-2">
        <label className="flex items-center gap-2 text-sm font-medium text-ink">
          <input type="checkbox" name="pinned" defaultChecked={notice?.pinned} className="size-4 accent-forest" />
          Pinned (stays at the top of the news page)
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-ink">
          <input type="checkbox" name="spotlight" defaultChecked={notice?.spotlight} className="size-4 accent-forest" />
          Spotlight (features on the homepage)
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-ink">
          <input
            type="checkbox"
            name="status"
            value="published"
            defaultChecked={notice?.status === "published"}
            className="size-4 accent-forest"
          />
          Published (unticked = draft)
        </label>
      </div>

      <div className="md:col-span-2">
        <button className={btnPrimary}>{notice ? "Save notice" : "Create notice"}</button>
      </div>
    </form>
  );
}

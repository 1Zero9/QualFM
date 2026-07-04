import { asc } from "drizzle-orm";
import { db, faqs } from "@/lib/db";
import { deleteFaq, saveFaq, setFaqPublished } from "@/lib/admin/actions";
import { siteContent } from "@/lib/content";
import {
  Badge,
  PageHeader,
  btnDanger,
  btnGhost,
  btnPrimary,
  inputCls,
  labelCls,
} from "../ui";

export const metadata = { title: "FAQs" };

function FaqForm({ faq }: { faq?: typeof faqs.$inferSelect }) {
  return (
    <form action={saveFaq} className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {faq && <input type="hidden" name="id" value={faq.id} />}
      <label className={`${labelCls} md:col-span-2`}>
        Question *
        <input
          name="question"
          required
          defaultValue={faq?.question}
          className={inputCls}
          placeholder="What areas of Ireland does QualFM cover?"
        />
      </label>
      <label className={`${labelCls} md:col-span-2`}>
        Answer *
        <textarea
          name="answer"
          required
          rows={3}
          defaultValue={faq?.answer}
          className={inputCls}
        />
      </label>
      <label className={labelCls}>
        Sort order
        <input type="number" name="sort" defaultValue={faq?.sort ?? 0} className={inputCls} />
      </label>
      <div className="self-end">
        <button className={btnPrimary}>{faq ? "Save" : "Add question"}</button>
      </div>
    </form>
  );
}

export default async function FaqsPage() {
  const all = await db.select().from(faqs).orderBy(asc(faqs.sort), asc(faqs.id));
  const usingDefaults = all.filter((f) => f.published).length === 0;

  return (
    <div>
      <PageHeader
        title="FAQs"
        subtitle="Shown on the Services page and fed to Google/AI search as structured data. Published questions appear in sort order."
      />

      {usingDefaults && (
        <div className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          No published FAQs here yet, so the site is showing its{" "}
          {siteContent.services.faq.items.length} built-in default questions.
          Add and publish questions below to take over.
        </div>
      )}

      <div className="mt-6 space-y-4">
        {all.map((faq) => (
          <details key={faq.id} className="rounded-xl border border-ink/10 bg-white shadow-sm">
            <summary className="flex cursor-pointer flex-wrap items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-navy">{faq.question}</p>
                <p className="mt-1 truncate text-xs text-ink/60">{faq.answer}</p>
              </div>
              {faq.published ? <Badge tone="live">Published</Badge> : <Badge tone="amber">Draft</Badge>}
              <span className="flex gap-2">
                <form action={setFaqPublished.bind(null, faq.id, !faq.published)}>
                  <button className={btnGhost}>{faq.published ? "Unpublish" : "Publish"}</button>
                </form>
                <form action={deleteFaq.bind(null, faq.id)}>
                  <button className={btnDanger}>Delete</button>
                </form>
              </span>
            </summary>
            <div className="border-t border-ink/10 p-4">
              <FaqForm faq={faq} />
            </div>
          </details>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-ink/10 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-navy">New question</h2>
        <FaqForm />
      </div>
    </div>
  );
}

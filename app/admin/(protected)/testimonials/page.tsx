import { asc } from "drizzle-orm";
import { db, testimonials } from "@/lib/db";
import {
  deleteTestimonial,
  saveTestimonial,
  setTestimonialFlags,
} from "@/lib/admin/actions";
import {
  Badge,
  PageHeader,
  btnDanger,
  btnGhost,
  btnPrimary,
  inputCls,
  labelCls,
} from "../ui";

export const metadata = { title: "Testimonials" };

function TestimonialForm({
  t,
}: {
  t?: typeof testimonials.$inferSelect;
}) {
  return (
    <form action={saveTestimonial} className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {t && <input type="hidden" name="id" value={t.id} />}
      <label className={`${labelCls} md:col-span-2`}>
        Quote *
        <textarea name="quote" required rows={3} defaultValue={t?.quote} className={inputCls} />
      </label>
      <label className={labelCls}>
        Author *
        <input name="author" required defaultValue={t?.author} className={inputCls} placeholder="Jane Murphy" />
      </label>
      <label className={labelCls}>
        Company / role
        <input name="company" defaultValue={t?.company} className={inputCls} placeholder="Operations Manager, Acme Ltd" />
      </label>
      <label className={labelCls}>
        Sort order
        <input type="number" name="sort" defaultValue={t?.sort ?? 0} className={inputCls} />
      </label>
      <div className="self-end">
        <button className={btnPrimary}>{t ? "Save" : "Add testimonial"}</button>
      </div>
    </form>
  );
}

export default async function TestimonialsPage() {
  const all = await db.select().from(testimonials).orderBy(asc(testimonials.sort));

  return (
    <div>
      <PageHeader
        title="Testimonials"
        subtitle="Only published testimonials appear on the site. Spotlight puts one front-and-centre on the homepage."
      />

      <div className="mt-6 space-y-4">
        {all.map((t) => (
          <details key={t.id} className="rounded-xl border border-ink/10 bg-white shadow-sm">
            <summary className="flex cursor-pointer flex-wrap items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm italic text-ink">&ldquo;{t.quote}&rdquo;</p>
                <p className="mt-1 text-xs font-semibold text-navy">
                  {t.author}
                  {t.company && <span className="font-normal text-ink/60"> — {t.company}</span>}
                </p>
              </div>
              {t.published ? <Badge tone="live">Published</Badge> : <Badge tone="amber">Draft</Badge>}
              {t.spotlight && <Badge tone="navy">Spotlight</Badge>}
              <span className="flex gap-2">
                <form action={setTestimonialFlags.bind(null, t.id, { published: !t.published })}>
                  <button className={btnGhost}>{t.published ? "Unpublish" : "Publish"}</button>
                </form>
                <form action={setTestimonialFlags.bind(null, t.id, { spotlight: !t.spotlight })}>
                  <button className={btnGhost}>{t.spotlight ? "Un-spotlight" : "Spotlight"}</button>
                </form>
                <form action={deleteTestimonial.bind(null, t.id)}>
                  <button className={btnDanger}>Delete</button>
                </form>
              </span>
            </summary>
            <div className="border-t border-ink/10 p-4">
              <TestimonialForm t={t} />
            </div>
          </details>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-ink/10 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-navy">New testimonial</h2>
        <TestimonialForm />
      </div>
    </div>
  );
}

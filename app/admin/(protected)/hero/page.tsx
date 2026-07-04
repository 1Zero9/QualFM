/* eslint-disable @next/next/no-img-element */
import { asc } from "drizzle-orm";
import { db, heroSlides } from "@/lib/db";
import {
  deleteHeroSlide,
  saveHeroSlide,
  toggleHeroSlide,
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

export const metadata = { title: "Hero" };

function SlideForm({
  slide,
}: {
  slide?: typeof heroSlides.$inferSelect;
}) {
  return (
    <form
      action={saveHeroSlide}
      className="grid grid-cols-1 gap-4 md:grid-cols-2"
    >
      {slide && <input type="hidden" name="id" value={slide.id} />}
      <label className={labelCls}>
        Kicker (small line above the title)
        <input name="kicker" defaultValue={slide?.kicker} className={inputCls} placeholder="Quality · Compliance · Value" />
      </label>
      <label className={labelCls}>
        Title *
        <input name="title" required defaultValue={slide?.title} className={inputCls} placeholder="Facilities support that keeps your business running" />
      </label>
      <label className={`${labelCls} md:col-span-2`}>
        Subtitle
        <textarea name="subtitle" rows={2} defaultValue={slide?.subtitle} className={inputCls} />
      </label>
      <label className={labelCls}>
        CTA label
        <input name="ctaLabel" defaultValue={slide?.ctaLabel} className={inputCls} placeholder="View our services" />
      </label>
      <label className={labelCls}>
        CTA link
        <input name="ctaHref" defaultValue={slide?.ctaHref} className={inputCls} placeholder="/services" />
      </label>
      <label className={labelCls}>
        Background image {slide ? "(leave empty to keep current)" : "*"}
        <input type="file" name="imageFile" accept="image/*" className={inputCls} />
      </label>
      <label className={labelCls}>
        …or image URL
        <input name="imageUrl" className={inputCls} placeholder="https://…" />
      </label>
      <label className={labelCls}>
        Sort order
        <input type="number" name="sort" defaultValue={slide?.sort ?? 0} className={inputCls} />
      </label>
      <label className="flex items-center gap-2 self-end pb-1 text-sm font-medium text-ink">
        <input type="checkbox" name="active" defaultChecked={slide?.active ?? true} className="size-4 accent-forest" />
        Active (visible on the homepage)
      </label>
      <div className="md:col-span-2">
        <button className={btnPrimary}>{slide ? "Save slide" : "Add slide"}</button>
      </div>
    </form>
  );
}

export default async function HeroAdminPage() {
  const slides = await db.select().from(heroSlides).orderBy(asc(heroSlides.sort));

  return (
    <div>
      <PageHeader
        title="Hero"
        subtitle="Slides shown at the top of the homepage. One active slide shows a static hero; several rotate as a carousel."
      />

      <div className="mt-6 space-y-4">
        {slides.map((slide) => (
          <details key={slide.id} className="rounded-xl border border-ink/10 bg-white shadow-sm">
            <summary className="flex cursor-pointer flex-wrap items-center gap-4 p-4">
              <img
                src={slide.imageUrl}
                alt=""
                className="h-14 w-24 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-navy">{slide.title}</p>
                <p className="text-xs text-ink/60">sort {slide.sort}</p>
              </div>
              {slide.active ? <Badge tone="live">Live</Badge> : <Badge>Inactive</Badge>}
              <span className="flex gap-2">
                <form action={toggleHeroSlide.bind(null, slide.id, !slide.active)}>
                  <button className={btnGhost}>{slide.active ? "Deactivate" : "Activate"}</button>
                </form>
                <form action={deleteHeroSlide.bind(null, slide.id)}>
                  <button className={btnDanger}>Delete</button>
                </form>
              </span>
            </summary>
            <div className="border-t border-ink/10 p-4">
              <SlideForm slide={slide} />
            </div>
          </details>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-ink/10 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-navy">New slide</h2>
        <SlideForm />
      </div>
    </div>
  );
}

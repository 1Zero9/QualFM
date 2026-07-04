/* eslint-disable @next/next/no-img-element */
import { eq } from "drizzle-orm";
import { db, settings } from "@/lib/db";
import { saveHeroContent } from "@/lib/admin/actions";
import { siteContent } from "@/lib/content";
import { PageHeader, btnPrimary, inputCls, labelCls } from "../ui";

export const metadata = { title: "Homepage hero" };

export default async function HeroPage() {
  const [row] = await db
    .select()
    .from(settings)
    .where(eq(settings.key, "hero_content"));
  let current: Partial<Record<"kicker" | "title" | "body" | "imageUrl", string>> = {};
  try {
    current = row ? JSON.parse(row.value) : {};
  } catch {
    current = {};
  }
  const defaults = siteContent.home.hero;
  const imageUrl = current.imageUrl || "/images/hero/qualfm-fitout.jpg";

  return (
    <div>
      <PageHeader
        title="Homepage hero"
        subtitle="The headline area visitors see first. Leave a field blank to use the built-in default (shown as the faded hint text)."
      />

      <div className="mt-6 max-w-2xl rounded-xl border border-ink/10 bg-white p-5 shadow-sm">
        <form
          action={saveHeroContent}
          className="grid grid-cols-1 gap-4"
          encType="multipart/form-data"
        >
          <label className={labelCls}>
            Kicker (small line above the headline)
            <input
              name="kicker"
              defaultValue={current.kicker}
              placeholder={defaults.kicker}
              className={inputCls}
            />
          </label>
          <label className={labelCls}>
            Headline
            <input
              name="title"
              defaultValue={current.title}
              placeholder={defaults.title}
              className={inputCls}
            />
          </label>
          <label className={labelCls}>
            Supporting text
            <textarea
              name="body"
              rows={3}
              defaultValue={current.body}
              placeholder={defaults.body}
              className={inputCls}
            />
          </label>
          <div>
            <p className={labelCls}>Background photo (mobile hero)</p>
            <img
              src={imageUrl}
              alt="Current hero background"
              className="mt-2 aspect-[16/9] w-full max-w-md rounded-lg object-cover"
            />
            <label className={`${labelCls} mt-3`}>
              Replace photo (leave empty to keep current)
              <input type="file" name="imageFile" accept="image/*" className={inputCls} />
            </label>
          </div>
          <div>
            <button className={btnPrimary}>Save hero</button>
          </div>
        </form>
      </div>

      <p className="mt-6 max-w-2xl text-sm text-ink/60">
        On phones the hero is a full-width photo with the headline over it; on
        desktop it&apos;s a light card next to the &ldquo;Why QualFM&rdquo;
        panel. Changes appear on the site immediately after saving.
      </p>
    </div>
  );
}

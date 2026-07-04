import { eq } from "drizzle-orm";
import { db, settings } from "@/lib/db";
import { saveRotationSeconds } from "@/lib/admin/actions";
import { PageHeader, btnPrimary, inputCls } from "../ui";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const [rotation] = await db
    .select()
    .from(settings)
    .where(eq(settings.key, "spotlight_rotation_seconds"));

  return (
    <div>
      <PageHeader title="Settings" />
      <div className="mt-6 max-w-xl rounded-xl border border-ink/10 bg-white p-5 shadow-sm">
        <h2 className="font-bold text-navy">Homepage rotation</h2>
        <p className="mt-1 text-sm text-ink/70">
          Seconds each hero slide / spotlight item stays on screen before
          swapping (3–30). Visitors with reduced-motion enabled never
          auto-rotate.
        </p>
        <form action={saveRotationSeconds} className="mt-4 flex items-end gap-3">
          <label className="text-sm font-medium text-ink">
            Seconds
            <input
              type="number"
              name="seconds"
              min={3}
              max={30}
              defaultValue={rotation?.value ?? "8"}
              className={`${inputCls} w-24`}
            />
          </label>
          <button className={btnPrimary}>Save</button>
        </form>
      </div>
    </div>
  );
}

import Link from "next/link";
import { desc } from "drizzle-orm";
import { db, notices } from "@/lib/db";
import { deleteNotice } from "@/lib/admin/actions";
import { Badge, PageHeader, btnDanger, btnGhost, btnPrimary } from "../ui";

export const metadata = { title: "Noticeboard" };

function isLive(n: typeof notices.$inferSelect): boolean {
  if (n.status !== "published") return false;
  const now = new Date();
  if (n.publishFrom && n.publishFrom > now) return false;
  if (n.publishTo && n.publishTo < now) return false;
  return true;
}

function dateRange(n: typeof notices.$inferSelect): string {
  const fmt = (d: Date) => d.toLocaleDateString("en-IE");
  if (n.publishFrom && n.publishTo) return `${fmt(n.publishFrom)} → ${fmt(n.publishTo)}`;
  if (n.publishFrom) return `from ${fmt(n.publishFrom)}`;
  if (n.publishTo) return `until ${fmt(n.publishTo)}`;
  return "always on";
}

export default async function NoticeboardPage() {
  const all = await db.select().from(notices).orderBy(desc(notices.createdAt));
  const liveCount = all.filter(isLive).length;

  return (
    <div>
      <PageHeader
        title="Noticeboard"
        subtitle={`${all.length} items · ${liveCount} live now — news and campaigns, exactly as they compete for the homepage spotlight.`}
        action={
          <Link href="/admin/noticeboard/new" className={btnPrimary}>
            + New notice
          </Link>
        }
      />

      <div className="mt-6 space-y-3">
        {all.length === 0 && (
          <p className="rounded-xl border border-dashed border-ink/20 p-8 text-center text-ink/60">
            No notices yet. Create the first one.
          </p>
        )}
        {all.map((n) => (
          <div
            key={n.id}
            className={`flex flex-wrap items-center gap-3 rounded-xl border bg-white p-4 shadow-sm ${
              isLive(n) ? "border-emerald-300" : "border-ink/10"
            }`}
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone={n.type === "campaign" ? "navy" : "neutral"}>{n.type}</Badge>
                <Badge tone="green">{n.label}</Badge>
                {n.pinned && <Badge tone="amber">Pinned</Badge>}
                {n.spotlight && <Badge tone="navy">Spotlight</Badge>}
                {isLive(n) ? <Badge tone="live">Live</Badge> : <Badge>{n.status}</Badge>}
              </div>
              <p className="mt-1.5 truncate text-lg font-bold text-navy">{n.title}</p>
              <p className="text-xs text-ink/60">{dateRange(n)}</p>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/noticeboard/${n.id}`} className={btnGhost}>
                Edit
              </Link>
              <form action={deleteNotice.bind(null, n.id)}>
                <button className={btnDanger}>Delete</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

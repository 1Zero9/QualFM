import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, notices } from "@/lib/db";
import { NoticeForm } from "../notice-form";
import { PageHeader } from "../../ui";

export const metadata = { title: "Edit notice" };

export default async function EditNoticePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [notice] = await db
    .select()
    .from(notices)
    .where(eq(notices.id, Number(id)));
  if (!notice) notFound();

  return (
    <div>
      <Link href="/admin/noticeboard" className="text-sm text-ink/60 hover:text-ink">
        ← Back to noticeboard
      </Link>
      <div className="mt-2">
        <PageHeader title="Edit notice" subtitle={`/news/${notice.slug}`} />
      </div>
      <div className="mt-6 rounded-xl border border-ink/10 bg-white p-6 shadow-sm">
        <NoticeForm notice={notice} />
      </div>
    </div>
  );
}

import Link from "next/link";
import { NoticeForm } from "../notice-form";
import { PageHeader } from "../../ui";

export const metadata = { title: "New notice" };

export default function NewNoticePage() {
  return (
    <div>
      <Link href="/admin/noticeboard" className="text-sm text-ink/60 hover:text-ink">
        ← Back to noticeboard
      </Link>
      <div className="mt-2">
        <PageHeader title="New notice" />
      </div>
      <div className="mt-6 rounded-xl border border-ink/10 bg-white p-6 shadow-sm">
        <NoticeForm />
      </div>
    </div>
  );
}

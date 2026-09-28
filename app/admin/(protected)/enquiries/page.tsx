import { desc } from "drizzle-orm";
import { contactMessages, db } from "@/lib/db";
import { deleteContactMessage } from "@/lib/admin/actions";
import { Badge, PageHeader, btnDanger } from "../ui";

export const metadata = { title: "Enquiries" };

const ENQUIRY_LABELS: Record<string, string> = {
  planned: "Planned maintenance",
  reactive: "Reactive / emergency",
  fitout: "Fitout project",
  audit: "Compliance audit",
  other: "Other",
};

export default async function EnquiriesPage() {
  const rows = await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));

  return (
    <div>
      <PageHeader
        title="Enquiries"
        subtitle="Every contact-form submission, whether or not the notification email sent."
      />

      {rows.length === 0 ? (
        <p className="mt-6 text-sm text-ink/60">No enquiries yet.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {rows.map((m) => (
            <details key={m.id} className="rounded-xl border border-ink/10 bg-white shadow-sm">
              <summary className="flex cursor-pointer flex-wrap items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-navy">
                    {m.name}{" "}
                    <span className="font-normal text-ink/60">— {m.email}</span>
                  </p>
                  <p className="mt-0.5 truncate text-xs text-ink/60">{m.message}</p>
                </div>
                <Badge tone="navy">{ENQUIRY_LABELS[m.enquiryType] ?? m.enquiryType}</Badge>
                {!m.emailSent && <Badge tone="amber">Email not sent</Badge>}
                <span className="text-xs text-ink/50">
                  {m.createdAt.toLocaleString("en-IE", { dateStyle: "medium", timeStyle: "short" })}
                </span>
                <form action={deleteContactMessage.bind(null, m.id)}>
                  <button className={btnDanger}>Delete</button>
                </form>
              </summary>
              <div className="space-y-2 border-t border-ink/10 p-4 text-sm text-ink/80">
                {m.phone && <p>Phone: {m.phone}</p>}
                <p className="whitespace-pre-wrap">{m.message}</p>
                <a href={`mailto:${m.email}`} className="inline-block font-semibold text-forest hover:underline">
                  Reply by email →
                </a>
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}

import { allowedAdminEmails } from "@/lib/auth/session";
import { Badge, PageHeader } from "../ui";

export const metadata = { title: "Settings" };

export default function SettingsPage() {
  const emails = allowedAdminEmails();

  return (
    <div>
      <PageHeader title="Settings" />

      <div className="mt-6 max-w-xl rounded-xl border border-ink/10 bg-white p-5 shadow-sm">
        <h2 className="font-bold text-navy">Admin access</h2>
        <p className="mt-1 text-sm text-ink/70">
          These email addresses can sign in to this admin portal via magic
          link. Adding or removing someone requires updating the{" "}
          <code className="rounded bg-ink/5 px-1">ADMIN_EMAILS</code>{" "}
          environment variable on Vercel — ask your developer.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {emails.map((email) => (
            <Badge key={email} tone="green">
              {email}
            </Badge>
          ))}
        </div>
      </div>

      <div className="mt-6 max-w-xl rounded-xl border border-ink/10 bg-white p-5 shadow-sm">
        <h2 className="font-bold text-navy">Content model</h2>
        <p className="mt-1 text-sm leading-relaxed text-ink/70">
          Hero, noticeboard, projects, testimonials, FAQs and clients are all
          editable here and go live immediately. Service descriptions, sector
          tags and legal pages are managed in code — changes to those go
          through your developer.
        </p>
      </div>
    </div>
  );
}

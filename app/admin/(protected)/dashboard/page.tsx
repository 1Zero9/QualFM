import Link from "next/link";
import { count, eq } from "drizzle-orm";
import { ExternalLink, FilePlus2, ImageIcon, Megaphone } from "lucide-react";
import { clients, db, faqs, jobs, notices, testimonials } from "@/lib/db";
import { getSession } from "@/lib/auth/session";

export const metadata = { title: "Dashboard" };

function greeting(): string {
  const hour = Number(
    new Intl.DateTimeFormat("en-IE", {
      hour: "numeric",
      hour12: false,
      timeZone: "Europe/Dublin",
    }).format(new Date())
  );
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function displayName(email: string): string {
  const prefix = email.split("@")[0].split(/[._-]/)[0];
  return prefix.charAt(0).toUpperCase() + prefix.slice(1);
}

export default async function DashboardPage() {
  const session = (await getSession())!;

  const [
    [noticeCount],
    [jobCount],
    [testimonialCount],
    [draftTestimonials],
    [faqCount],
    [clientCount],
  ] = await Promise.all([
    db.select({ n: count() }).from(notices).where(eq(notices.status, "published")),
    db.select({ n: count() }).from(jobs).where(eq(jobs.published, true)),
    db.select({ n: count() }).from(testimonials).where(eq(testimonials.published, true)),
    db.select({ n: count() }).from(testimonials).where(eq(testimonials.published, false)),
    db.select({ n: count() }).from(faqs).where(eq(faqs.published, true)),
    db.select({ n: count() }).from(clients).where(eq(clients.published, true)),
  ]);

  const stats = [
    { label: "Published notices", value: noticeCount.n, href: "/admin/noticeboard" },
    { label: "Published jobs", value: jobCount.n, href: "/admin/jobs" },
    { label: "Published testimonials", value: testimonialCount.n, href: "/admin/testimonials" },
    { label: "Published FAQs", value: faqCount.n, href: "/admin/faqs" },
    { label: "Published clients", value: clientCount.n, href: "/admin/clients" },
  ];

  const quickActions = [
    { label: "New notice", href: "/admin/noticeboard/new", icon: Megaphone },
    { label: "New job", href: "/admin/jobs/new", icon: FilePlus2 },
    { label: "Edit homepage hero", href: "/admin/hero", icon: ImageIcon },
  ];

  return (
    <div>
      <p className="text-sm text-ink/60">{greeting()},</p>
      <h1 className="text-3xl font-bold text-navy">
        Welcome back, {displayName(session.email)}
      </h1>
      <p className="mt-1 text-sm text-ink/60">
        Everything you publish here goes live on the site straight away.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((card) => (
          <Link
            key={card.href + card.label}
            href={card.href}
            className="rounded-xl border border-ink/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="text-3xl font-bold text-navy">{card.value}</p>
            <p className="mt-1 text-sm text-ink/70">{card.label}</p>
          </Link>
        ))}
      </div>

      {draftTestimonials.n > 0 && (
        <div className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <strong>{draftTestimonials.n} testimonial(s) are unpublished.</strong>{" "}
          Review them and publish or replace.{" "}
          <Link href="/admin/testimonials" className="font-semibold underline">
            Review now
          </Link>
        </div>
      )}

      <h2 className="mt-10 text-lg font-bold text-navy">Quick actions</h2>
      <div className="mt-3 flex flex-wrap gap-3">
        {quickActions.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2 rounded-lg bg-forest px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-forest/90"
          >
            <Icon size={15} /> {label}
          </Link>
        ))}
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-2 rounded-lg border border-ink/20 px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-ink/5"
        >
          View live site <ExternalLink size={14} />
        </a>
      </div>

    </div>
  );
}

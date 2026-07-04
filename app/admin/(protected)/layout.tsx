import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Building2,
  HelpCircle,
  Image as ImageIcon,
  LayoutDashboard,
  Megaphone,
  Quote,
  Settings,
  Wrench,
} from "lucide-react";
import { getSession } from "@/lib/auth/session";

const NAV = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/hero", label: "Homepage hero", icon: ImageIcon },
  { href: "/admin/noticeboard", label: "Noticeboard", icon: Megaphone },
  { href: "/admin/jobs", label: "Jobs", icon: Wrench },
  { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { href: "/admin/clients", label: "Clients", icon: Building2 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export const metadata = { robots: { index: false } };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin");

  return (
    <div className="flex min-h-screen bg-page max-md:flex-col">
      <aside className="w-56 shrink-0 bg-navy text-white max-md:w-full">
        <div className="px-5 py-6">
          <p className="text-sm font-bold uppercase italic tracking-wider text-white">
            QualFM <span className="text-emerald-300">Admin</span>
          </p>
          <p className="mt-1 truncate text-xs text-white/50">{session.email}</p>
        </div>
        <nav className="flex flex-col gap-1 px-3 pb-6 max-md:flex-row max-md:flex-wrap">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
          <form action="/api/auth/logout" method="post" className="mt-4 px-3 max-md:mt-0">
            <button className="text-sm text-white/50 underline-offset-2 hover:text-white hover:underline">
              Sign out
            </button>
          </form>
        </nav>
      </aside>
      <main className="min-w-0 flex-1 px-6 py-8 md:px-10">{children}</main>
    </div>
  );
}

import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { LoginForm } from "./login-form";

export const metadata = { title: "Admin sign in", robots: { index: false } };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await getSession()) redirect("/admin/dashboard");
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-navy px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-forest">
          QualFM Admin
        </p>
        <h1 className="mt-1 text-2xl font-bold text-navy">Sign in</h1>
        <p className="mt-2 text-sm text-ink/70">
          Enter your email and we&apos;ll send you a one-time sign-in link.
        </p>
        {error === "invalid" && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            That link is invalid or has expired. Request a new one.
          </p>
        )}
        {error === "rate" && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            Too many attempts. Try again shortly.
          </p>
        )}
        <LoginForm />
      </div>
    </main>
  );
}

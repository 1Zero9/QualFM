import { NextResponse } from "next/server";
import { consumeLoginToken } from "@/lib/auth/magic";
import { createSessionToken, setSessionCookie } from "@/lib/auth/session";
import { clientIp, rateLimit } from "@/lib/auth/rate-limit";

// POST-only and driven by an explicit user click (see /admin/verify) so
// that mail-scanner link prefetching (GET) can't consume the token before
// the admin clicks it themselves.
export async function POST(req: Request) {
  const url = new URL(req.url);

  if (!rateLimit(`verify:${clientIp(req)}`, 10)) {
    return NextResponse.redirect(new URL("/admin?error=rate", url.origin), 303);
  }

  let token = "";
  try {
    const form = await req.formData();
    token = String(form.get("token") ?? "");
  } catch {
    token = "";
  }

  const email = token ? await consumeLoginToken(token) : null;
  if (!email) {
    return NextResponse.redirect(new URL("/admin?error=invalid", url.origin), 303);
  }

  await setSessionCookie(createSessionToken(email));
  return NextResponse.redirect(new URL("/admin/dashboard", url.origin), 303);
}

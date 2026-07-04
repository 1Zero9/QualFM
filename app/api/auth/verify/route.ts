import { NextResponse } from "next/server";
import { consumeLoginToken } from "@/lib/auth/magic";
import { createSessionToken, setSessionCookie } from "@/lib/auth/session";
import { clientIp, rateLimit } from "@/lib/auth/rate-limit";

export async function GET(req: Request) {
  const url = new URL(req.url);

  if (!rateLimit(`verify:${clientIp(req)}`, 10)) {
    return NextResponse.redirect(new URL("/admin?error=rate", url.origin));
  }

  const token = url.searchParams.get("token") ?? "";
  const email = token ? await consumeLoginToken(token) : null;

  if (!email) {
    return NextResponse.redirect(new URL("/admin?error=invalid", url.origin));
  }

  await setSessionCookie(createSessionToken(email));
  return NextResponse.redirect(new URL("/admin/dashboard", url.origin));
}

import { NextResponse } from "next/server";
import { createLoginToken, sendMagicLinkEmail } from "@/lib/auth/magic";
import { isAllowedAdmin } from "@/lib/auth/session";
import { clientIp, rateLimit } from "@/lib/auth/rate-limit";

export async function POST(req: Request) {
  if (!rateLimit(`link:${clientIp(req)}`, 5)) {
    return NextResponse.json(
      { error: "Too many requests. Try again later." },
      { status: 429 }
    );
  }

  let email = "";
  try {
    const body = await req.json();
    email = String(body?.email ?? "").trim().toLowerCase();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Always return the same response so email enumeration is not possible.
  const genericOk = NextResponse.json({
    ok: true,
    message: "If that address is registered, a sign-in link is on its way.",
  });

  if (!email || !isAllowedAdmin(email)) return genericOk;
  if (!rateLimit(`link-email:${email}`, 3)) return genericOk;

  const token = await createLoginToken(email);
  const origin = new URL(req.url).origin;
  await sendMagicLinkEmail(email, `${origin}/api/auth/verify?token=${token}`);

  return genericOk;
}

import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth/session";

export async function POST(req: Request) {
  await clearSessionCookie();
  return NextResponse.redirect(new URL("/admin", new URL(req.url).origin), 303);
}

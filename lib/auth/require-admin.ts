import { NextResponse } from "next/server";
import { getSession, type Session } from "@/lib/auth/session";

export async function requireAdmin(): Promise<
  { session: Session; error: null } | { session: null; error: NextResponse }
> {
  const session = await getSession();
  if (!session) {
    return {
      session: null,
      error: NextResponse.json({ error: "Not authenticated" }, { status: 401 }),
    };
  }
  return { session, error: null };
}

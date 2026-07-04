import crypto from "node:crypto";
import { and, eq, gt, isNull } from "drizzle-orm";
import { db, loginTokens } from "@/lib/db";

const TOKEN_MINUTES = 15;

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function createLoginToken(email: string): Promise<string> {
  const token = crypto.randomBytes(32).toString("base64url");
  await db.insert(loginTokens).values({
    tokenHash: hashToken(token),
    email: email.trim().toLowerCase(),
    expiresAt: new Date(Date.now() + TOKEN_MINUTES * 60 * 1000),
  });
  return token;
}

export async function consumeLoginToken(token: string): Promise<string | null> {
  const [row] = await db
    .select()
    .from(loginTokens)
    .where(
      and(
        eq(loginTokens.tokenHash, hashToken(token)),
        isNull(loginTokens.usedAt),
        gt(loginTokens.expiresAt, new Date())
      )
    )
    .limit(1);
  if (!row) return null;

  await db
    .update(loginTokens)
    .set({ usedAt: new Date() })
    .where(eq(loginTokens.id, row.id));
  return row.email;
}

export async function sendMagicLinkEmail(email: string, link: string) {
  const apiKey = (process.env.RESEND_API_KEY || "").trim();
  if (!apiKey) throw new Error("RESEND_API_KEY is not set");
  const from =
    (process.env.CONTACT_FROM_EMAIL || "").trim() ||
    "QualFM Website <onboarding@resend.dev>";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: "Your QualFM admin sign-in link",
      html: `
        <div style="font-family: sans-serif; max-width: 480px;">
          <h2 style="color: #173a54;">Sign in to QualFM Admin</h2>
          <p>Click the button below to sign in. This link expires in ${TOKEN_MINUTES} minutes and can be used once.</p>
          <p style="margin: 24px 0;">
            <a href="${link}" style="background: #15745d; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Sign in</a>
          </p>
          <p style="color: #666; font-size: 13px;">If you didn't request this, you can ignore this email.</p>
        </div>`,
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend responded ${response.status}`);
  }
}

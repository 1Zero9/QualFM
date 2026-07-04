import crypto from "node:crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "qualfm_admin_session";
const SESSION_DAYS = 7;

function getSecret(): string {
  const secret = (process.env.SESSION_SECRET || "").trim();
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return secret;
}

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64url");
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

function secureEqual(a: string, b: string): boolean {
  const left = Buffer.from(a, "utf8");
  const right = Buffer.from(b, "utf8");
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

export type Session = { email: string; exp: number };

export function createSessionToken(email: string): string {
  const payload = b64url(
    JSON.stringify({
      email,
      exp: Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000,
      nonce: crypto.randomBytes(8).toString("hex"),
    })
  );
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined): Session | null {
  if (!token || !token.includes(".")) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  if (!secureEqual(signature, sign(payload))) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (typeof parsed.exp !== "number" || Date.now() >= parsed.exp) return null;
    if (typeof parsed.email !== "string") return null;
    return { email: parsed.email, exp: parsed.exp };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

export async function setSessionCookie(token: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.set(SESSION_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export function allowedAdminEmails(): string[] {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowedAdmin(email: string): boolean {
  return allowedAdminEmails().includes(email.trim().toLowerCase());
}

import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/auth/rate-limit";

function normalize(value: unknown): string {
  return String(value ?? "").trim();
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(req: Request) {
  const apiKey = normalize(process.env.RESEND_API_KEY);
  if (!apiKey) {
    return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
  }

  if (!rateLimit(`contact:${clientIp(req)}`, 8)) {
    return NextResponse.json(
      { error: "Too many requests. Try again later." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Honeypot: real users never fill this hidden field.
  if (normalize(body.website)) {
    return NextResponse.json({ ok: true });
  }

  const name = normalize(body.name);
  const email = normalize(body.email).toLowerCase();
  const message = normalize(body.message);

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "name, email and message are required" },
      { status: 400 }
    );
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }
  if (message.length > 5000 || name.length > 200) {
    return NextResponse.json({ error: "Message too long" }, { status: 400 });
  }

  const toEmail = normalize(process.env.CONTACT_TO_EMAIL) || "service@qualfm.ie";
  const fromEmail =
    normalize(process.env.CONTACT_FROM_EMAIL) ||
    "QualFM Website <onboarding@resend.dev>";

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: email,
      subject: `Website enquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    }),
  });

  if (!response.ok) {
    return NextResponse.json(
      { error: "Unable to send message right now. Please email service@qualfm.ie directly." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}

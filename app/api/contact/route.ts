import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/auth/rate-limit";
import { contactMessages, db } from "@/lib/db";
import { eq } from "drizzle-orm";

const ENQUIRY_TYPES = ["planned", "reactive", "fitout", "audit", "other"] as const;
type EnquiryType = (typeof ENQUIRY_TYPES)[number];

function normalize(value: unknown): string {
  return String(value ?? "").trim();
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizeEnquiryType(value: unknown): EnquiryType {
  const v = normalize(value).toLowerCase();
  return (ENQUIRY_TYPES as readonly string[]).includes(v) ? (v as EnquiryType) : "other";
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
  const phone = normalize(body.phone);
  const enquiryType = normalizeEnquiryType(body.enquiryType);
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
  if (message.length > 5000 || name.length > 200 || phone.length > 40) {
    return NextResponse.json({ error: "Message too long" }, { status: 400 });
  }

  // Store the enquiry before attempting to email it, so a Resend outage or
  // an unverified from-address doesn't silently lose the lead.
  let messageId: number;
  try {
    const [row] = await db
      .insert(contactMessages)
      .values({ name, email, phone, enquiryType, message })
      .returning({ id: contactMessages.id });
    messageId = row.id;
  } catch {
    return NextResponse.json(
      { error: "Unable to save your message right now. Please email service@qualfm.ie directly." },
      { status: 502 }
    );
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
      subject: `Website enquiry from ${name} (${enquiryType})`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "(not given)"}\nEnquiry type: ${enquiryType}\n\n${message}`,
    }),
  }).catch(() => null);

  // The message is already stored either way, so an email failure here is
  // not a lost lead — it's visible in /admin/enquiries and can be actioned
  // from there.
  if (response?.ok) {
    await db
      .update(contactMessages)
      .set({ emailSent: true })
      .where(eq(contactMessages.id, messageId));
  }

  return NextResponse.json({ ok: true });
}

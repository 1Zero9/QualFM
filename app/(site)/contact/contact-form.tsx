"use client";

import { useState } from "react";

const inputCls =
  "mt-1 w-full rounded-lg border border-ink/20 bg-white px-3 py-2.5 text-ink focus:border-forest";

export function ContactForm({ buttonLabel }: { buttonLabel: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          message: form.get("message"),
          website: form.get("website"),
        }),
      });
      if (res.ok) {
        setStatus("sent");
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Something went wrong.");
        setStatus("error");
      }
    } catch {
      setError("Network problem — please try again or email us directly.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl bg-teal-soft p-8 text-center">
        <p className="text-lg font-bold text-forest">Message sent</p>
        <p className="mt-2 text-sm text-ink/80">
          Thanks for getting in touch — we&apos;ll come back to you shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block text-sm font-medium text-ink">
        Name *
        <input name="name" required maxLength={200} className={inputCls} />
      </label>
      <label className="block text-sm font-medium text-ink">
        Email *
        <input type="email" name="email" required className={inputCls} />
      </label>
      {/* Honeypot — hidden from real users */}
      <label className="hidden" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="block text-sm font-medium text-ink">
        Message *
        <textarea name="message" required rows={6} maxLength={5000} className={inputCls} />
      </label>
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full bg-forest px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-forest/85 disabled:opacity-60 sm:w-auto"
      >
        {status === "sending" ? "Sending…" : buttonLabel}
      </button>
      {status === "error" && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}
    </form>
  );
}

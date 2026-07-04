"use client";

import { useState } from "react";

export function LoginForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [email, setEmail] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/auth/request-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <p className="mt-6 rounded-lg bg-teal-soft px-4 py-3 text-sm text-forest">
        If that address is registered, a sign-in link is on its way. Check your
        inbox — the link expires in 15 minutes.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      <label className="block">
        <span className="text-sm font-medium text-ink">Email address</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-ink/20 px-3 py-2 text-ink focus:border-forest"
          placeholder="you@qualfm.ie"
        />
      </label>
      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-lg bg-forest px-4 py-2.5 font-semibold text-white transition hover:bg-forest/90 disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Email me a sign-in link"}
      </button>
      {status === "error" && (
        <p className="text-sm text-red-700">
          Something went wrong sending the link. Try again.
        </p>
      )}
    </form>
  );
}

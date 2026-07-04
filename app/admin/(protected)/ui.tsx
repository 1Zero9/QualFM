import type { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold italic uppercase text-navy">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink/70">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "navy" | "green" | "amber" | "live";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-ink/5 text-ink/70 border-ink/15",
    navy: "bg-navy text-white border-navy",
    green: "bg-teal-soft text-forest border-forest/30",
    amber: "bg-amber-50 text-amber-800 border-amber-300",
    live: "bg-emerald-50 text-emerald-700 border-emerald-300",
  };
  return (
    <span
      className={`inline-block rounded border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export const inputCls =
  "mt-1 w-full rounded-lg border border-ink/20 bg-white px-3 py-2 text-sm text-ink focus:border-forest";
export const labelCls = "block text-sm font-medium text-ink";
export const btnPrimary =
  "rounded-lg bg-forest px-4 py-2 text-sm font-semibold text-white transition hover:bg-forest/90";
export const btnGhost =
  "rounded-lg border border-ink/20 px-4 py-2 text-sm font-semibold text-ink transition hover:bg-ink/5";
export const btnDanger =
  "rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-50";

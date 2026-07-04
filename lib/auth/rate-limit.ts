const attempts = new Map<string, { start: number; count: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_TRACKED = 10000;

export function rateLimit(key: string, max: number): boolean {
  const now = Date.now();
  for (const [k, entry] of attempts) {
    if (now > entry.start + WINDOW_MS) attempts.delete(k);
  }
  if (attempts.size > MAX_TRACKED) attempts.clear();

  const current = attempts.get(key);
  if (!current || now > current.start + WINDOW_MS) {
    attempts.set(key, { start: now, count: 1 });
    return true;
  }
  current.count += 1;
  return current.count <= max;
}

export function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}

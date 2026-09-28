/**
 * The canonical site origin, used for links generated server-side (e.g. the
 * magic-link email). Prefer the fixed SITE_URL env var over the request's
 * Host header, which can be spoofed or vary behind a proxy.
 */
export function siteOrigin(req: Request): string {
  const configured = (process.env.SITE_URL || "").trim().replace(/\/$/, "");
  return configured || new URL(req.url).origin;
}

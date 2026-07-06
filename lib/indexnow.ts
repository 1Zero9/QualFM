const HOST = "www.qualfm.ie";
const KEY = "3cc7098dbb7fc8dcc9254507e33bccb4c3fbb3d565c9489b28b0fa0092dd886a";

const CORE_URLS = [
  `https://${HOST}/`,
  `https://${HOST}/services`,
  `https://${HOST}/news`,
  `https://${HOST}/projects`,
];

/**
 * Notify IndexNow-participating engines (Bing, Yandex, Seznam, Naver) that
 * content changed. Fire-and-forget: never blocks or fails the caller.
 */
export function pingIndexNow(extraUrls: string[] = []) {
  if (process.env.VERCEL_ENV !== "production") return;

  const urlList = [...new Set([...CORE_URLS, ...extraUrls])];
  fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: HOST, key: KEY, urlList }),
  }).catch(() => {});
}

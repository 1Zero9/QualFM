import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

/**
 * Render admin-authored Markdown (news/project bodies) to safe HTML.
 *
 * Only admins (allow-listed via ADMIN_EMAILS) can write this content, but it
 * is rendered with dangerouslySetInnerHTML on public pages, so it is
 * sanitized as defense in depth against a compromised/mistaken admin
 * account or copy-pasted hostile markup.
 */
export async function renderSafeMarkdown(bodyMd: string): Promise<string> {
  const rawHtml = await marked.parse(bodyMd);
  return sanitizeHtml(rawHtml, {
    allowedTags: [
      "p", "br", "hr",
      "h2", "h3", "h4",
      "strong", "em", "b", "i", "s", "u", "code", "pre", "blockquote",
      "ul", "ol", "li",
      "a", "img",
      "table", "thead", "tbody", "tr", "th", "td",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", {
        target: "_blank",
        rel: "noopener noreferrer",
      }),
    },
  });
}

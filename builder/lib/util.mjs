export function formatDate(d, locale = "en") {
  const date = new Date(d);
  return date.toLocaleDateString(locale, {
    year: "numeric", month: "short", day: "numeric",
  });
}

export function escapeHtml(s) {
  return String(s).replace(/[<>&"']/g, c => ({
    "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

// Conservative pure-JS CSS minifier — strip comments, collapse whitespace,
// trim around syntactic tokens. Trades a fraction of a percent vs cssnano
// for a much smaller dependency footprint.
export function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{}:;,>+~])\s*/g, "$1")
    .replace(/;}/g, "}")
    .trim();
}

// HTML minifier: strip comments and collapse whitespace between tags. Keeps
// content of <pre>, <textarea>, and <script> intact since whitespace there is
// meaningful.
export function minifyHtml(html) {
  // Pull out preserved blocks first
  const preserved = [];
  const PLACEHOLDER = "__UP_PRESERVE_";
  const masked = html.replace(/<(pre|textarea|script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, (m) => {
    preserved.push(m);
    return `${PLACEHOLDER}${preserved.length - 1}__`;
  });
  const minified = masked
    .replace(/<!--(?!\s*\[if)[\s\S]*?-->/g, "")
    .replace(/>\s+</g, "><")
    .replace(/\s{2,}/g, " ")
    .trim();
  return minified.replace(new RegExp(`${PLACEHOLDER}(\\d+)__`, "g"), (_, i) => preserved[+i]);
}

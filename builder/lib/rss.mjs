function escapeXml(s) {
  return String(s).replace(/[<>&'"]/g, c => ({
    "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;",
  }[c]));
}

function rfc822(d) {
  const date = new Date(d);
  return date.toUTCString();
}

// Patch notes are a natural feed: each release entry becomes an <item>.
export function buildPatchNotesRss({ site, baseUrl, entries }) {
  const channelLink = `${baseUrl}/patch-notes/`;
  const items = entries.map(e => `
    <item>
      <title>${escapeXml(`v${e.version} — ${e.title}`)}</title>
      <link>${escapeXml(channelLink)}</link>
      <guid isPermaLink="false">${escapeXml(`${baseUrl}/patch-notes/#v${e.version}`)}</guid>
      <pubDate>${rfc822(e.date)}</pubDate>
      <description>${escapeXml(buildItemDescription(e))}</description>
    </item>`).join("");

  const lastBuild = entries.length ? rfc822(entries[0].date) : rfc822(new Date());

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${escapeXml(`${site.title} — Patch Notes`)}</title>
  <link>${escapeXml(channelLink)}</link>
  <atom:link href="${escapeXml(baseUrl + "/rss.xml")}" rel="self" type="application/rss+xml" />
  <description>${escapeXml(site.description)}</description>
  <language>${escapeXml(site.locale || "en")}</language>
  <lastBuildDate>${lastBuild}</lastBuildDate>
${items}
</channel>
</rss>`;
}

function buildItemDescription(e) {
  let d = e.summary || "";
  if (Array.isArray(e.changes) && e.changes.length) {
    d += "\n\n" + e.changes.map(c => `• ${c}`).join("\n");
  }
  return d.trim();
}

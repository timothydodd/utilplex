function escapeXml(s) {
  return String(s).replace(/[<>&'"]/g, c => ({
    "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;",
  }[c]));
}

export function buildSitemap({ baseUrl, urls }) {
  const today = new Date().toISOString().slice(0, 10);
  const lines = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ];
  for (const u of urls) {
    lines.push(`  <url>`);
    lines.push(`    <loc>${escapeXml(baseUrl + u.path)}</loc>`);
    lines.push(`    <lastmod>${escapeXml(u.lastmod || today)}</lastmod>`);
    if (u.changefreq) lines.push(`    <changefreq>${u.changefreq}</changefreq>`);
    if (u.priority) lines.push(`    <priority>${u.priority}</priority>`);
    lines.push(`  </url>`);
  }
  lines.push(`</urlset>`);
  return lines.join("\n");
}

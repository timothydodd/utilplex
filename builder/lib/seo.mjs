// JSON-LD (schema.org) builders. Emitted in <head> on every page so search
// engines understand each tool as a SoftwareApplication, the home as a
// WebSite + ItemList, and prose pages as WebPage.
//
// Two helpers are doing real work:
//
//   stripUndef — drops null/undefined/empty-string fields. Keeps payloads
//                tight and avoids "field": "" noise.
//   serialize  — JSON.stringifies the cleaned object AND escapes "</script>"
//                so a string field can't break out of its <script> tag.

function stripUndef(obj) {
  if (Array.isArray(obj)) {
    return obj.map(stripUndef).filter(v => v !== undefined);
  }
  if (obj && typeof obj === "object") {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      const cleaned = stripUndef(v);
      if (cleaned !== undefined && cleaned !== null && cleaned !== "") out[k] = cleaned;
    }
    return Object.keys(out).length ? out : undefined;
  }
  return obj;
}

function serialize(obj) {
  return JSON.stringify(stripUndef(obj))
    .replace(/<\/(script)/gi, "<\\/$1");
}

function absUrl(baseUrl, p) {
  if (!p) return undefined;
  if (/^https?:/i.test(p)) return p;
  if (!p.startsWith("/")) p = "/" + p;
  return baseUrl.replace(/\/$/, "") + p;
}

function publisher(site, baseUrl) {
  return {
    "@type": "Organization",
    name: site.title,
    url: baseUrl,
    logo: {
      "@type": "ImageObject",
      url: absUrl(baseUrl, "/icon-512.png"),
      width: 512,
      height: 512,
    },
  };
}

// ─── Per-page builders ──────────────────────────────────────────────────

export function softwareAppJsonLd({ site, tool, category, canonical, baseUrl }) {
  return serialize({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${tool.title} — ${site.title}`,
    url: canonical,
    description: tool.description,
    applicationCategory: "DeveloperApplication",
    applicationSubCategory: category.name,
    operatingSystem: "Any (browser)",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    creator: publisher(site, baseUrl),
    image: absUrl(baseUrl, "/assets/og-image.png"),
    keywords: (tool.keywords || []).join(", "),
  });
}

export function webPageJsonLd({ site, page, canonical, baseUrl }) {
  return serialize({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${page.title} — ${site.title}`,
    url: canonical,
    description: page.description || site.description,
    isPartOf: { "@type": "WebSite", name: site.title, url: baseUrl },
    publisher: publisher(site, baseUrl),
  });
}

// Used by both the home page and the prose pages so every URL has a stable
// website graph entry.
function websiteEntity(site, baseUrl) {
  return {
    "@type": "WebSite",
    name: site.title,
    url: baseUrl,
    description: site.description,
    publisher: publisher(site, baseUrl),
  };
}

function itemListEntity(site, baseUrl, categories) {
  const items = [];
  let pos = 1;
  for (const cat of categories) {
    for (const t of cat.tools) {
      items.push({
        "@type": "ListItem",
        position: pos++,
        url: `${baseUrl}/${cat.slug}/${t.slug}/`,
        name: t.title,
      });
    }
  }
  return {
    "@type": "ItemList",
    name: `${site.title} tools`,
    itemListElement: items,
  };
}

export function homeGraph({ site, baseUrl, categories }) {
  return serialize({
    "@context": "https://schema.org",
    "@graph": [
      websiteEntity(site, baseUrl),
      itemListEntity(site, baseUrl, categories),
    ],
  });
}

// BreadcrumbList for tool pages — Google surfaces this as the breadcrumb
// trail under the result title (e.g. "utilplex.com › Formatters › JSON").
export function toolBreadcrumb({ site, baseUrl, category, tool, canonical }) {
  return serialize({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl + "/" },
      { "@type": "ListItem", position: 2, name: category.name, item: `${baseUrl}/#${category.slug}` },
      { "@type": "ListItem", position: 3, name: tool.name, item: canonical },
    ],
  });
}

// Compose a full @graph for tool pages — SoftwareApplication + breadcrumb.
// One <script> tag instead of two reduces head size and is what Google
// recommends.
export function toolGraph({ site, baseUrl, category, tool, canonical }) {
  return serialize({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: `${tool.title} — ${site.title}`,
        url: canonical,
        description: tool.description,
        applicationCategory: "DeveloperApplication",
        applicationSubCategory: category.name,
        operatingSystem: "Any (browser)",
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        creator: publisher(site, baseUrl),
        image: absUrl(baseUrl, "/assets/og-image.png"),
        keywords: (tool.keywords || []).join(", "),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home",          item: baseUrl + "/" },
          { "@type": "ListItem", position: 2, name: category.name,   item: `${baseUrl}/#${category.slug}` },
          { "@type": "ListItem", position: 3, name: tool.name,       item: canonical },
        ],
      },
    ],
  });
}

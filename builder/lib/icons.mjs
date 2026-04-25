// Inline SVG icon set (Lucide-derived, hand-trimmed). Returned as raw HTML
// strings so the template engine can drop them straight into the page.
// Every icon uses currentColor and 24x24 viewBox, sized via CSS.

const ATTRS = `viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"`;

export const ICONS = {
  // Categories
  wand:       `<path d="m3 21 9-9"/><path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11.8 19 13"/><path d="M15 9h0"/><path d="M17.8 6.2 19 5"/><path d="m12.2 6.2-1.2-1.2"/>`,
  shuffle:    `<path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"/><path d="m18 2 4 4-4 4"/><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"/><path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8L13 16"/><path d="m18 14 4 4-4 4"/>`,
  lock:       `<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>`,
  spark:      `<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z"/>`,
  type:       `<path d="M4 7V5h16v2"/><path d="M9 20h6"/><path d="M12 5v15"/>`,
  diff:       `<path d="M12 3v14"/><path d="M5 10h14"/><path d="M5 21h14"/>`,
  clock:      `<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/>`,

  // Tools
  braces:     `<path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1"/><path d="M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"/>`,
  database:   `<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>`,
  palette:    `<circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2A10 10 0 0 0 2 12c0 5.5 4.5 10 10 10a3 3 0 0 0 3-3 2 2 0 0 0-2-2h-1.6a2 2 0 0 1 0-4H20a2 2 0 0 0 2-2A10 10 0 0 0 12 2z"/>`,
  code:       `<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>`,
  tag:        `<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0l-7.2-7.2a2 2 0 0 1-.6-1.4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 1.4.6l7.2 7.2a2 2 0 0 1 0 2.6Z"/><circle cx="7.5" cy="7.5" r="1.5"/>`,
  fingerprint:`<path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4"/><path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2"/><path d="M17.29 21.02c.12-.6.43-2.3.5-3.02"/><path d="M12 10a2 2 0 0 1 2 2c0 2.2-.5 4.6-1.5 7"/><path d="M16 18.5c.25-1 .5-2.5.5-4.5a4.5 4.5 0 0 0-9 0v.5"/><path d="M8.65 22c.21-.66.45-1.32.65-2"/><path d="M12 6a6 6 0 0 1 6 6c0 1.5-.16 2.95-.43 4.5"/>`,
  ruler:      `<path d="M21.3 8.7 8.7 21.3a2.4 2.4 0 0 1-3.4 0L2.7 18.7a2.4 2.4 0 0 1 0-3.4L15.3 2.7a2.4 2.4 0 0 1 3.4 0l2.6 2.6a2.4 2.4 0 0 1 0 3.4Z"/><path d="m7.5 10.5 2 2"/><path d="m10.5 7.5 2 2"/><path d="m13.5 4.5 2 2"/><path d="m4.5 13.5 2 2"/>`,

  // Header / utility
  sun:        `<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>`,
  moon:       `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/>`,
  copy:       `<rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>`,
  trash:      `<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>`,
  download:   `<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>`,
  github:     `<path d="M9 19c-5 1.5-5-2.5-7-3"/><path d="M15 22v-4a3.4 3.4 0 0 0-1-2.6c3.1-.4 6-1.3 6-6.5a5 5 0 0 0-1.4-3.5 4.6 4.6 0 0 0 0-3.5s-1.1-.4-3.6 1.3a12.4 12.4 0 0 0-6 0C6.5.4 5.4.8 5.4.8a4.6 4.6 0 0 0 0 3.5A5 5 0 0 0 4 7.8c0 5.2 2.9 6.1 6 6.5a3.4 3.4 0 0 0-1 2.6V22"/>`,
  rss:        `<path d="M4 11a9 9 0 0 1 9 9"/><path d="M4 4a16 16 0 0 1 16 16"/><circle cx="5" cy="19" r="1.5" fill="currentColor"/>`,
  arrowRight: `<line x1="5" x2="19" y1="12" y2="12"/><polyline points="12 5 19 12 12 19"/>`,
};

export function icon(name, { size = 18, className = "" } = {}) {
  const body = ICONS[name];
  if (!body) return "";
  const cls = className ? ` class="${className}"` : "";
  return `<svg${cls} width="${size}" height="${size}" ${ATTRS}>${body}</svg>`;
}

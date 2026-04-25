import { $, bindRun, setStatus } from "./_helpers.js";

function uuid4() {
  if (crypto.randomUUID) return crypto.randomUUID();
  // Fallback for older browsers — not on the modern matrix but cheap to include.
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = Array.from(b, x => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`;
}

function fmt(g, mode) {
  switch (mode) {
    case "upper":  return g.toUpperCase();
    case "braces": return `{${g}}`;
    case "nodash": return g.replace(/-/g, "");
    default:       return g;
  }
}

function run() {
  const count = Math.max(1, Math.min(500, parseInt($("#opt-count").value, 10) || 1));
  const mode = $("#opt-format").value;
  const out = Array.from({ length: count }, () => fmt(uuid4(), mode)).join("\n");
  $("#output").value = out;
  setStatus(`${count} GUID${count === 1 ? "" : "s"}`, "ok");
}

// Auto-regenerate when count or format changes; the explicit button stays
// because GUIDs are random and the user often wants a fresh batch on demand.
bindRun(run, { auto: true });
// Generate one batch on first load so the page isn't empty.
run();

// Recursively transform object keys to a target case style. Operates on
// plain objects + arrays — leaves Dates, primitives, and other types alone.
const SPLIT = /[_\-\s]+|(?<=[a-z0-9])(?=[A-Z])|(?<=[A-Z])(?=[A-Z][a-z])/g;

function tokens(s) {
  return String(s).split(SPLIT).filter(Boolean);
}

const TRANSFORMS = {
  preserve: s => s,
  camel:    s => { const t = tokens(s); return t[0]?.toLowerCase() + t.slice(1).map(cap).join(""); },
  pascal:   s => tokens(s).map(cap).join(""),
  snake:    s => tokens(s).map(t => t.toLowerCase()).join("_"),
  kebab:    s => tokens(s).map(t => t.toLowerCase()).join("-"),
  upper:    s => tokens(s).map(t => t.toUpperCase()).join("_"),
};

function cap(s) { return s ? s[0].toUpperCase() + s.slice(1).toLowerCase() : s; }

export function transformKeys(value, mode) {
  const fn = TRANSFORMS[mode] || TRANSFORMS.preserve;
  if (mode === "preserve") return value;
  return walk(value, fn);
}

function walk(v, fn) {
  if (Array.isArray(v)) return v.map(x => walk(x, fn));
  if (v && typeof v === "object" && v.constructor === Object) {
    const out = {};
    for (const [k, val] of Object.entries(v)) out[fn(k)] = walk(val, fn);
    return out;
  }
  return v;
}

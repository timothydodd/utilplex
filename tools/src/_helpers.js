// Tiny helpers used by every tool entry. Kept as a module so esbuild
// dedupes them across bundles when shared via static imports.

export const $  = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

export function setStatus(msg, kind = "") {
  const el = $("[data-status]");
  if (!el) return;
  el.textContent = msg;
  el.classList.remove("is-error", "is-ok");
  if (kind === "error") el.classList.add("is-error");
  else if (kind === "ok") el.classList.add("is-ok");
}

// Wire up the run button + Ctrl/Cmd-Enter shortcut. With `auto: true` the
// handler also runs on input changes (debounced) and on option-control
// changes (immediate) — the page becomes "live" and the explicit button
// stays as a manual fallback.
//
// `inputs` selectors are watched for `input` events.
// `options` matches the option controls (selects, checkboxes, number fields)
//   — by convention every tool's option ids start with `opt-`.
export function bindRun(handler, opts = {}) {
  const {
    auto = false,
    debounce = 150,
    inputs = ["#input"],
    options = "[id^='opt-']",
  } = opts;

  const button = $('[data-action="run"]');
  if (button) button.addEventListener("click", () => safe(handler));
  document.addEventListener("keydown", e => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      safe(handler);
    }
  });

  let t;
  const debounced = () => { clearTimeout(t); t = setTimeout(() => safe(handler), debounce); };

  if (!auto) return debounced;

  for (const sel of inputs) {
    const el = $(sel);
    if (el) el.addEventListener("input", debounced);
  }

  document.querySelectorAll(options).forEach(el => {
    if (el.type === "number" || el.type === "text") {
      el.addEventListener("input", debounced);
    } else {
      el.addEventListener("change", () => safe(handler));
    }
  });

  return debounced;
}

export function bindSample(getSample) {
  const b = $('[data-action="sample"]');
  if (!b) return;
  b.addEventListener("click", () => writeValue($("#input"), getSample()));
}

// Element-or-CM aware accessors. Tool code can stay agnostic about whether
// the host is a textarea or a CodeMirror editor.
export function readValue(target) {
  if (!target) return "";
  if (target.__upEditor) return target.__upEditor.getValue();
  if ("value" in target) return target.value;
  return target.textContent || "";
}
export function writeValue(target, v) {
  if (!target) return;
  if (target.__upEditor) { target.__upEditor.setValue(v); return; }
  if ("value" in target) {
    target.value = v;
    target.dispatchEvent(new Event("input", { bubbles: true }));
    return;
  }
  target.textContent = v;
}

function safe(fn) {
  try {
    const out = fn();
    // Async handlers — surface promise rejections to the status line so
    // Prettier parse errors don't get swallowed.
    if (out && typeof out.then === "function") {
      out.catch(e => setStatus(e?.message || String(e), "error"));
    }
  } catch (e) {
    setStatus(e?.message || String(e), "error");
  }
}

export function indentValue(sel) {
  const v = $(sel)?.value;
  if (v === "tab") return "\t";
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? " ".repeat(n) : "  ";
}

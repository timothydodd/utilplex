import { $, bindRun, setStatus } from "./_helpers.js";

function encode(text, urlsafe) {
  // UTF-8 safe encode using TextEncoder + btoa.
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  let out = btoa(bin);
  if (urlsafe) out = out.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return out;
}

function decode(text, urlsafe) {
  let s = text.trim();
  if (urlsafe) {
    s = s.replace(/-/g, "+").replace(/_/g, "/");
    while (s.length % 4) s += "=";
  }
  const bin = atob(s);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

function run() {
  const input = $("#input").value;
  if (!input) { $("#output").value = ""; setStatus(""); return; }
  const mode = $("#opt-mode").value;
  const urlsafe = $("#opt-urlsafe").checked;
  const out = mode === "encode" ? encode(input, urlsafe) : decode(input, urlsafe);
  $("#output").value = out;
  setStatus(`${mode === "encode" ? "Encoded" : "Decoded"} · ${out.length.toLocaleString()} chars`, "ok");
}

bindRun(run, { auto: true, debounce: 80 });

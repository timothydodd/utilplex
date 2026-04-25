import { $ } from "./_helpers.js";

function measure(s) {
  const chars = [...s].length; // code-point count, not UTF-16 length
  const charsNoSpace = [...s].filter(c => !/\s/.test(c)).length;
  const trimmed = s.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const sentences = trimmed ? (trimmed.match(/[.!?]+(?=\s|$)/g) || []).length || 1 : 0;
  const paragraphs = trimmed ? trimmed.split(/\n{2,}/).filter(Boolean).length : 0;
  const lines = s ? s.split(/\r?\n/).length : 0;
  const bytes = new TextEncoder().encode(s).length;
  // Average reading: 220 wpm.
  const seconds = Math.max(0, Math.round((words / 220) * 60));
  const reading = seconds < 60 ? `${seconds}s` : `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  return { chars, charsNoSpace, words, sentences, paragraphs, lines, bytes, reading };
}

const input = $("#input");
const fields = ["chars","charsNoSpace","words","sentences","paragraphs","lines","bytes","reading"];

function update() {
  const m = measure(input.value);
  for (const k of fields) {
    const el = document.querySelector(`[data-stat="${k}"]`);
    if (el) el.textContent = typeof m[k] === "number" ? m[k].toLocaleString() : m[k];
  }
}

input.addEventListener("input", update);
update();

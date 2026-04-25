import { diffLines } from "diff";
import { $, bindRun, setStatus } from "./_helpers.js";

function escapeHtml(s) {
  return s.replace(/[<>&]/g, c => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]));
}

function run() {
  const a = $("#input-a").value;
  const b = $("#input-b").value;
  const ignoreWs = $("#opt-ignore-ws").checked;
  if (!a && !b) { $("#diff-output").innerHTML = ""; setStatus(""); return; }
  const parts = diffLines(a, b, { ignoreWhitespace: ignoreWs });
  let added = 0, removed = 0;
  const html = parts.map(p => {
    if (p.added)  { added   += p.count || 0; return `<span class="added">${escapeHtml(p.value)}</span>`; }
    if (p.removed){ removed += p.count || 0; return `<span class="removed">${escapeHtml(p.value)}</span>`; }
    return `<span class="ctx">${escapeHtml(p.value)}</span>`;
  }).join("");
  $("#diff-output").innerHTML = html;
  setStatus(`+${added} added · -${removed} removed`, added || removed ? "ok" : "");
}

bindRun(run, { auto: true, debounce: 200, inputs: ["#input-a", "#input-b"] });

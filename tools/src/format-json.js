import { json } from "@codemirror/lang-json";
import { $, bindRun, bindSample, setStatus, indentValue } from "./_helpers.js";
import { createEditor } from "./_editor.js";

const SAMPLE = `{"name":"UtilPlex","stack":["html","css","js"],"runs":{"in":"browser","online":true},"counts":{"tools":15}}`;

// Mount the output editor first so we can hand its setValue to the input
// editor's onChange via the closure.
const outputEd = createEditor({ host: $("#output"), language: json(), readonly: true });

// Set up auto-run plumbing: bindRun({ inputs: [] }) wires the run button +
// option controls but skips the input event (we listen via CM's onChange).
const debounced = bindRun(run, { auto: true, inputs: [] });

const inputEd = createEditor({
  host: $("#input"),
  language: json(),
  onChange: debounced,
});

function run() {
  const input = inputEd.getValue();
  if (!input.trim()) { outputEd.setValue(""); setStatus(""); return; }
  let parsed;
  try {
    parsed = JSON.parse(input);
  } catch (e) {
    setStatus(formatJsonError(e, input), "error");
    return;
  }
  const mode = $("#opt-mode").value;
  const indent = mode === "minify" ? 0 : indentValue("#opt-indent");
  const out = JSON.stringify(parsed, null, indent || undefined);
  outputEd.setValue(out);
  setStatus(`${mode === "minify" ? "Minified" : "Beautified"} · ${out.length.toLocaleString()} chars`, "ok");
}

bindSample(() => SAMPLE);

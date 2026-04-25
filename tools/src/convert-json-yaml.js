import yaml from "js-yaml";
import { json } from "@codemirror/lang-json";
import { yaml as yamlLang } from "@codemirror/lang-yaml";
import { $, bindRun, bindSample, setStatus } from "./_helpers.js";
import { createEditor } from "./_editor.js";
import { transformKeys } from "./_case.js";

const SAMPLE = `{"name":"UtilPlex","tools":[{"slug":"json","entry":"format-json"},{"slug":"sql","entry":"format-sql"}],"runsInBrowser":true}`;

const outputEd = createEditor({ host: $("#output"), language: yamlLang(), readonly: true });
const debounced = bindRun(run, { auto: true, inputs: [] });
const inputEd  = createEditor({ host: $("#input"),  language: json(),     onChange: debounced });

function run() {
  const input = inputEd.getValue();
  if (!input.trim()) { outputEd.setValue(""); setStatus(""); return; }
  let parsed;
  try { parsed = JSON.parse(input); }
  catch (e) { setStatus(`Invalid JSON: ${e.message}`, "error"); return; }
  const transformed = transformKeys(parsed, $("#opt-case").value);
  const indent = parseInt($("#opt-indent").value, 10) || 2;
  const out = yaml.dump(transformed, { indent, lineWidth: 120, noRefs: true });
  outputEd.setValue(out);
  setStatus(`Converted · ${out.length.toLocaleString()} chars`, "ok");
}

bindSample(() => SAMPLE);

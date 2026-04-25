import yaml from "js-yaml";
import { json } from "@codemirror/lang-json";
import { yaml as yamlLang } from "@codemirror/lang-yaml";
import { $, bindRun, bindSample, setStatus, indentValue } from "./_helpers.js";
import { createEditor } from "./_editor.js";
import { transformKeys } from "./_case.js";

const SAMPLE = `name: UtilPlex
tools:
  - slug: json
    entry: format-json
  - slug: sql
    entry: format-sql
runs_in_browser: true
`;

const outputEd = createEditor({ host: $("#output"), language: json(),     readonly: true });
const debounced = bindRun(run, { auto: true, inputs: [] });
const inputEd  = createEditor({ host: $("#input"),  language: yamlLang(), onChange: debounced });

function run() {
  const input = inputEd.getValue();
  if (!input.trim()) { outputEd.setValue(""); setStatus(""); return; }
  let parsed;
  try { parsed = yaml.load(input); }
  catch (e) { setStatus(`Invalid YAML: ${e.message}`, "error"); return; }
  const transformed = transformKeys(parsed, $("#opt-case").value);
  const out = JSON.stringify(transformed, null, indentValue("#opt-indent"));
  outputEd.setValue(out);
  setStatus(`Converted · ${out.length.toLocaleString()} chars`, "ok");
}

bindSample(() => SAMPLE);

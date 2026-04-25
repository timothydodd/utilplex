import { format } from "sql-formatter";
import { sql } from "@codemirror/lang-sql";
import { $, bindRun, bindSample, setStatus } from "./_helpers.js";
import { createEditor } from "./_editor.js";

const SAMPLE =
  "select u.id, u.name, count(o.id) as orders from users u left join orders o on o.user_id=u.id where u.active=1 group by u.id, u.name order by orders desc limit 25;";

const outputEd = createEditor({ host: $("#output"), language: sql(), readonly: true });
const debounced = bindRun(run, { auto: true, debounce: 200, inputs: [] });
const inputEd  = createEditor({ host: $("#input"), language: sql(), onChange: debounced });

function run() {
  const input = inputEd.getValue();
  if (!input.trim()) { outputEd.setValue(""); setStatus(""); return; }
  const language = $("#opt-dialect").value;
  const tabWidth = $("#opt-indent").value === "tab" ? 1 : parseInt($("#opt-indent").value, 10) || 2;
  const useTabs  = $("#opt-indent").value === "tab";
  const keywordCase = $("#opt-case").value;
  const out = format(input, { language, tabWidth, useTabs, keywordCase });
  outputEd.setValue(out);
  setStatus(`Formatted · ${out.length.toLocaleString()} chars`, "ok");
}

bindSample(() => SAMPLE);

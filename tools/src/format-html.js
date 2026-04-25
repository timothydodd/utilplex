import jsBeautify from "js-beautify";
import { html } from "@codemirror/lang-html";
import { $, bindRun, bindSample, setStatus } from "./_helpers.js";
import { createEditor } from "./_editor.js";

const SAMPLE = `<!doctype html><html><head><title>Hi</title></head><body><main><h1>Hello</h1><p>World <a href="/">link</a></p><ul><li>a</li><li>b</li></ul></main></body></html>`;

const outputEd = createEditor({ host: $("#output"), language: html(), readonly: true });
const debounced = bindRun(run, { auto: true, debounce: 200, inputs: [] });
const inputEd = createEditor({ host: $("#input"), language: html(), onChange: debounced });

function run() {
  const input = inputEd.getValue();
  if (!input.trim()) { outputEd.setValue(""); setStatus(""); return; }
  const indent = $("#opt-indent").value;
  const wrap = parseInt($("#opt-width").value, 10) || 120;
  const out = jsBeautify.html(input, {
    indent_size: indent === "tab" ? 1 : parseInt(indent, 10) || 2,
    indent_with_tabs: indent === "tab",
    wrap_line_length: wrap,
    end_with_newline: true,
    preserve_newlines: true,
    max_preserve_newlines: 1,
    indent_inner_html: true,
    unformatted: ["code", "pre"],
  });
  outputEd.setValue(out);
  setStatus(`Formatted · ${out.length.toLocaleString()} chars`, "ok");
}

bindSample(() => SAMPLE);

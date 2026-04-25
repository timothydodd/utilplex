// Shared prettier wrapper — every prettier-backed tool funnels through here.
import * as prettier from "prettier/standalone";
import { $, bindRun, bindSample, setStatus } from "./_helpers.js";
import { createEditor } from "./_editor.js";

export function setupPrettier({ parser, plugins, sample, language }) {
  const outputEd = createEditor({ host: $("#output"), language, readonly: true });
  // Prettier's TS/Babel parsers are heavier than the format/parse wrappers
  // in the other tools — bump the debounce so a fast typist isn't re-running
  // a parse on every keystroke.
  const debounced = bindRun(run, { auto: true, debounce: 300, inputs: [] });
  const inputEd  = createEditor({ host: $("#input"), language, onChange: debounced });

  async function run() {
    const input = inputEd.getValue();
    if (!input.trim()) { outputEd.setValue(""); setStatus(""); return; }
    try {
      const out = await prettier.format(input, {
        parser,
        plugins,
        tabWidth: parseInt($("#opt-indent")?.value, 10) || 2,
        printWidth: parseInt($("#opt-width")?.value, 10) || 80,
        singleQuote: $("#opt-quotes")?.value === "single",
        semi: true,
      });
      outputEd.setValue(out);
      setStatus(`Formatted · ${out.length.toLocaleString()} chars`, "ok");
    } catch (e) {
      setStatus(e?.message || String(e), "error");
    }
  }

  bindSample(() => sample);
}

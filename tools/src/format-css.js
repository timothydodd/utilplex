import postcssPlugin from "prettier/plugins/postcss";
import { css } from "@codemirror/lang-css";
import { setupPrettier } from "./_prettier.js";

const SAMPLE = `.btn{display:inline-flex;align-items:center;gap:.5rem;padding:.4rem .8rem;border-radius:6px;background:#c2368f;color:#fff}.btn:hover{background:#8b2fa8}`;

setupPrettier({ parser: "css", plugins: [postcssPlugin], sample: SAMPLE, language: css() });

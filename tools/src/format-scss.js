import postcssPlugin from "prettier/plugins/postcss";
// SCSS uses the CSS grammar — close enough for $vars and nested rules.
// Pulling in @codemirror/lang-sass for indented Sass would add a dep we don't
// otherwise need.
import { css } from "@codemirror/lang-css";
import { setupPrettier } from "./_prettier.js";

const SAMPLE = `$accent:#c2368f;.card{padding:1rem;border:1px solid #eee;.title{font-weight:700;color:$accent;&:hover{color:darken($accent,10%);}}}`;

setupPrettier({ parser: "scss", plugins: [postcssPlugin], sample: SAMPLE, language: css() });

import babelPlugin from "prettier/plugins/babel";
import estreePlugin from "prettier/plugins/estree";
import { javascript } from "@codemirror/lang-javascript";
import { setupPrettier } from "./_prettier.js";

const SAMPLE = `function fizzbuzz(n){const out=[];for(let i=1;i<=n;i++){let s='';if(i%3===0)s+='Fizz';if(i%5===0)s+='Buzz';out.push(s||String(i));}return out;}console.log(fizzbuzz(15));`;

setupPrettier({
  parser: "babel",
  plugins: [babelPlugin, estreePlugin],
  sample: SAMPLE,
  language: javascript(),
});

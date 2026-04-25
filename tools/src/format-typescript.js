import tsPlugin from "prettier/plugins/typescript";
import estreePlugin from "prettier/plugins/estree";
import { javascript } from "@codemirror/lang-javascript";
import { setupPrettier } from "./_prettier.js";

const SAMPLE = `interface User<T extends string=string>{id:T;name:string;tags:string[];}function bySlug<U extends User>(list:U[],slug:U["id"]):U|undefined{return list.find(u=>u.id===slug);}`;

setupPrettier({
  parser: "typescript",
  plugins: [tsPlugin, estreePlugin],
  sample: SAMPLE,
  language: javascript({ typescript: true }),
});

// CodeMirror 6 wrapper for formatter / converter tools.
//
// Each tool mounts one input editor and (usually) one read-only output
// editor. The wrapper attaches a small `__upEditor` object to the host
// element so generic copy/clear handlers in main.js can read/write the
// value through the same data-attribute pattern as plain textareas.

import { EditorView, lineNumbers, highlightActiveLine, drawSelection,
         dropCursor, keymap, highlightSpecialChars } from "@codemirror/view";
import { EditorState, Compartment } from "@codemirror/state";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { syntaxHighlighting, HighlightStyle, bracketMatching,
         indentOnInput, foldGutter, foldKeymap, indentUnit } from "@codemirror/language";
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search";
import { tags as t } from "@lezer/highlight";

// Highlight style tuned for the site palette — works on both light and dark
// since most colors come from the brand gradient family (peach/magenta/blue).
const upHighlight = HighlightStyle.define([
  { tag: t.keyword,                color: "var(--cm-keyword)" },
  { tag: [t.atom, t.bool, t.null], color: "var(--cm-atom)" },
  { tag: [t.number],               color: "var(--cm-number)" },
  { tag: [t.string, t.special(t.string)], color: "var(--cm-string)" },
  { tag: t.regexp,                 color: "var(--cm-regex)" },
  { tag: [t.propertyName, t.attributeName], color: "var(--cm-prop)" },
  { tag: [t.function(t.variableName), t.function(t.propertyName)], color: "var(--cm-func)" },
  { tag: [t.typeName, t.className], color: "var(--cm-type)" },
  { tag: t.operator,               color: "var(--cm-operator)" },
  { tag: t.comment,                color: "var(--cm-comment)", fontStyle: "italic" },
  { tag: t.tagName,                color: "var(--cm-tag)" },
  { tag: t.heading,                color: "var(--cm-keyword)", fontWeight: "700" },
  { tag: t.invalid,                color: "var(--cm-invalid)" },
  { tag: t.meta,                   color: "var(--cm-meta)" },
]);

// Editor chrome theme — uses the site's CSS custom properties so light/dark
// switch follows html.dark automatically. No per-token JS work on theme flip.
const baseTheme = EditorView.theme({
  "&": {
    height: "100%",
    color: "var(--color-ink)",
    backgroundColor: "var(--color-surface)",
    fontSize: "0.88rem",
  },
  "&.cm-focused": { outline: "none" },
  ".cm-scroller": {
    fontFamily: "var(--font-mono)",
    lineHeight: "1.55",
  },
  ".cm-content": { padding: "0.6rem 0", caretColor: "var(--color-accent)" },
  ".cm-gutters": {
    backgroundColor: "var(--color-bg-soft)",
    color: "var(--color-muted)",
    border: "0",
    borderRight: "1px solid var(--color-rule)",
  },
  ".cm-gutterElement": { padding: "0 0.55rem 0 0.5rem" },
  ".cm-activeLineGutter": { backgroundColor: "transparent", color: "var(--color-accent)" },
  ".cm-activeLine": {
    backgroundColor: "color-mix(in srgb, var(--color-accent) 6%, transparent)",
  },
  ".cm-cursor": { borderLeftColor: "var(--color-accent)", borderLeftWidth: "2px" },
  ".cm-selectionBackground, ::selection": {
    backgroundColor: "color-mix(in srgb, var(--color-accent) 22%, transparent) !important",
  },
  ".cm-selectionMatch": {
    backgroundColor: "color-mix(in srgb, var(--color-accent) 14%, transparent)",
  },
  ".cm-matchingBracket": {
    outline: "1px solid color-mix(in srgb, var(--color-accent) 50%, transparent)",
    backgroundColor: "transparent",
  },
  ".cm-foldPlaceholder": {
    backgroundColor: "var(--color-bg-soft)",
    border: "1px solid var(--color-rule)",
    color: "var(--color-muted)",
    padding: "0 .35rem",
    borderRadius: "3px",
  },
});

const COMMON = [
  lineNumbers(),
  foldGutter(),
  highlightSpecialChars(),
  drawSelection(),
  dropCursor(),
  history(),
  indentOnInput(),
  bracketMatching(),
  highlightSelectionMatches(),
  syntaxHighlighting(upHighlight),
  EditorView.lineWrapping,
  keymap.of([indentWithTab, ...defaultKeymap, ...searchKeymap, ...historyKeymap, ...foldKeymap]),
  baseTheme,
];

export function createEditor({ host, language, readonly = false, initial = "", onChange, indent = "  " }) {
  const ext = [...COMMON, indentUnit.of(indent)];
  if (language) ext.push(language);
  if (readonly) ext.push(EditorState.readOnly.of(true), EditorView.editable.of(false));
  if (onChange) {
    ext.push(EditorView.updateListener.of(u => {
      if (u.docChanged) onChange(u.state.doc.toString());
    }));
  }
  const view = new EditorView({
    state: EditorState.create({ doc: initial, extensions: ext }),
    parent: host,
  });
  // Stash a tiny adapter on the host so generic copy/clear handlers can
  // detect a CM editor without depending on private CM internals.
  const api = {
    view,
    getValue: () => view.state.doc.toString(),
    setValue: v => view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: v },
    }),
    focus: () => view.focus(),
  };
  host.__upEditor = api;
  return api;
}

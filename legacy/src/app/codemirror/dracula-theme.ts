import { EditorView } from '@codemirror/view';
import { Extension } from '@codemirror/state';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';

const draculaColors = {
  background: '#1a1a2e',
  foreground: '#f1f5f9',
  selection: '#3d4852',
  lineHighlight: '#252b3a',
  cursor: '#50fa7b',
  comment: '#8be9fd',
  string: '#50fa7b',
  number: '#bd93f9',
  keyword: '#8be9fd',
  function: '#8be9fd',
  className: '#50fa7b',
  tag: '#8be9fd',
  attribute: '#50fa7b',
  property: '#8be9fd',
  variable: '#8be9fd',
  constant: '#bd93f9',
  type: '#bd93f9',
  operator: '#ff79c6',
  punctuation: '#f8f8f2',
  bracket: '#f8f8f2',
  invalid: '#ff5555',
  deprecated: '#ffb86c',
  lineNumber: '#64748b',
  activeLineNumber: '#8be9fd',
  gutter: '#16213e',
  scrollbar: '#50fa7b30',
  scrollbarHover: '#50fa7b50',
  scrollbarActive: '#50fa7b70',
};

const draculaTheme = EditorView.theme({
  '&': {
    color: draculaColors.foreground,
    backgroundColor: draculaColors.background,
  },
  '.cm-content': {
    padding: '16px',
    caretColor: draculaColors.cursor,
  },
  '.cm-focused .cm-cursor': {
    borderLeftColor: draculaColors.cursor,
  },
  '.cm-focused .cm-selectionBackground, ::selection': {
    backgroundColor: draculaColors.selection,
  },
  '.cm-selectionBackground': {
    backgroundColor: `${draculaColors.selection}99`,
  },
  '.cm-activeLine': {
    backgroundColor: draculaColors.lineHighlight,
  },
  '.cm-gutters': {
    backgroundColor: draculaColors.gutter,
    color: draculaColors.lineNumber,
    borderRight: 'none',
  },
  '.cm-activeLineGutter': {
    backgroundColor: draculaColors.lineHighlight,
    color: draculaColors.activeLineNumber,
  },
  '.cm-lineNumbers': {
    color: draculaColors.lineNumber,
  },
  '.cm-foldPlaceholder': {
    backgroundColor: 'transparent',
    border: 'none',
    color: draculaColors.comment,
  },
  '.cm-tooltip': {
    border: 'none',
    backgroundColor: draculaColors.background,
    color: draculaColors.foreground,
  },
  '.cm-tooltip-autocomplete': {
    '& > ul > li[aria-selected]': {
      backgroundColor: draculaColors.selection,
      color: draculaColors.foreground,
    }
  },
  '.cm-searchMatch': {
    backgroundColor: '#50fa7b40',
    outline: '1px solid #50fa7b',
  },
  '.cm-searchMatch.cm-searchMatch-selected': {
    backgroundColor: '#50fa7b80',
  },
  '.cm-panels': {
    backgroundColor: draculaColors.gutter,
    color: draculaColors.foreground,
  },
  '.cm-panels.cm-panels-top': {
    borderBottom: '2px solid #374151',
  },
  '.cm-panels.cm-panels-bottom': {
    borderTop: '2px solid #374151',
  },
  '.cm-scroller': {
    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
    fontSize: '14px',
    lineHeight: '1.5',
  },
}, { dark: true });

const draculaHighlightStyle = HighlightStyle.define([
  { tag: t.comment, color: draculaColors.comment, fontStyle: 'italic' },
  { tag: t.lineComment, color: draculaColors.comment, fontStyle: 'italic' },
  { tag: t.blockComment, color: draculaColors.comment, fontStyle: 'italic' },
  { tag: t.docComment, color: draculaColors.comment, fontStyle: 'italic' },
  
  { tag: t.keyword, color: draculaColors.keyword, fontWeight: 'bold' },
  { tag: t.controlKeyword, color: draculaColors.keyword, fontWeight: 'bold' },
  { tag: t.modifier, color: draculaColors.keyword, fontWeight: 'bold' },
  { tag: t.operatorKeyword, color: draculaColors.keyword, fontWeight: 'bold' },
  
  { tag: t.variableName, color: draculaColors.variable },
  { tag: t.typeName, color: draculaColors.type, fontStyle: 'italic' },
  { tag: t.atom, color: draculaColors.constant },
  { tag: t.bool, color: draculaColors.constant },
  { tag: t.special(t.variableName), color: draculaColors.constant },
  
  { tag: t.number, color: draculaColors.number },
  { tag: t.string, color: draculaColors.string },
  { tag: t.special(t.string), color: draculaColors.string },
  { tag: t.regexp, color: draculaColors.string },
  
  { tag: t.definition(t.typeName), color: draculaColors.className, fontWeight: 'bold' },
  { tag: t.className, color: draculaColors.className, fontWeight: 'bold' },
  { tag: t.definition(t.propertyName), color: draculaColors.function, fontWeight: 'bold' },
  { tag: t.function(t.variableName), color: draculaColors.function, fontWeight: 'bold' },
  { tag: t.function(t.propertyName), color: draculaColors.function, fontWeight: 'bold' },
  
  { tag: t.tagName, color: draculaColors.tag },
  { tag: t.attributeName, color: draculaColors.attribute },
  { tag: t.attributeValue, color: draculaColors.string },
  
  { tag: t.propertyName, color: draculaColors.property },
  { tag: t.namespace, color: draculaColors.variable },
  { tag: t.macroName, color: draculaColors.function },
  
  { tag: t.operator, color: draculaColors.operator },
  { tag: t.separator, color: draculaColors.punctuation },
  { tag: t.punctuation, color: draculaColors.punctuation },
  { tag: t.bracket, color: draculaColors.bracket },
  { tag: t.angleBracket, color: draculaColors.bracket },
  { tag: t.squareBracket, color: draculaColors.bracket },
  { tag: t.paren, color: draculaColors.bracket },
  { tag: t.brace, color: draculaColors.bracket },
  
  { tag: t.invalid, color: draculaColors.invalid, fontWeight: 'bold' },
  { tag: t.deleted, color: draculaColors.invalid, backgroundColor: '#ff555540' },
  { tag: t.inserted, color: draculaColors.string, backgroundColor: '#50fa7b40' },
  { tag: t.changed, color: draculaColors.deprecated, backgroundColor: '#ffb86c40' },
  
  { tag: t.strong, fontWeight: 'bold' },
  { tag: t.emphasis, fontStyle: 'italic' },
  { tag: t.strikethrough, textDecoration: 'line-through' },
  { tag: t.link, color: draculaColors.string, textDecoration: 'underline' },
  { tag: t.heading, color: draculaColors.function, fontWeight: 'bold' },
]);

export const draculaExtension: Extension = [
  draculaTheme,
  syntaxHighlighting(draculaHighlightStyle),
];
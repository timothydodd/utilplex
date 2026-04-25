import { Extension } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';
import { sql } from '@codemirror/lang-sql';
import { css } from '@codemirror/lang-css';
import { yaml } from '@codemirror/lang-yaml';
import { xml } from '@codemirror/lang-xml';

export const getLanguageExtension = (language: string): Extension[] => {
  switch (language.toLowerCase()) {
    case 'javascript':
    case 'js':
      return [javascript({ jsx: false, typescript: false })];
    case 'typescript':
    case 'ts':
      return [javascript({ jsx: false, typescript: true })];
    case 'json':
    case 'jsonc':
      return [json()];
    case 'sql':
      return [sql()];
    case 'css':
    case 'scss':
    case 'sass':
    case 'less':
      return [css()];
    case 'yaml':
    case 'yml':
      return [yaml()];
    case 'xml':
    case 'html':
    case 'htm':
      return [xml()];
    default:
      return [];
  }
};
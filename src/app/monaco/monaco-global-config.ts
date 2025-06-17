import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { NgxMonacoEditorConfig } from '../components/editor/config';

declare const monaco: any;

export class MonacoEditorConfig implements NgxMonacoEditorConfig {
  platformId = inject(PLATFORM_ID);
  get nativeWindow(): Window | null {
    return isPlatformBrowser(this.platformId) ? window : null;
  }
  get origin(): string | null {
    return this.nativeWindow?.location.origin ?? null;
  }

  baseUrl?: string | undefined = this.origin + '/assets/monaco/min/vs';

  onMonacoLoad(editor: any) {
    // Define the custom theme

    monaco.editor.defineTheme('dracula', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        {
          background: '1a1a2e',
          token: '',
        },
        {
          foreground: '8be9fd',
          fontStyle: 'italic',
          token: 'comment',
        },
        {
          foreground: '50fa7b',
          token: 'string',
        },
        {
          foreground: 'bd93f9',
          token: 'constant.numeric',
        },
        {
          foreground: 'bd93f9',
          token: 'constant.language',
        },
        {
          foreground: 'bd93f9',
          token: 'constant.character',
        },
        {
          foreground: 'bd93f9',
          token: 'constant.other',
        },
        {
          foreground: '8be9fd',
          token: 'variable.other.readwrite.instance',
        },
        {
          foreground: '50fa7b',
          token: 'constant.character.escaped',
        },
        {
          foreground: '50fa7b',
          token: 'constant.character.escape',
        },
        {
          foreground: '50fa7b',
          token: 'string source',
        },
        {
          foreground: '50fa7b',
          token: 'string source.ruby',
        },
        {
          foreground: '8be9fd',
          fontStyle: 'bold',
          token: 'keyword',
        },
        {
          foreground: '8be9fd',
          fontStyle: 'bold',
          token: 'storage',
        },
        {
          foreground: '50fa7b',
          fontStyle: 'italic',
          token: 'storage.type',
        },
        {
          foreground: '50fa7b',
          fontStyle: 'bold',
          token: 'entity.name.class',
        },
        {
          foreground: '50fa7b',
          fontStyle: 'italic',
          token: 'entity.other.inherited-class',
        },
        {
          foreground: '8be9fd',
          fontStyle: 'bold',
          token: 'entity.name.function',
        },
        {
          foreground: 'bd93f9',
          fontStyle: 'italic',
          token: 'variable.parameter',
        },
        {
          foreground: '8be9fd',
          token: 'entity.name.tag',
        },
        {
          foreground: '50fa7b',
          token: 'entity.other.attribute-name',
        },
        {
          foreground: '8be9fd',
          token: 'support.function',
        },
        {
          foreground: '50fa7b',
          token: 'support.constant',
        },
        {
          foreground: 'bd93f9',
          fontStyle: 'italic',
          token: 'support.type',
        },
        {
          foreground: 'bd93f9',
          fontStyle: 'italic',
          token: 'support.class',
        },
        {
          foreground: 'ffffff',
          background: 'ff5555',
          token: 'invalid',
        },
        {
          foreground: 'ffffff',
          background: 'ffb86c',
          token: 'invalid.deprecated',
        },
        {
          foreground: 'e2e8f0',
          token: 'meta.structure.dictionary.json string.quoted.double.json',
        },
        {
          foreground: '8be9fd',
          fontStyle: 'italic',
          token: 'meta.diff',
        },
        {
          foreground: '8be9fd',
          fontStyle: 'italic',
          token: 'meta.diff.header',
        },
        {
          foreground: 'ff5555',
          token: 'markup.deleted',
        },
        {
          foreground: '50fa7b',
          token: 'markup.inserted',
        },
        {
          foreground: 'ffb86c',
          token: 'markup.changed',
        },
        {
          foreground: 'bd93f9',
          token: 'constant.numeric.line-number.find-in-files - match',
        },
        {
          foreground: 'ffb86c',
          token: 'entity.name.filename',
        },
        {
          foreground: 'ff5555',
          fontStyle: 'bold',
          token: 'message.error',
        },
        {
          foreground: 'f1f5f9',
          token: 'punctuation.definition.string.begin.json - meta.structure.dictionary.value.json',
        },
        {
          foreground: 'f1f5f9',
          token: 'punctuation.definition.string.end.json - meta.structure.dictionary.value.json',
        },
        {
          foreground: '8be9fd',
          token: 'meta.structure.dictionary.json string.quoted.double.json',
        },
        {
          foreground: '50fa7b',
          token: 'meta.structure.dictionary.value.json string.quoted.double.json',
        },
        {
          foreground: '50fa7b',
          token: 'meta meta meta meta meta meta meta.structure.dictionary.value string',
        },
        {
          foreground: '8be9fd',
          token: 'meta meta meta meta meta meta.structure.dictionary.value string',
        },
        {
          foreground: 'bd93f9',
          token: 'meta meta meta meta meta.structure.dictionary.value string',
        },
        {
          foreground: '50fa7b',
          token: 'meta meta meta meta.structure.dictionary.value string',
        },
        {
          foreground: '8be9fd',
          token: 'meta meta meta.structure.dictionary.value string',
        },
        {
          foreground: 'bd93f9',
          token: 'meta meta.structure.dictionary.value string',
        },
      ],
      colors: {
        'editor.foreground': '#f1f5f9',
        'editor.background': '#1a1a2e',
        'editor.selectionBackground': '#3d4852',
        'editor.lineHighlightBackground': '#252b3a',
        'editorCursor.foreground': '#50fa7b',
        'editorWhitespace.foreground': '#475569',
        'editorIndentGuide.background': '#374151',
        'editorIndentGuide.activeBackground': '#50fa7b80',
        'editor.selectionHighlightBorder': '#8be9fd40',
        'editorLineNumber.foreground': '#64748b',
        'editorLineNumber.activeForeground': '#8be9fd',
        'scrollbarSlider.background': '#50fa7b30',
        'scrollbarSlider.hoverBackground': '#50fa7b50',
        'scrollbarSlider.activeBackground': '#50fa7b70',
        'editorGutter.background': '#16213e',
        'editorError.foreground': '#ff5555',
        'editorWarning.foreground': '#ffb86c',
        'editorInfo.foreground': '#8be9fd',
        'editorHint.foreground': '#50fa7b',
      },
    });
  }
}

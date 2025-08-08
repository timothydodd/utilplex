import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  OnChanges,
  SimpleChanges,
  PLATFORM_ID,
  inject,
  input,
  output,
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { DiffEditor } from '@acrodata/code-editor';
import { basicSetup } from 'codemirror';
import { Extension } from '@codemirror/state';
import { draculaExtension } from '../../codemirror/dracula-theme';
import { getLanguageExtension } from '../../codemirror/language-extensions';

export interface DiffEditorModel {
  code: string;
  language?: string;
}

export interface CodeMirrorDiffConfig {
  theme?: string;
  language?: string;
  readOnly?: boolean;
  wordWrap?: boolean;
  automaticLayout?: boolean;
  scrollBeyondLastLine?: boolean;
}

@Component({
  selector: 'ngx-monaco-diff-editor',
  template: `@if (isBrowser) {
    <diff-editor
      [original]="originalValue"
      [modified]="modifiedValue"
      [extensions]="extensions"
      [readOnly]="config()?.readOnly || false"
    ></diff-editor>
  } @else {
    <div class="editor-placeholder">
      <p>Diff editor will load in browser...</p>
    </div>
  }`,
  styles: [`
    :host {
      display: block;
      height: 200px;
    }
    diff-editor {
      height: 100%;
    }
    .cm-editor {
      height: 100%;
    }
    .cm-scroller {
      height: 100%;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [DiffEditor, CommonModule],
})
export class CodeMirrorDiffEditorComponent implements OnChanges {
  config = input<CodeMirrorDiffConfig>({});
  originalModel = input<DiffEditorModel | undefined>();
  modifiedModel = input<DiffEditorModel | undefined>();
  onInit = output<any>();

  originalValue = '';
  modifiedValue = '';
  extensions: Extension[] = [];
  isBrowser: boolean;

  constructor() {
    this.isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] || changes['originalModel'] || changes['modifiedModel']) {
      this.updateValues();
      this.updateExtensions();
    }
  }

  private updateValues(): void {
    this.originalValue = this.originalModel()?.code || '';
    this.modifiedValue = this.modifiedModel()?.code || '';
  }

  private updateExtensions(): void {
    if (this.isBrowser) {
      const language = this.config().language || 
                      this.originalModel()?.language || 
                      this.modifiedModel()?.language || '';
      
      this.extensions = [
        basicSetup,
        ...getLanguageExtension(language),
        draculaExtension,
      ];

      if (this.config.wordWrap) {
        // Add word wrap extension when available
      }
    }
  }
}
import { CodeEditor } from '@acrodata/code-editor';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  PLATFORM_ID,
  SimpleChanges,
  ViewEncapsulation,
  forwardRef,
  inject,
  input,
  output,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { indentWithTab } from '@codemirror/commands';
import { Extension } from '@codemirror/state';
import { keymap } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { draculaExtension } from '../../codemirror/dracula-theme';
import { getLanguageExtension } from '../../codemirror/language-extensions';

export interface CodeMirrorConfig {
  theme?: string;
  language?: string;
  readOnly?: boolean;
  wordWrap?: boolean;
  automaticLayout?: boolean;
  scrollBeyondLastLine?: boolean;
  minimap?: {
    enabled: boolean;
  };
}

@Component({
  selector: 'app-codemirror-editor',
  template: `@if (isBrowser) {
      <code-editor
        [(ngModel)]="internalValue"
        [extensions]="extensions"
        [disabled]="config().readOnly || false"
        [placeholder]="placeholder()"
      ></code-editor>
    } @else {
      <div class="editor-placeholder">
        <p>Code editor will load in browser...</p>
      </div>
    }`,
  styles: [
    `
      :host {
        display: block;
        height: 200px;
      }
      code-editor {
        height: 100%;
        display: block;
        position: relative;
        z-index: 0;
      }
      .cm-editor {
        height: 100%;
      }
      .cm-scroller {
        height: 100%;
      }
      .editor-placeholder {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--font-color, #666);
        opacity: 0.6;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [CodeEditor, CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CodeMirrorEditorComponent),
      multi: true,
    },
  ],
})
export class CodeMirrorEditorComponent implements ControlValueAccessor, OnChanges {
  config = input<CodeMirrorConfig>({});
  placeholder = input<string>('');
  onInit = output<any>();

  private _value = '';
  extensions: Extension[] = [];
  isBrowser: boolean;

  private onChange = (value: string) => {};
  private onTouched = () => {};

  get internalValue(): string {
    return this._value;
  }

  set internalValue(val: string) {
    if (val !== this._value) {
      this._value = val;
      this.onChange(val);
      this.onTouched();
    }
  }

  constructor() {
    this.isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config']) {
      this.updateExtensions();
    }
  }

  private updateExtensions(): void {
    if (this.isBrowser) {
      this.extensions = [
        basicSetup,
        ...getLanguageExtension(this.config().language || ''),
        draculaExtension,
        keymap.of([indentWithTab]),
      ];

      if (this.config().wordWrap) {
        // Add word wrap extension when available
      }
    }
  }

  // Removed - no longer needed since we're using setter

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    this._value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Handle disabled state if needed
  }
}

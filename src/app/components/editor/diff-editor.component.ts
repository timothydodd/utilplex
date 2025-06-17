import { ChangeDetectionStrategy, Component, NgZone, inject, input, effect, signal } from '@angular/core';
import { fromEvent } from 'rxjs';

import { BaseEditor } from './base-editor';
import { DiffEditorModel } from './types';

declare var monaco: any;

@Component({
  standalone: true,
  selector: 'ngx-monaco-diff-editor',
  template: '<div class="editor-container" #editorContainer></div>',
  styles: [
    `
      :host {
        display: block;
        height: 200px;
      }

      .editor-container {
        width: 100%;
        height: 98%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiffEditorComponent extends BaseEditor {
  private zone = inject(NgZone);

  // Signal inputs
  options = input<any>({});
  originalModel = input<DiffEditorModel | undefined>(undefined);
  modifiedModel = input<DiffEditorModel | undefined>(undefined);

  constructor() {
    super();
    
    // React to options changes
    effect(() => {
      const options = this.options();
      const mergedOptions = Object.assign({}, this.config.defaultOptions, options);
      this._options.set(mergedOptions);
      
      const editor = this._editor();
      if (editor) {
        editor.dispose();
        this.initMonaco(mergedOptions, this.insideNg());
      }
    });

    // React to model changes
    effect(() => {
      const originalModel = this.originalModel();
      const modifiedModel = this.modifiedModel();
      const options = this._options();
      
      if (originalModel && modifiedModel) {
        const editor = this._editor();
        if (editor) {
          editor.dispose();
          this.initMonaco(options, this.insideNg());
        }
      }
    });
  }

  protected initMonaco(options: any, insideNg: boolean): void {
    const originalModel = this.originalModel();
    const modifiedModel = this.modifiedModel();
    
    if (!originalModel || !modifiedModel) {
      throw new Error('originalModel or modifiedModel not found for ngx-monaco-diff-editor');
    }

    originalModel.language = originalModel.language || options.language;
    modifiedModel.language = modifiedModel.language || options.language;

    let original = monaco.editor.createModel(originalModel.code, originalModel.language);
    let modified = monaco.editor.createModel(modifiedModel.code, modifiedModel.language);

    const editorContainer = this._editorContainer();
    if (editorContainer) {
      editorContainer.nativeElement.innerHTML = '';
    }
    const theme = options.theme;

    let editor: any;
    if (insideNg) {
      editor = monaco.editor.createDiffEditor(editorContainer?.nativeElement, options);
    } else {
      this.zone.runOutsideAngular(() => {
        editor = monaco.editor.createDiffEditor(editorContainer?.nativeElement, options);
      });
    }
    
    this._editor.set(editor);

    options.theme = theme;
    editor.setModel({
      original: original,
      modified: modified,
    });

    // refresh layout on resize event.
    if (this._windowResizeSubscription) {
      this._windowResizeSubscription.unsubscribe();
    }
    this._windowResizeSubscription = fromEvent(window, 'resize').subscribe(() => editor.layout());
    this.onInit.emit(editor);
  }
}

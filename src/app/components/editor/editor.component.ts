import { ChangeDetectionStrategy, Component, forwardRef, inject, input, NgZone, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { combineLatest, fromEvent } from 'rxjs';

import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { BaseEditor } from './base-editor';
import { NgxEditorModel } from './types';

declare var monaco: any;

@Component({
  standalone: true,
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'ngx-monaco-editor',
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
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditorComponent),
      multi: true,
    },
  ],
})
export class EditorComponent extends BaseEditor implements ControlValueAccessor {
  private zone = inject(NgZone);

  // Signal inputs
  options = input<any>({});
  model = input<NgxEditorModel | undefined>(undefined);

  // Internal signals
  private _value = signal<string>('');

  propagateChange = (_: any) => {};
  onTouched = () => {};

  constructor() {
    super();

    var ops$ = toObservable(this.options);
    var moel$ = toObservable(this.model);
    combineLatest([ops$, moel$])
      .pipe(takeUntilDestroyed())
      .subscribe(([options, model]) => {
        const mergedOptions = Object.assign({}, this.config.defaultOptions, options);
        this._options.set(mergedOptions);
        this.options().model = model;
        const editor = this._editor();
        if (editor) {
          editor.dispose();
          this.initMonaco(mergedOptions, this.insideNg());
        }
      });
  }

  writeValue(value: any): void {
    this._value.set(value || '');
    // Fix for value change while dispose in process.
    setTimeout(() => {
      const editor = this._editor();
      const model = this.model();
      if (editor && !model) {
        editor.setValue(this._value());
      }
    });
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  protected initMonaco(options: any, insideNg: boolean): void {
    const hasModel = !!options.model;

    if (hasModel) {
      const model = monaco.editor.getModel(options.model.uri || '');
      if (model) {
        options.model = model;
        options.model.setValue(this._value());
      } else {
        options.model = monaco.editor.createModel(options.model.value, options.model.language, options.model.uri);
      }
    }

    let editor: any;
    if (insideNg) {
      editor = monaco.editor.create(this._editorContainer()?.nativeElement, options);
    } else {
      this.zone.runOutsideAngular(() => {
        editor = monaco.editor.create(this._editorContainer()?.nativeElement, options);
      });
    }

    this._editor.set(editor);

    if (!hasModel) {
      editor.setValue(this._value());
    }

    editor.onDidChangeModelContent((e: any) => {
      const value = editor.getValue();

      // value is not propagated to parent when executing outside zone.
      this.zone.run(() => {
        this.propagateChange(value);
        this._value.set(value);
      });
    });

    editor.onDidBlurEditorWidget(() => {
      this.onTouched();
    });

    // refresh layout on resize event.
    if (this._windowResizeSubscription) {
      this._windowResizeSubscription.unsubscribe();
    }
    this._windowResizeSubscription = fromEvent(window, 'resize').subscribe(() => editor.layout());
    this.onInit.emit(editor);
  }
}

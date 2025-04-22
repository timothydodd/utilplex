import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule, NGX_MONACO_EDITOR_CONFIG } from 'ngx-monaco-editor-v2';
import { from } from 'rxjs';

import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { MonacoEditorConfig } from 'src/app/monaco/monaco-global-config';
import { MonacoConfig } from 'src/app/monaco/ng-monaco-config';
import { SwitchComponent } from '../../components/switch/switch.component';
import { EncoderServiceBase } from '../_services/encoder.service';

@Component({
  selector: 'app-encoder-view',
  imports: [CommonModule, FormsModule, MonacoEditorModule, SwitchComponent],
  providers: [{ provide: NGX_MONACO_EDITOR_CONFIG, useClass: MonacoEditorConfig }],
  template: `
    <div *ngIf="error()" class="error">{{ error() }}</div>
    <div class="tool-bar options">
      <div class="option">
        <label>Mode</label>
        <app-switch
          [small]="true"
          [label]="modeLabel()"
          [ngModel]="isEncode()"
          (ngModelChange)="isEncode.set($event)"
        ></app-switch>
      </div>
      <ng-content select="[tools]"></ng-content>
    </div>
    <div class="split-view">
      <div class="editor-wrap">
        <div class="tool-bar section-header">
          <label>Input</label>
          <button class="btn btn-secondary" (click)="pasteClick()">Paste</button>
        </div>
        <div class="sub-wrap">
          <ngx-monaco-editor
            #editor
            class="editor"
            [options]="inputOptions"
            [ngModel]="inputCode()"
            (ngModelChange)="inputChanged($event)"
          ></ngx-monaco-editor>
        </div>
      </div>
      <div class="editor-wrap">
        <div class="tool-bar section-header">
          <label>Output</label>
          <button class="btn btn-secondary" (click)="copyClick()">Copy</button>
        </div>
        <div class="sub-wrap">
          <ngx-monaco-editor class="editor" [options]="outputOptions" [ngModel]="outputCode()"></ngx-monaco-editor>
        </div>
      </div>
    </div>
  `,
  styleUrl: './encoder-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EncoderViewComponent {
  inputOptions: MonacoConfig;
  outputOptions: MonacoConfig;

  inputCode = signal<string>('');
  outputCode = signal<string>('');
  error = signal<string>('');
  mode = signal<string>('encode');
  isEncode = signal<boolean>(true);
  modeLabel = computed(() => (this.isEncode() ? 'Encode' : 'Decode'));
  title = '';

  constructor(private convertService: EncoderServiceBase) {
    this.title = convertService.title;
    toObservable(this.isEncode)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        var output = this.outputCode();
        this.inputCode.set(output);
      });
    this.inputOptions = {
      theme: 'dracula',
      language: '',
    } as MonacoConfig;
    this.outputOptions = {
      theme: 'dracula',
      language: '',
      readOnly: true,
    };
    convertService.optionsChanged.subscribe(() => {
      this.inputChanged(this.inputCode());
    });
  }

  inputChanged(txt: string) {
    this.error.set('');
    this.inputCode.set(txt);
    try {
      this.convertService.convert(this.inputCode(), this.isEncode()).subscribe({
        next: (result) => {
          this.outputCode.set(result);
        },
        error: (err) => {
          this.error.set(err?.message);
        },
      });
    } catch (err: any) {
      this.error.set(err?.message);
    }
  }
  copyClick() {
    from(navigator.clipboard.writeText(this.outputCode())).subscribe();
  }
  pasteClick() {
    from(navigator.clipboard.readText()).subscribe((txt) => this.inputChanged(txt));
  }
}

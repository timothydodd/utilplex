import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { from } from 'rxjs';

import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Meta, Title } from '@angular/platform-browser';
import { getRouteData, RouteService } from 'src/app/_services/route.service';
import { NGX_MONACO_EDITOR_CONFIG } from 'src/app/components/editor/config';
import { EditorComponent } from 'src/app/components/editor/editor.component';
import { MonacoEditorConfig } from 'src/app/monaco/monaco-global-config';
import { MonacoConfig } from 'src/app/monaco/ng-monaco-config';
import { SwitchComponent } from '../../components/switch/switch.component';
import { EncoderServiceBase } from '../_services/encoder.service';

@Component({
  selector: 'app-encoder-view',
  imports: [CommonModule, FormsModule, EditorComponent, SwitchComponent],
  providers: [{ provide: NGX_MONACO_EDITOR_CONFIG, useClass: MonacoEditorConfig }],
  template: `
    <div class="encoder-container">
      <div class="tool-header">
        <div class="tool-info">
          <h1 class="tool-title">{{ convertService.title }}</h1>
          <p class="tool-description">{{ getToolDescription() }}</p>
        </div>
        <div class="mode-controls">
          <div class="mode-switcher">
            <app-switch
              [small]="true"
              [label]="modeLabel()"
              [ngModel]="isEncode()"
              (ngModelChange)="isEncode.set($event)"
            ></app-switch>
          </div>
          <ng-content select="[tools]"></ng-content>
        </div>
      </div>

      <div *ngIf="error()" class="error-banner">
        <div class="error-icon">⚠️</div>
        <div class="error-content">
          <span class="error-title">{{ isEncode() ? 'Encoding' : 'Decoding' }} Error</span>
          <span class="error-message">{{ error() }}</span>
        </div>
      </div>

      <div class="editors-container">
        <div class="editor-panel input-panel">
          <div class="panel-header">
            <div class="panel-title">
              <div class="panel-icon">{{ isEncode() ? '📝' : '🔓' }}</div>
              <h3>{{ isEncode() ? 'Plain Text' : 'Encoded Data' }}</h3>
            </div>
            <div class="panel-actions">
              <button class="action-btn paste-btn" (click)="pasteClick()" title="Paste from clipboard">
                <span class="btn-icon">📋</span>
                Paste
              </button>
              <button class="action-btn clear-btn" (click)="clearInput()" title="Clear input">
                <span class="btn-icon">🗑️</span>
                Clear
              </button>
            </div>
          </div>
          <div class="editor-wrapper">
            <ngx-monaco-editor
              #editor
              class="editor"
              [options]="inputOptions"
              [ngModel]="inputCode()"
              (ngModelChange)="inputChanged($event)"
            ></ngx-monaco-editor>
            <div class="editor-overlay" *ngIf="!inputCode()">
              <div class="placeholder-content">
                <div class="placeholder-icon">{{ isEncode() ? '✏️' : '🔐' }}</div>
                <p class="placeholder-text">
                  {{ isEncode() ? 'Enter text to encode' : 'Paste encoded data to decode' }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="editor-panel output-panel">
          <div class="panel-header">
            <div class="panel-title">
              <div class="panel-icon">{{ isEncode() ? '🔐' : '📄' }}</div>
              <h3>{{ isEncode() ? 'Encoded Output' : 'Decoded Text' }}</h3>
            </div>
            <div class="panel-actions">
              <button
                class="action-btn copy-btn"
                (click)="copyClick()"
                title="Copy to clipboard"
                [disabled]="!outputCode()"
              >
                <span class="btn-icon">📄</span>
                Copy
              </button>
              <button
                class="action-btn download-btn"
                (click)="downloadOutput()"
                title="Download as file"
                [disabled]="!outputCode()"
              >
                <span class="btn-icon">💾</span>
                Download
              </button>
            </div>
          </div>
          <div class="editor-wrapper">
            <ngx-monaco-editor class="editor" [options]="outputOptions" [ngModel]="outputCode()"></ngx-monaco-editor>
            <div class="editor-overlay" *ngIf="!outputCode() && !error()">
              <div class="placeholder-content">
                <div class="placeholder-icon">⏳</div>
                <p class="placeholder-text">
                  {{ isEncode() ? 'Encoded data will appear here' : 'Decoded text will appear here' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './encoder-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EncoderViewComponent {
  convertService = inject(EncoderServiceBase);
  inputOptions: MonacoConfig;
  outputOptions: MonacoConfig;

  inputCode = signal<string>('');
  outputCode = signal<string>('');
  error = signal<string>('');
  mode = signal<string>('encode');
  isEncode = signal<boolean>(true);
  modeLabel = computed(() => (this.isEncode() ? 'Encode' : 'Decode'));
  private meta = inject(Meta);
  private titleService = inject(Title);
  constructor() {
    var data = getRouteData(this.convertService.routeName);
    if (!data) {
      throw new Error('Route data not found for welcome');
    }
    this.titleService.setTitle('UtilPlex |' + data.title);
    if (data.description) this.meta.updateTag({ name: 'description', content: data.description });

    RouteService.Title.set(this.convertService.title);
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
    this.convertService.optionsChanged.subscribe(() => {
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

  clearInput() {
    this.inputChanged('');
  }

  downloadOutput() {
    if (!this.outputCode()) return;

    const blob = new Blob([this.outputCode()], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${this.isEncode() ? 'encoded' : 'decoded'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  getToolDescription(): string {
    const descriptions: Record<string, string> = {
      Base64: 'Encode and decode text using Base64 encoding for secure data transmission and storage',
    };
    return descriptions[this.convertService.routeName] || 'Encode and decode data for secure transmission and storage';
  }
}

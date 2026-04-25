import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { from } from 'rxjs';

import { Meta, Title } from '@angular/platform-browser';
import { getRouteData, RouteService } from 'src/app/_services/route.service';
import { CodeMirrorEditorComponent, CodeMirrorConfig } from 'src/app/components/codemirror-editor/codemirror-editor.component';
import { GeneratorServiceBase } from '../_services/generator.service';

@Component({
  selector: 'app-generator-view',
  imports: [CommonModule, FormsModule, CodeMirrorEditorComponent],
  template: `
    @if (error()) {
      <div class="error-banner">
        <div class="error-icon">⚠️</div>
        <div class="error-content">
          <span class="error-title">Generation Error</span>
          <span class="error-message">{{ error() }}</span>
        </div>
      </div>
    }
    <ng-content select="[tools]"></ng-content>
    <div class="single-view">
      <div class="editor-wrap">
        <div class="tool-bar section-header">
          <label>Generated Output</label>
          <button class="btn btn-secondary" (click)="copyClick()">Copy</button>
        </div>
        <div class="sub-wrap">
          <app-codemirror-editor class="editor" [config]="outputOptions" [ngModel]="outputCode()"></app-codemirror-editor>
        </div>
      </div>
    </div>
  `,
  styleUrl: './generator-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GeneratorViewComponent {
  private generatorService = inject(GeneratorServiceBase);
  outputOptions: CodeMirrorConfig;

  outputCode = signal<string>('');
  error = signal<string>('');

  private meta = inject(Meta);
  private titleService = inject(Title);

  constructor() {
    var data = getRouteData(this.generatorService.routeName);
    if (!data) {
      throw new Error('Route data not found for ' + this.generatorService.routeName);
    }
    this.titleService.setTitle('UtilPlex | ' + data.title);
    if (data.description) this.meta.updateTag({ name: 'description', content: data.description });

    RouteService.Title.set(this.generatorService.title);

    this.outputOptions = {
      theme: 'dracula',
      language: 'text',
      readOnly: true,
      wordWrap: true,
      automaticLayout: false,
      scrollBeyondLastLine: false,
      minimap: {
        enabled: false,
      },
    };
  }

  generateClick(options?: any) {
    this.error.set('');
    try {
      this.generatorService.generate(options).subscribe({
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

  downloadOutput() {
    if (!this.outputCode()) return;

    const blob = new Blob([this.outputCode()], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'generated-content.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  getToolDescription(): string {
    const descriptions: Record<string, string> = {
      GUID: 'Generate unique identifiers (GUIDs/UUIDs) for your applications and databases',
      Lorem: 'Generate Lorem Ipsum placeholder text for design mockups and content layouts',
    };
    return descriptions[this.generatorService.routeName] || 'Generate useful content for development and testing';
  }
}

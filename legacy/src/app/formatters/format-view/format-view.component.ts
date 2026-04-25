import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { from } from 'rxjs';
import { getRouteData, RouteService } from 'src/app/_services/route.service';
import {
  CodeMirrorConfig,
  CodeMirrorEditorComponent,
} from 'src/app/components/codemirror-editor/codemirror-editor.component';
import { FormatterOption, FormatViewService } from '../_services/sql-format.service';
@Component({
  selector: 'app-format-view',
  templateUrl: './format-view.component.html',
  styleUrls: ['./format-view.component.scss'],
  imports: [CommonModule, FormsModule, CodeMirrorEditorComponent],
})
export class FormatViewComponent {
  formatService = inject(FormatViewService);

  get hasOptions(): boolean {
    return this.formatService.formatterOptions.length > 0;
  }

  get options(): FormatterOption[] {
    return this.formatService.formatterOptions;
  }
  inputOptions: CodeMirrorConfig;
  outputOptions: CodeMirrorConfig;

  inputCode = signal<string>('');
  outputCode = signal<string>('');
  error = signal<string>('');

  private meta = inject(Meta);
  private titleService = inject(Title);
  constructor() {
    var data = getRouteData(this.formatService.routeName);
    if (!data) {
      throw new Error('Route data not found for welcome');
    }
    this.titleService.setTitle('UtilPlex |' + data.title);
    if (data.description) this.meta.updateTag({ name: 'description', content: data.description });
    RouteService.Title.set(this.formatService.title);

    this.inputOptions = {
      theme: 'dracula',
      language: this.formatService.language,
    } as CodeMirrorConfig;
    this.outputOptions = { ...this.inputOptions, readOnly: true };
  }

  inputChanged(txt: string) {
    this.error.set('');
    this.inputCode.set(txt);
    try {
      this.formatService.format(this.inputCode()).subscribe({
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
    link.download = `formatted.${this.getFileExtension()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  getFileExtension(): string {
    const extensions: Record<string, string> = {
      json: 'json',
      sql: 'sql',
      css: 'css',
      scss: 'scss',
      javascript: 'js',
      yaml: 'yaml',
      html: 'html',
    };
    return extensions[this.formatService.language] || 'txt';
  }

  getToolDescription(): string {
    const descriptions: Record<string, string> = {
      JSON: 'Beautify and validate your JSON data with proper indentation and formatting',
      SQL: 'Format SQL queries for better readability and consistency across your database code',
      CSS: 'Organize and beautify your CSS stylesheets with proper spacing and structure',
      SCSS: 'Format and beautify your SCSS/Sass code with proper indentation and structure',
      JavaScript: 'Clean up and format your JavaScript code with consistent indentation and style',
      YAML: 'Format YAML files with proper alignment and structure for configuration files',
      HTML: 'Format and beautify your HTML and XML markup with proper indentation and structure',
    };
    return descriptions[this.formatService.routeName] || 'Format and beautify your code for better readability';
  }

  onOptionChange(option: FormatterOption, event: Event) {
    const target = event.target as HTMLSelectElement | HTMLInputElement;
    if (option.type === 'select') {
      option.value.set(target.value);
    } else if (option.type === 'checkbox') {
      option.value.set((target as HTMLInputElement).checked);
    }
    // Re-run formatting with new options
    if (this.inputCode()) {
      this.inputChanged(this.inputCode());
    }
  }
}

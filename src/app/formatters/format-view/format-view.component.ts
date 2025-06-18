import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { from } from 'rxjs';
import { getRouteData, RouteService } from 'src/app/_services/route.service';
import { NGX_MONACO_EDITOR_CONFIG } from 'src/app/components/editor/config';
import { EditorComponent } from 'src/app/components/editor/editor.component';
import { MonacoEditorConfig } from 'src/app/monaco/monaco-global-config';
import { MonacoConfig } from '../../monaco/ng-monaco-config';
import { FormatViewService } from '../_services/sql-format.service';
@Component({
  selector: 'app-format-view',
  templateUrl: './format-view.component.html',
  styleUrls: ['./format-view.component.scss'],
  imports: [CommonModule, FormsModule, EditorComponent],
  providers: [{ provide: NGX_MONACO_EDITOR_CONFIG, useClass: MonacoEditorConfig }],
})
export class FormatViewComponent {
  formatService = inject(FormatViewService);
  inputOptions: MonacoConfig;
  outputOptions: MonacoConfig;

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
    } as MonacoConfig;
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
    };
    return descriptions[this.formatService.routeName] || 'Format and beautify your code for better readability';
  }
}

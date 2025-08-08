import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { from } from 'rxjs';
import { getRouteData, RouteService } from 'src/app/_services/route.service';
import { CodeMirrorEditorComponent, CodeMirrorConfig } from 'src/app/components/codemirror-editor/codemirror-editor.component';
import { ConverterServiceBase } from '../_services/converter.service';

@Component({
  selector: 'app-convert-view',
  templateUrl: './convert-view.component.html',
  styleUrls: ['./convert-view.component.scss'],
  imports: [CommonModule, FormsModule, CodeMirrorEditorComponent],
})
export class ConvertViewComponent {
  convertService = inject(ConverterServiceBase);
  inputOptions: CodeMirrorConfig;
  outputOptions: CodeMirrorConfig;

  inputCode = signal<string>('');
  outputCode = signal<string>('');
  error = signal<string>('');

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
    this.inputOptions = {
      theme: 'dracula',
      language: this.convertService.languageFrom,
    } as CodeMirrorConfig;
    this.outputOptions = {
      theme: 'dracula',
      language: this.convertService.languageTo,
      readOnly: false,
    };
  }

  inputChanged(txt: string) {
    this.error.set('');
    this.inputCode.set(txt);
    try {
      this.convertService.convert(this.inputCode()).subscribe({
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
    link.download = `converted.${this.getFileExtension()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  getFileExtension(): string {
    const extensions: Record<string, string> = {
      json: 'json',
      yaml: 'yaml',
      yml: 'yml',
      xml: 'xml',
      csv: 'csv',
    };
    return extensions[this.convertService.languageTo.toLowerCase()] || 'txt';
  }

  getToolDescription(): string {
    const descriptions: Record<string, string> = {
      'Json To Yaml':
        'Convert JSON data to YAML format while preserving structure and maintaining readability for configuration files',
    };
    return (
      descriptions[this.convertService.routeName] || 'Convert data between different formats seamlessly and efficiently'
    );
  }
}

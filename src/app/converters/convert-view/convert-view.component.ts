import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { MonacoEditorModule, NGX_MONACO_EDITOR_CONFIG } from 'ngx-monaco-editor-v2';
import { from } from 'rxjs';
import { getRouteData } from 'src/app/_services/route.service';
import { MonacoEditorConfig } from 'src/app/monaco/monaco-global-config';
import { MonacoConfig } from 'src/app/monaco/ng-monaco-config';
import { ConverterServiceBase } from '../_services/converter.service';

@Component({
  selector: 'app-convert-view',
  templateUrl: './convert-view.component.html',
  styleUrls: ['./convert-view.component.scss'],
  imports: [CommonModule, FormsModule, MonacoEditorModule],
  providers: [{ provide: NGX_MONACO_EDITOR_CONFIG, useClass: MonacoEditorConfig }],
})
export class ConvertViewComponent {
  private convertService = inject(ConverterServiceBase);
  inputOptions: MonacoConfig;
  outputOptions: MonacoConfig;

  inputCode = signal<string>('');
  outputCode = signal<string>('');
  error = signal<string>('');

  title = '';

  private meta = inject(Meta);
  private titleService = inject(Title);
  constructor() {
    var data = getRouteData(this.convertService.routeName);
    if (!data) {
      throw new Error('Route data not found for welcome');
    }
    this.titleService.setTitle('UtilPlex |' + data.title);
    if (data.description) this.meta.updateTag({ name: 'description', content: data.description });
    this.title = this.convertService.title;
    this.inputOptions = {
      theme: 'dracula',
      language: this.convertService.languageFrom,
    } as MonacoConfig;
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
}

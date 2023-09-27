import { Component, signal } from '@angular/core';
import { from } from 'rxjs';
import { MonacoConfig } from 'src/app/monaco/ng-monaco-config';
import { ConverterServiceBase } from '../_services/converter.service';

@Component({
  selector: 'app-convert-view',
  templateUrl: './convert-view.component.html',
  styleUrls: ['./convert-view.component.scss']
})
export class ConvertViewComponent {

  inputOptions: MonacoConfig;
  outputOptions: MonacoConfig;

  inputCode = signal<string>('');
  outputCode = signal<string>('');
  error = signal<string>('');

  title = '';

  constructor(private convertService: ConverterServiceBase) {
    this.title = convertService.title;
    this.inputOptions = {
      theme: 'dracula',
      language: convertService.languageFrom
    } as MonacoConfig;
    this.outputOptions = {
      theme: 'dracula',
      language: convertService.languageTo,
    readOnly:false };
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
        }
      });
    } catch (err: any) {
      this.error.set(err?.message);
    }
  }
  copyClick() {
    from(navigator.clipboard.writeText(this.outputCode())).subscribe();

  }
  pasteClick() {
    from(navigator.clipboard.readText()).subscribe(txt => this.inputChanged(txt));

  }
}
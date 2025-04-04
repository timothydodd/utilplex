import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MonacoEditorModule, NGX_MONACO_EDITOR_CONFIG } from 'ngx-monaco-editor-v2';
import { from } from 'rxjs';
import { MonacoEditorConfig } from 'src/app/monaco/monaco-global-config';
import { MonacoConfig } from '../../monaco/ng-monaco-config';
import { FormatViewService } from '../_services/sql-format.service';
@Component({
    selector: 'app-format-view',
    templateUrl: './format-view.component.html',
    styleUrls: ['./format-view.component.scss'],
    imports: [CommonModule, FormsModule, MonacoEditorModule],
    providers: [{ provide: NGX_MONACO_EDITOR_CONFIG, useClass: MonacoEditorConfig }]
})
export class FormatViewComponent {
  inputOptions: MonacoConfig;
  outputOptions: MonacoConfig;

  inputCode = signal<string>('');
  outputCode = signal<string>('');
  error = signal<string>('');

  title = '';

  constructor(private formatService: FormatViewService)
  {
    this.title = formatService.title;
    this.inputOptions = { 
      theme: 'dracula', 
    language: formatService.language
    } as MonacoConfig;
    this.outputOptions = {...this.inputOptions, readOnly: true };
  }

 
  inputChanged(txt:string) {
    this.error.set('');
    this.inputCode.set(txt);
    try{
    this.formatService.format(this.inputCode()).subscribe({
      next: (result) => {
        this.outputCode.set(result);    
      },
      error: (err) => {

        this.error.set(err?.message);
      }
    });
  }catch(err:any)
  {
      this.error.set(err?.message);
  }
  }
  copyClick()
  {
    from(navigator.clipboard.writeText(this.outputCode())).subscribe();

  }
  pasteClick()
  {
    from(navigator.clipboard.readText()).subscribe(txt => this.inputChanged(txt));
    
  }
}



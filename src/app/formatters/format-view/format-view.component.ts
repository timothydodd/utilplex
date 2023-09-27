import { Component, signal } from '@angular/core';
import { from } from 'rxjs';
import { FormatViewService } from '../_services/sql-format.service';
declare let monaco: any;
@Component({
  selector: 'app-format-view',
  templateUrl: './format-view.component.html',
  styleUrls: ['./format-view.component.scss']
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

export interface MonacoConfig
{
  theme: string;
  language: string;
  readOnly:boolean | undefined;
}



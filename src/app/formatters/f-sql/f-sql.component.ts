import { Component, signal } from '@angular/core';
//import { formatJsonata } from "@stedi/prettier-plugin-jsonata/dist/lib";
import { format } from 'sql-formatter';
declare var monaco: any;

@Component({
  selector: 'app-f-sql',
  templateUrl: './f-sql.component.html',
  styleUrls: ['./f-sql.component.scss']
})
export class FSqlComponent {
  editorOptions = { theme: 'vs', language: 'sql' };
  editorOptions2 = { theme: 'vs', language: 'sql', readOnly: true };
  code = '';
  code2 = signal<string>('');
  error = signal<string>('');
  codeChanged() {

    try {
      var v = format(this.code, { language: 'transactsql' });
      this.code2.set(v);
    } catch (e: any) {
      this.error.set(e?.message);
    }


    // from().subscribe((data) => {
    //   this.code2.set(data);
    // });

  }
}

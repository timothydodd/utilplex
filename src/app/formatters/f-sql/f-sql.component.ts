import { Component } from '@angular/core';
import { FormatViewService, SqlFormatProvider } from '../_services/sql-format.service';

@Component({
  selector: 'app-f-sql',
  templateUrl: './f-sql.component.html',
  styleUrls: ['./f-sql.component.scss'],
  providers: [{ provide: FormatViewService, useClass: SqlFormatProvider }]
})
export class FSqlComponent {
  


}

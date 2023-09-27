import { Component } from '@angular/core';
import { JsonFormatProvider } from '../_services/json-format.service';
import { FormatViewService } from '../_services/sql-format.service';

@Component({
  selector: 'app-f-json',
  templateUrl: './f-json.component.html',
  styleUrls: ['./f-json.component.scss'],
  providers: [{ provide: FormatViewService, useClass: JsonFormatProvider }]
})
export class FJsonComponent {

}

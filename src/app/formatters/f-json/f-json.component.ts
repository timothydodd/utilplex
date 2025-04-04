import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JsonFormatProvider } from '../_services/json-format.service';
import { FormatViewService } from '../_services/sql-format.service';
import { FormatViewComponent } from '../format-view/format-view.component';

@Component({
    selector: 'app-f-json',
    templateUrl: './f-json.component.html',
    styleUrls: ['./f-json.component.scss'],
    providers: [{ provide: FormatViewService, useClass: JsonFormatProvider }],
    imports: [CommonModule, FormsModule, FormatViewComponent]
})
export class FJsonComponent {

}

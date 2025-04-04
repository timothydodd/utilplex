import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { JavascriptFormatProvider } from "../_services/javascript-format.service";
import { FormatViewService } from "../_services/sql-format.service";
import { FormatViewComponent } from "../format-view/format-view.component";

@Component({
    selector: 'app-f-javascript',
    providers: [{ provide: FormatViewService, useClass: JavascriptFormatProvider }],
    imports: [CommonModule, FormsModule, FormatViewComponent],
    template: `<app-format-view></app-format-view>`,
    styleUrl: './f-javascript.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FJavascriptComponent { }

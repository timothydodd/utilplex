import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { CssFormatService } from "../_services/css-format.service";
import { FormatViewService } from "../_services/sql-format.service";
import { FormatViewComponent } from "../format-view/format-view.component";

@Component({
  selector: 'app-f-css',
  providers: [{ provide: FormatViewService, useClass: CssFormatService }],
  standalone: true,
  imports: [CommonModule, FormsModule, FormatViewComponent],
  template: `<app-format-view></app-format-view>`,
  styleUrl: './f-css.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FCssComponent { }

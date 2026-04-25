import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HtmlFormatService } from '../_services/html-format.service';
import { FormatViewService } from '../_services/sql-format.service';
import { FormatViewComponent } from '../format-view/format-view.component';

@Component({
  selector: 'app-f-html',
  providers: [{ provide: FormatViewService, useClass: HtmlFormatService }],
  imports: [CommonModule, FormsModule, FormatViewComponent],
  template: `<app-format-view></app-format-view>`,
  styleUrl: './f-html.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FHtmlComponent {}

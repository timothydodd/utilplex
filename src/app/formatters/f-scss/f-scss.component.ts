import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ScssFormatService } from '../_services/scss-format.service';
import { FormatViewService } from '../_services/sql-format.service';
import { FormatViewComponent } from '../format-view/format-view.component';

@Component({
  selector: 'app-f-scss',
  providers: [{ provide: FormatViewService, useClass: ScssFormatService }],
  imports: [CommonModule, FormsModule, FormatViewComponent],
  template: `<app-format-view></app-format-view>`,
  styleUrl: './f-scss.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FScssComponent {}

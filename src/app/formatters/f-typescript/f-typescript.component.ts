import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormatViewService } from '../_services/sql-format.service';
import { TypeScriptFormatProvider } from '../_services/typescript-format.service';
import { FormatViewComponent } from '../format-view/format-view.component';

@Component({
  selector: 'app-f-typescript',
  providers: [{ provide: FormatViewService, useClass: TypeScriptFormatProvider }],
  imports: [CommonModule, FormsModule, FormatViewComponent],
  template: `<app-format-view></app-format-view>`,
  styleUrl: './f-typescript.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FTypescriptComponent {}

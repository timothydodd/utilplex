import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormatViewService, SqlFormatProvider } from '../_services/sql-format.service';
import { FormatViewComponent } from '../format-view/format-view.component';

@Component({
  selector: 'app-f-sql',
  templateUrl: './f-sql.component.html',
  styleUrls: ['./f-sql.component.scss'],
  providers: [{ provide: FormatViewService, useClass: SqlFormatProvider }],
  standalone: true,
  imports: [CommonModule, FormsModule, FormatViewComponent],
})
export class FSqlComponent {
  


}

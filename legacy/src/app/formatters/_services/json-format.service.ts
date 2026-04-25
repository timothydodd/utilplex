import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { FormatterOption, FormatViewService } from './sql-format.service';

@Injectable()
export class JsonFormatProvider extends FormatViewService {
  override title = 'Json Formatter';
  override language = 'json';
  override routeName = 'JSON';

  private minify = signal<boolean>(false);

  override formatterOptions: FormatterOption[] = [
    {
      key: 'minify',
      label: 'Minify',
      type: 'checkbox',
      value: this.minify,
    },
  ];

  override format(input: string): Observable<string> {
    const parsed = JSON.parse(input);
    const indent = this.minify() ? 0 : 2;
    return of(JSON.stringify(parsed, null, indent));
  }
}

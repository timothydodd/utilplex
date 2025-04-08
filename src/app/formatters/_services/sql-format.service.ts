import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { format as formatsql } from 'sql-formatter';
export abstract class FormatViewService {
  abstract title: string;
  abstract language: string;
  abstract format(input: string): Observable<string>;
}

@Injectable()
export class SqlFormatProvider extends FormatViewService {
  override title = 'SQL Formatter';
  override language = 'sql';
  override format(input: string): Observable<string> {
    return of(formatsql(input, { language: 'transactsql' }));
  }
}

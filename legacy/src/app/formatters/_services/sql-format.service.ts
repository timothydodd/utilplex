import { Injectable, WritableSignal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { format as formatsql } from 'sql-formatter';

export interface FormatterOption {
  key: string;
  label: string;
  type: 'select' | 'checkbox';
  options?: { value: string; label: string }[];
  value: WritableSignal<string | boolean>;
}

export abstract class FormatViewService {
  abstract title: string;
  abstract routeName: string;
  abstract language: string;
  abstract format(input: string): Observable<string>;

  /** Optional configuration options for this formatter */
  formatterOptions: FormatterOption[] = [];
}

@Injectable()
export class SqlFormatProvider extends FormatViewService {
  override title = 'SQL Formatter';
  override language = 'sql';
  override routeName = 'SQL';
  override format(input: string): Observable<string> {
    return of(formatsql(input, { language: 'transactsql' }));
  }
}

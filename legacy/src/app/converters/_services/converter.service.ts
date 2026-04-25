import { Observable } from 'rxjs';
import { signal, WritableSignal } from '@angular/core';

export interface ConverterOption {
  key: string;
  label: string;
  type: 'select' | 'checkbox';
  options?: { value: string; label: string }[];
  value: WritableSignal<string | boolean>;
}

export abstract class ConverterServiceBase {
  abstract title: string;
  abstract languageFrom: string;
  abstract languageTo: string;
  abstract routeName: string;
  abstract convert(input: string): Observable<string>;

  /** Optional configuration options for this converter */
  converterOptions: ConverterOption[] = [];
}

import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

export abstract class EncoderServiceBase {
  abstract title: string;
  abstract options: any;
  abstract optionsChanged: EventEmitter<any>;
  abstract convert(input: string, encode: boolean): Observable<string>;
}

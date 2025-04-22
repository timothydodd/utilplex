import { EventEmitter, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Observable, of, throwError } from 'rxjs';
import { EncoderServiceBase } from '../_services/encoder.service';
@Injectable()
export class Base64Encoder extends EncoderServiceBase {
  override title = 'Base64 Encoder';
  override options: Base64EncodingOptions = new Base64EncodingOptions();
  override optionsChanged = new EventEmitter<Base64EncodingOptions>();
  constructor() {
    super();
    toObservable(this.options.encoding)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.optionsChanged.emit(this.options);
      });
  }
  override convert(input: string, encode: boolean): Observable<string> {
    try {
      var t = this.options.encoding();

      if (encode) {
        // Encode the input string to Base64
        const encoded =
          t === 'UTF-8'
            ? btoa(unescape(encodeURIComponent(input))) // UTF-8 encoding
            : btoa(input); // ASCII encoding
        return of(encoded);
      } else {
        // Decode the Base64 string
        const decoded =
          t === 'UTF-8'
            ? decodeURIComponent(escape(atob(input))) // UTF-8 decoding
            : atob(input); // ASCII decoding
        return of(decoded);
      }
    } catch {
      // Handle errors (e.g., invalid Base64 input)
      return throwError(() => new Error('Invalid input for Base64 conversion.'));
    }
  }
}

export class Base64EncodingOptions {
  encoding = signal<'ASCII' | 'UTF-8'>('UTF-8');
}

import { Injectable } from '@angular/core';
import * as prettier from 'prettier';
import * as babel from 'prettier/plugins/babel';
import * as estree from 'prettier/plugins/estree';
import { Observable, from } from 'rxjs';
import { FormatViewService } from './sql-format.service';

@Injectable()
export class JavascriptFormatProvider extends FormatViewService {
  override title = 'JavaScript Formatter';
  override language = 'javascript';
  override format(input: string): Observable<string> {
    return from(
      prettier.format(input, { parser: 'babel', plugins: [babel, estree as unknown as prettier.Plugin<any>] })
    );
  }
}

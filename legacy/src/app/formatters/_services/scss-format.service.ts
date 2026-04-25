import { Injectable } from '@angular/core';
import * as prettier from 'prettier';
import * as postcss from 'prettier/plugins/postcss';
import { Observable, from } from 'rxjs';
import { FormatViewService } from './sql-format.service';

@Injectable()
export class ScssFormatService extends FormatViewService {
  override title = 'SCSS Formatter';
  override language = 'scss';
  override routeName = 'SCSS';
  override format(input: string): Observable<string> {
    return from(prettier.format(input, { parser: 'scss', plugins: [postcss] }));
  }
}
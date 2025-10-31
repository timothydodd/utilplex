import { Injectable } from '@angular/core';
import * as prettier from 'prettier';
import * as html from 'prettier/plugins/html';
import { Observable, from } from 'rxjs';
import { FormatViewService } from './sql-format.service';

@Injectable()
export class HtmlFormatService extends FormatViewService {
  override title = 'HTML/XML Formatter';
  override language = 'html';
  override routeName = 'HTML';
  override format(input: string): Observable<string> {
    return from(prettier.format(input, { parser: 'html', plugins: [html] }));
  }
}

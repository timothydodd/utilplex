import { Injectable } from '@angular/core';
import * as prettier from 'prettier';
import * as babel from 'prettier/plugins/babel';
import * as estree from 'prettier/plugins/estree';
import { Observable, from } from 'rxjs';
import { FormatViewService } from './sql-format.service';

@Injectable()
export class TypeScriptFormatProvider extends FormatViewService {
  override title = 'TypeScript Formatter';
  override language = 'typescript';
  override routeName = 'TypeScript';

  override format(input: string): Observable<string> {
    return from(
      prettier.format(input, {
        parser: 'babel-ts',
        plugins: [babel, estree as unknown as prettier.Plugin<any>],
        singleQuote: true,
        tabWidth: 2,
        useTabs: false,
        semi: true,
        trailingComma: 'es5',
        bracketSpacing: true,
        arrowParens: 'always',
        printWidth: 80,
        endOfLine: 'lf',
      })
    );
  }
}

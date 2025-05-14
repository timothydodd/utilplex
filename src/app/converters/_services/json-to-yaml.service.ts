import { Injectable } from '@angular/core';

import * as yaml from 'js-yaml';
import { Observable, of } from 'rxjs';
import { ConverterServiceBase } from './converter.service';

@Injectable()
export class JsonToYamlConverter extends ConverterServiceBase {
  override title = 'Json to Yaml';
  override languageFrom = 'json';
  override languageTo = 'yaml';
  override routeName = 'Json To Yaml';
  override convert(input: string): Observable<string> {
    if (!input) return of('');
    const json = JSON.parse(input);
    return of(yaml.dump(json));
  }
}

import { Injectable, signal } from '@angular/core';

import * as yaml from 'js-yaml';
import { Observable, of } from 'rxjs';
import { ConverterOption, ConverterServiceBase } from './converter.service';

export type PropertyCaseFormat = 'original' | 'camelCase' | 'PascalCase' | 'snake_case' | 'kebab-case' | 'CONSTANT_CASE';

@Injectable()
export class YamlToJsonConverter extends ConverterServiceBase {
  override title = 'Yaml to Json';
  override languageFrom = 'yaml';
  override languageTo = 'json';
  override routeName = 'Yaml To Json';

  private propertyCaseFormat = signal<string>('original');

  override converterOptions: ConverterOption[] = [
    {
      key: 'propertyCase',
      label: 'Property Case',
      type: 'select',
      options: [
        { value: 'original', label: 'Original' },
        { value: 'camelCase', label: 'camelCase' },
        { value: 'PascalCase', label: 'PascalCase' },
        { value: 'snake_case', label: 'snake_case' },
        { value: 'kebab-case', label: 'kebab-case' },
        { value: 'CONSTANT_CASE', label: 'CONSTANT_CASE' },
      ],
      value: this.propertyCaseFormat,
    },
  ];

  override convert(input: string): Observable<string> {
    if (!input) return of('');
    let parsed = yaml.load(input);
    const caseFormat = this.propertyCaseFormat() as PropertyCaseFormat;
    if (caseFormat !== 'original') {
      parsed = this.transformKeys(parsed, caseFormat);
    }
    return of(JSON.stringify(parsed, null, 2));
  }

  private transformKeys(obj: unknown, format: PropertyCaseFormat): unknown {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.transformKeys(item, format));
    }
    if (obj !== null && typeof obj === 'object') {
      const result: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(obj)) {
        const newKey = this.convertCase(key, format);
        result[newKey] = this.transformKeys(value, format);
      }
      return result;
    }
    return obj;
  }

  private convertCase(str: string, format: PropertyCaseFormat): string {
    const words = str
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[_\-\s]+/g, ' ')
      .toLowerCase()
      .split(' ')
      .filter((w) => w.length > 0);

    switch (format) {
      case 'camelCase':
        return words.map((w, i) => (i === 0 ? w : this.capitalize(w))).join('');
      case 'PascalCase':
        return words.map((w) => this.capitalize(w)).join('');
      case 'snake_case':
        return words.join('_');
      case 'kebab-case':
        return words.join('-');
      case 'CONSTANT_CASE':
        return words.join('_').toUpperCase();
      default:
        return str;
    }
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

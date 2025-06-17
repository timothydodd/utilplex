import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GeneratorServiceBase } from './generator.service';

@Injectable()
export class GuidGeneratorService extends GeneratorServiceBase {
  override title = 'GUID Generator';
  override routeName = 'GUID';

  override generate(options: { count: number; format?: string } = { count: 1 }): Observable<string> {
    const guids: string[] = [];

    for (let i = 0; i < options.count; i++) {
      guids.push(this.generateGuid(options.format || 'standard'));
    }

    return of(guids.join('\n'));
  }

  private generateGuid(format: string = 'standard'): string {
    const guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });

    switch (format) {
      case 'compact':
        return guid.replace(/-/g, '');
      case 'uppercase':
        return guid.toUpperCase();
      default:
        return guid;
    }
  }
}

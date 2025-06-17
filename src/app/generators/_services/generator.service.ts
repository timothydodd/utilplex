import { Observable } from 'rxjs';

export abstract class GeneratorServiceBase {
  abstract title: string;
  abstract routeName: string;
  abstract generate(options?: any): Observable<string>;
}
import { Observable } from "rxjs";

export abstract class ConverterServiceBase {
    abstract title: string;
    abstract languageFrom: string;
    abstract languageTo: string;
    abstract convert(input: string): Observable<string>;
}
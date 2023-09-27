import { Injectable } from "@angular/core";
import { formatJsonata } from "@stedi/prettier-plugin-jsonata/dist/lib";
import { Observable, from } from "rxjs";
import { FormatViewService } from "./sql-format.service";



@Injectable()
export class JsonFormatProvider extends FormatViewService {
    override title = 'Json Formatter';
    override language = 'json';
    override format(input: string): Observable<string> {
      return  from(formatJsonata(input));
    }

}

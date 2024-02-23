import { Injectable } from "@angular/core";
import * as prettier from "prettier";
import * as postcss from "prettier/plugins/postcss";
import { Observable, from } from "rxjs";
import { FormatViewService } from "./sql-format.service";

@Injectable()
export class CssFormatService extends FormatViewService {
    override title = 'Css Formatter';
    override language = 'css';
    override format(input: string): Observable<string> {
      return from(prettier.format(input, { parser: "css", plugins: [postcss] }));
    }
}

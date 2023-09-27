import { Component } from '@angular/core';
import { ConverterServiceBase } from '../_services/converter.service';
import { JsonToYamlConverter } from '../_services/json-to-yaml.service';

@Component({
  selector: 'app-c-json-yaml',
  templateUrl: './c-json-yaml.component.html',
  styleUrls: ['./c-json-yaml.component.scss'],
  providers: [{ provide: ConverterServiceBase, useClass: JsonToYamlConverter }]
})
export class CJsonYamlComponent {

}

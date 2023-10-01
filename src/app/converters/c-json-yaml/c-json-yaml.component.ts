import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConverterServiceBase } from '../_services/converter.service';
import { JsonToYamlConverter } from '../_services/json-to-yaml.service';
import { ConvertViewComponent } from '../convert-view/convert-view.component';

@Component({
  selector: 'app-c-json-yaml',
  templateUrl: './c-json-yaml.component.html',
  styleUrls: ['./c-json-yaml.component.scss'],
  providers: [{ provide: ConverterServiceBase, useClass: JsonToYamlConverter }],
  standalone: true,
  imports: [CommonModule, FormsModule, ConvertViewComponent],
})
export class CJsonYamlComponent {

}

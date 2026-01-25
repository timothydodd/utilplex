import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConverterServiceBase } from '../_services/converter.service';
import { YamlToJsonConverter } from '../_services/yaml-to-json.service';
import { ConvertViewComponent } from '../convert-view/convert-view.component';

@Component({
  selector: 'app-c-yaml-json',
  templateUrl: './c-yaml-json.component.html',
  styleUrls: ['./c-yaml-json.component.scss'],
  providers: [{ provide: ConverterServiceBase, useClass: YamlToJsonConverter }],
  imports: [CommonModule, FormsModule, ConvertViewComponent],
  host: { class: 'host-flex-container' }
})
export class CYamlJsonComponent {}

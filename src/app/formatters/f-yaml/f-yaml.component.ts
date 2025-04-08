import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormatViewComponent } from '../format-view/format-view.component';

@Component({
  selector: 'app-f-yaml',
  templateUrl: './f-yaml.component.html',
  styleUrls: ['./f-yaml.component.scss'],
  imports: [CommonModule, FormsModule, FormatViewComponent],
})
export class FYamlComponent {}

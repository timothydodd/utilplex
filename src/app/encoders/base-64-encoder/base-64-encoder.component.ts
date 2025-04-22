import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { EncoderServiceBase } from '../_services/encoder.service';
import { EncoderViewComponent } from '../encoder-view/encoder-view.component';
import { Base64Encoder } from './base-64-encoder';

@Component({
  selector: 'app-base-64-encoder',
  imports: [CommonModule, FormsModule, EncoderViewComponent, NgSelectModule],
  template: `<app-encoder-view>
    <ng-container tools>
      <div class="option">
        <label>Encoding</label>
        <ng-select
          [items]="encodingOptions"
          [ngModel]="optionsBase64.options.encoding()"
          (ngModelChange)="optionsBase64.options.encoding.set($event)"
        ></ng-select>
      </div>
    </ng-container>
  </app-encoder-view>`,
  styleUrl: './base-64-encoder.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: EncoderServiceBase, useClass: Base64Encoder }],
})
export class Base64EncoderComponent {
  options = inject(EncoderServiceBase);
  optionsBase64 = this.options as Base64Encoder;
  encodingOptions = ['ASCII', 'UTF-8'];
  constructor() {}
}

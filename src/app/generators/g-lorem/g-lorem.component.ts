import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GeneratorServiceBase } from '../_services/generator.service';
import { LoremIpsumGeneratorService, LoremIpsumOptions } from '../_services/lorem-ipsum-generator.service';
import { GeneratorViewComponent } from '../generator-view/generator-view.component';

@Component({
  selector: 'app-g-lorem',
  imports: [CommonModule, FormsModule, GeneratorViewComponent],
  providers: [{ provide: GeneratorServiceBase, useClass: LoremIpsumGeneratorService }],
  host: { class: 'host-flex-container' },
  template: `
    <div class="tool-container">
      <div class="tool-header secondary-gradient">
        <div class="tool-info">
          <h1 class="tool-title secondary-gradient">Lorem Ipsum Generator</h1>
          <p class="tool-description">
            Generate placeholder text for your designs, mockups, and development projects with customizable length and
            format
          </p>
        </div>
        <div class="lorem-stats">
          <div class="stat-item">
            <span class="stat-label">Type</span>
            <span class="stat-value secondary-color">{{ getTypeDisplay() }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Count</span>
            <span class="stat-value secondary-color">{{ count() }}</span>
          </div>
        </div>
      </div>

      <div class="controls-panel secondary-accent">
        <div class="panel-header secondary-bg">
          <div class="panel-title">
            <div class="panel-icon">📝</div>
            <h3>Text Generation Options</h3>
          </div>
        </div>
        <div class="lorem-controls">
          <div class="option-group">
            <label for="type">Content Type:</label>
            <select id="type" [ngModel]="type()" (ngModelChange)="type.set($event)" class="form-input secondary-focus">
              <option value="words">Words</option>
              <option value="sentences">Sentences</option>
              <option value="paragraphs">Paragraphs</option>
            </select>
          </div>
          <div class="option-group">
            <label for="count">Number of {{ type() }}:</label>
            <input
              id="count"
              type="number"
              min="1"
              max="100"
              [ngModel]="count()"
              (ngModelChange)="count.set($event)"
              class="form-input secondary-focus"
            />
          </div>
          <div class="option-group checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" [ngModel]="startWithLorem()" (ngModelChange)="startWithLorem.set($event)" />
              <span class="checkmark"></span>
              Start with "Lorem ipsum dolor sit amet..."
            </label>
          </div>
          <button class="action-btn secondary-gradient" (click)="generateLorem()">
            <span class="btn-icon">✨</span>
            Generate {{ count() }} {{ type() }}
          </button>
        </div>
      </div>

      <app-generator-view #generatorView></app-generator-view>
    </div>
  `,
  styleUrl: './g-lorem.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GLoremComponent {
  @ViewChild('generatorView') generatorView!: GeneratorViewComponent;

  type = signal<'words' | 'sentences' | 'paragraphs'>('paragraphs');
  count = signal<number>(3);
  startWithLorem = signal<boolean>(true);

  generateLorem() {
    const options: LoremIpsumOptions = {
      type: this.type(),
      count: this.count(),
      startWithLorem: this.startWithLorem(),
    };

    this.generatorView.generateClick(options);
  }

  getTypeDisplay(): string {
    const typeMap = {
      words: 'Words',
      sentences: 'Sentences',
      paragraphs: 'Paragraphs',
    };
    return typeMap[this.type()];
  }
}

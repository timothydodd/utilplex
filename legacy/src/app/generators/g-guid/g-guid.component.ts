import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GeneratorViewComponent } from '../generator-view/generator-view.component';
import { GuidGeneratorService } from '../_services/guid-generator.service';
import { GeneratorServiceBase } from '../_services/generator.service';

@Component({
  selector: 'app-g-guid',
  imports: [CommonModule, FormsModule, GeneratorViewComponent],
  providers: [{ provide: GeneratorServiceBase, useClass: GuidGeneratorService }],
  host: { class: 'host-flex-container' },
  template: `
    <div class="tool-container">
      <div class="tool-header primary-gradient">
        <div class="tool-info">
          <h1 class="tool-title primary-gradient">GUID Generator</h1>
          <p class="tool-description">Generate unique identifiers (GUIDs/UUIDs) for your applications and databases with customizable quantity</p>
        </div>
        <div class="guid-stats">
          <div class="stat-item">
            <span class="stat-label">Format</span>
            <span class="stat-value primary-color">UUID v4</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Uniqueness</span>
            <span class="stat-value primary-color">~5.3×10³⁶</span>
          </div>
        </div>
      </div>

      <div class="controls-panel primary-accent">
        <div class="panel-header primary-bg">
          <div class="panel-title">
            <div class="panel-icon">⚙️</div>
            <h3>Generation Options</h3>
          </div>
        </div>
        <div class="guid-controls">
          <div class="option-group">
            <label for="count">Number of GUIDs:</label>
            <input 
              id="count" 
              type="number" 
              min="1" 
              max="1000" 
              [ngModel]="count()" 
              (ngModelChange)="count.set($event)"
              class="form-input primary-focus"
            />
          </div>
          <div class="format-options">
            <div class="format-toggle">
              <label>
                <input 
                  type="radio" 
                  name="format" 
                  value="standard"
                  [ngModel]="format()"
                  (ngModelChange)="format.set($event)"
                />
                Standard (with hyphens)
              </label>
            </div>
            <div class="format-toggle">
              <label>
                <input 
                  type="radio" 
                  name="format" 
                  value="compact"
                  [ngModel]="format()"
                  (ngModelChange)="format.set($event)"
                />
                Compact (no hyphens)
              </label>
            </div>
            <div class="format-toggle">
              <label>
                <input 
                  type="radio" 
                  name="format" 
                  value="uppercase"
                  [ngModel]="format()"
                  (ngModelChange)="format.set($event)"
                />
                Uppercase
              </label>
            </div>
          </div>
          <button 
            class="action-btn primary-gradient" 
            (click)="generateGuids()"
          >
            <span class="btn-icon">⚡</span>
            Generate {{ count() }} GUID{{ count() > 1 ? 's' : '' }}
          </button>
        </div>
      </div>

      <app-generator-view #generatorView></app-generator-view>
    </div>
  `,
  styleUrl: './g-guid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GGuidComponent {
  @ViewChild('generatorView') generatorView!: GeneratorViewComponent;
  count = signal<number>(5);
  format = signal<'standard' | 'compact' | 'uppercase'>('standard');

  generateGuids() {
    this.generatorView.generateClick({ 
      count: this.count(),
      format: this.format()
    });
  }
}
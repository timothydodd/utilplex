import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { inject } from '@angular/core';
import { getRouteData, RouteService } from 'src/app/_services/route.service';

interface CharBreakdown {
  label: string;
  count: number;
  percentage: string;
}

@Component({
  selector: 'app-string-measure',
  imports: [CommonModule, FormsModule],
  host: { class: 'host-flex-container' },
  template: `
    <div class="tool-container">
      <div class="tool-header primary-gradient">
        <div class="tool-info">
          <h1 class="tool-title primary-gradient">String Measure</h1>
          <p class="tool-description">Analyze text with character, word, line counts, byte size, and detailed character breakdown</p>
        </div>
        <div class="header-stats">
          <div class="stat-item">
            <span class="stat-label">Characters</span>
            <span class="stat-value primary-color">{{ charCount() }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Words</span>
            <span class="stat-value primary-color">{{ wordCount() }}</span>
          </div>
        </div>
      </div>

      <div class="controls-panel primary-accent">
        <div class="panel-header primary-bg">
          <div class="panel-title">
            <div class="panel-icon">&#x1F4CF;</div>
            <h3>Input Text</h3>
          </div>
          <div class="input-actions">
            <button class="clear-btn" (click)="clearInput()" [disabled]="!inputText()">Clear</button>
            <button class="paste-btn" (click)="pasteFromClipboard()">Paste</button>
          </div>
        </div>
        <div class="input-area">
          <textarea
            class="text-input"
            placeholder="Type or paste your text here to analyze..."
            [ngModel]="inputText()"
            (ngModelChange)="inputText.set($event)"
            rows="8"
          ></textarea>
        </div>
      </div>

      @if (inputText()) {
        <div class="results-grid">
          <div class="stats-section">
            <h3 class="section-title">Counts</h3>
            <div class="stats-grid">
              <div class="stat-card">
                <span class="stat-card-value primary-color">{{ charCount() }}</span>
                <span class="stat-card-label">Characters</span>
              </div>
              <div class="stat-card">
                <span class="stat-card-value primary-color">{{ charCountNoSpaces() }}</span>
                <span class="stat-card-label">Characters (no spaces)</span>
              </div>
              <div class="stat-card">
                <span class="stat-card-value primary-color">{{ wordCount() }}</span>
                <span class="stat-card-label">Words</span>
              </div>
              <div class="stat-card">
                <span class="stat-card-value primary-color">{{ sentenceCount() }}</span>
                <span class="stat-card-label">Sentences</span>
              </div>
              <div class="stat-card">
                <span class="stat-card-value primary-color">{{ lineCount() }}</span>
                <span class="stat-card-label">Lines</span>
              </div>
              <div class="stat-card">
                <span class="stat-card-value primary-color">{{ paragraphCount() }}</span>
                <span class="stat-card-label">Paragraphs</span>
              </div>
            </div>
          </div>

          <div class="stats-section">
            <h3 class="section-title">Size</h3>
            <div class="stats-grid">
              <div class="stat-card">
                <span class="stat-card-value secondary-color">{{ byteSize() }}</span>
                <span class="stat-card-label">Bytes (UTF-8)</span>
              </div>
              <div class="stat-card">
                <span class="stat-card-value secondary-color">{{ readableSize() }}</span>
                <span class="stat-card-label">Readable Size</span>
              </div>
            </div>
          </div>

          <div class="stats-section">
            <h3 class="section-title">Word Stats</h3>
            <div class="stats-grid">
              <div class="stat-card">
                <span class="stat-card-value secondary-color">{{ uniqueWordCount() }}</span>
                <span class="stat-card-label">Unique Words</span>
              </div>
              <div class="stat-card">
                <span class="stat-card-value secondary-color">{{ avgWordLength() }}</span>
                <span class="stat-card-label">Avg Word Length</span>
              </div>
              <div class="stat-card">
                <span class="stat-card-value secondary-color">{{ longestWord() }}</span>
                <span class="stat-card-label">Longest Word</span>
              </div>
              <div class="stat-card">
                <span class="stat-card-value secondary-color">{{ readingTime() }}</span>
                <span class="stat-card-label">Reading Time</span>
              </div>
            </div>
          </div>

          <div class="stats-section">
            <h3 class="section-title">Character Breakdown</h3>
            <div class="breakdown-grid">
              @for (item of charBreakdown(); track item.label) {
                <div class="breakdown-item">
                  <div class="breakdown-bar-container">
                    <div class="breakdown-bar" [style.width]="item.percentage"></div>
                  </div>
                  <span class="breakdown-label">{{ item.label }}</span>
                  <span class="breakdown-count">{{ item.count }}</span>
                  <span class="breakdown-pct">{{ item.percentage }}</span>
                </div>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styleUrl: './string-measure.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StringMeasureComponent {
  private meta = inject(Meta);
  private titleService = inject(Title);

  inputText = signal<string>('');

  charCount = computed(() => this.inputText().length);

  charCountNoSpaces = computed(() => this.inputText().replace(/\s/g, '').length);

  wordCount = computed(() => {
    const text = this.inputText().trim();
    if (!text) return 0;
    return text.split(/\s+/).length;
  });

  sentenceCount = computed(() => {
    const text = this.inputText().trim();
    if (!text) return 0;
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    return sentences.length;
  });

  lineCount = computed(() => {
    const text = this.inputText();
    if (!text) return 0;
    return text.split('\n').length;
  });

  paragraphCount = computed(() => {
    const text = this.inputText().trim();
    if (!text) return 0;
    return text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;
  });

  byteSize = computed(() => new Blob([this.inputText()]).size);

  readableSize = computed(() => {
    const bytes = this.byteSize();
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  });

  uniqueWordCount = computed(() => {
    const text = this.inputText().trim();
    if (!text) return 0;
    const words = text.split(/\s+/).map((w) => w.toLowerCase().replace(/[^a-z0-9]/g, ''));
    return new Set(words.filter((w) => w.length > 0)).size;
  });

  avgWordLength = computed(() => {
    const text = this.inputText().trim();
    if (!text) return '0';
    const words = text.split(/\s+/);
    const totalLength = words.reduce((sum, w) => sum + w.length, 0);
    return (totalLength / words.length).toFixed(1);
  });

  longestWord = computed(() => {
    const text = this.inputText().trim();
    if (!text) return '-';
    const words = text.split(/\s+/);
    const longest = words.reduce((a, b) => (a.length >= b.length ? a : b), '');
    return longest.length > 20 ? longest.substring(0, 20) + '...' : longest;
  });

  readingTime = computed(() => {
    const words = this.wordCount();
    const minutes = words / 200;
    if (minutes < 1) return `${Math.ceil(minutes * 60)}s`;
    return `${Math.ceil(minutes)} min`;
  });

  charBreakdown = computed<CharBreakdown[]>(() => {
    const text = this.inputText();
    if (!text) return [];
    const total = text.length;

    const uppercase = (text.match(/[A-Z]/g) || []).length;
    const lowercase = (text.match(/[a-z]/g) || []).length;
    const digits = (text.match(/[0-9]/g) || []).length;
    const spaces = (text.match(/\s/g) || []).length;
    const special = total - uppercase - lowercase - digits - spaces;

    return [
      { label: 'Lowercase', count: lowercase, percentage: ((lowercase / total) * 100).toFixed(1) + '%' },
      { label: 'Uppercase', count: uppercase, percentage: ((uppercase / total) * 100).toFixed(1) + '%' },
      { label: 'Digits', count: digits, percentage: ((digits / total) * 100).toFixed(1) + '%' },
      { label: 'Spaces', count: spaces, percentage: ((spaces / total) * 100).toFixed(1) + '%' },
      { label: 'Special', count: special, percentage: ((special / total) * 100).toFixed(1) + '%' },
    ].filter((item) => item.count > 0);
  });

  constructor() {
    const data = getRouteData('String Measure');
    if (data) {
      this.titleService.setTitle('UtilPlex | ' + data.title);
      if (data.description) this.meta.updateTag({ name: 'description', content: data.description });
    }
    RouteService.Title.set('String Measure');
  }

  clearInput() {
    this.inputText.set('');
  }

  async pasteFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      this.inputText.set(text);
    } catch {
      // Clipboard access denied - ignore silently
    }
  }
}

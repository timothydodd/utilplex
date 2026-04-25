import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouteService } from 'src/app/_services/route.service';

interface PatchNote {
  version: string;
  date: string;
  highlights: string[];
  sections: {
    title: string;
    items: string[];
  }[];
}

@Component({
  selector: 'app-patch-notes',
  imports: [CommonModule],
  host: { class: 'host-flex-container' },
  template: `
    <div class="tool-container">
      <div class="tool-header secondary-gradient">
        <div class="tool-info">
          <h1 class="tool-title secondary-gradient">What's New</h1>
          <p class="tool-description">See what's been added and improved in UtilPlex</p>
        </div>
      </div>

      @for (note of patchNotes; track note.version) {
        <div class="patch-card" [class.latest]="$first">
          <div class="patch-header">
            <div class="version-badge" [class.latest-badge]="$first">v{{ note.version }}</div>
            <span class="patch-date">{{ note.date }}</span>
            @if ($first) {
              <span class="latest-tag">Latest</span>
            }
          </div>

          @if (note.highlights.length > 0) {
            <div class="highlights">
              @for (highlight of note.highlights; track highlight) {
                <div class="highlight-item">{{ highlight }}</div>
              }
            </div>
          }

          @for (section of note.sections; track section.title) {
            <div class="patch-section">
              <h3 class="section-heading">{{ section.title }}</h3>
              <ul class="change-list">
                @for (item of section.items; track item) {
                  <li>{{ item }}</li>
                }
              </ul>
            </div>
          }
        </div>
      }
    </div>
  `,
  styleUrl: './patch-notes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatchNotesComponent {
  private meta = inject(Meta);
  private titleService = inject(Title);

  patchNotes: PatchNote[] = [
    {
      version: '2.5.0',
      date: 'March 13, 2026',
      highlights: ['New String Measure tool for analyzing text'],
      sections: [
        {
          title: 'New Tools',
          items: [
            'String Measure — paste or type text to instantly see character count, word count, sentence count, line count, byte size, reading time, and more',
            'New "Text" category in the sidebar for text analysis tools',
          ],
        },
        {
          title: 'Improvements',
          items: ['Added patch notes page — click the version number in the sidebar to see what\'s changed'],
        },
      ],
    },
    {
      version: '2.4.0',
      date: 'March 2026',
      highlights: ['JSON formatting gets even better'],
      sections: [
        {
          title: 'Improvements',
          items: [
            'JSON Formatter now supports minify mode for compact output',
            'Improved formatting controls and layout',
          ],
        },
      ],
    },
    {
      version: '2.3.0',
      date: 'March 2026',
      highlights: ['Convert between YAML and JSON in both directions'],
      sections: [
        {
          title: 'New Tools',
          items: [
            'YAML to JSON converter with property case transformation options',
            'JSON to YAML converter with support for camelCase, snake_case, and more',
          ],
        },
      ],
    },
    {
      version: '2.2.0',
      date: 'February 2026',
      highlights: ['Compare files side by side'],
      sections: [
        {
          title: 'New Tools',
          items: ['File Diff Checker — compare two files or text blocks and see differences highlighted side by side'],
        },
      ],
    },
    {
      version: '2.1.0',
      date: 'February 2026',
      highlights: ['More formatters and generators'],
      sections: [
        {
          title: 'New Tools',
          items: [
            'HTML/XML Formatter for cleaning up markup',
            'SCSS Formatter for organizing stylesheets',
            'TypeScript Formatter',
            'Lorem Ipsum Generator for placeholder text',
          ],
        },
      ],
    },
    {
      version: '2.0.0',
      date: 'January 2026',
      highlights: ['Fresh new look and feel'],
      sections: [
        {
          title: 'What\'s New',
          items: [
            'Complete redesign with the Dracula dark theme',
            'New sidebar navigation with collapsible categories',
            'CodeMirror editor with syntax highlighting for all tools',
            'Animated background and glass-morphism UI effects',
          ],
        },
        {
          title: 'Tools Available',
          items: [
            'SQL, JSON, CSS, and JavaScript formatters',
            'Base64 encoder/decoder',
            'GUID Generator',
            'Time Zone Converter',
          ],
        },
      ],
    },
  ];

  constructor() {
    this.titleService.setTitle('UtilPlex | What\'s New');
    this.meta.updateTag({ name: 'description', content: 'See the latest updates and improvements to UtilPlex developer tools.' });
    RouteService.Title.set('What\'s New');
  }
}

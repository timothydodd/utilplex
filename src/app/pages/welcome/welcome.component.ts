import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { getRouteData, RouteService } from 'src/app/_services/route.service';

@Component({
  selector: 'app-welcome',
  imports: [CommonModule],
  template: `
    <main class="welcome-container">
      <header class="hero">
        <h1 class="hero-title">UtilPlex</h1>
        <p class="hero-subtitle">
          Your ultimate developer toolkit for formatting, converting, and generating code and data
        </p>
        <div class="hero-features">
          <span class="feature-badge">Fast</span>
          <span class="feature-badge">Secure</span>
          <span class="feature-badge">Free</span>
        </div>
      </header>

      <section class="tools-grid">
        @for (c of categories; track c.name) {
          <div class="category-section" [attr.data-category]="c.name.toLowerCase()">
            <div class="category-header">
              <div class="category-icon">{{ getCategoryIcon(c.name) }}</div>
              <h2 class="category-title">{{ c.name }}</h2>
              <p class="category-description">{{ getCategoryDescription(c.name) }}</p>
            </div>
            <div class="tools-list">
              @for (r of c.routes; track r.name) {
                <button 
                  class="tool-card" 
                  (click)="router.navigate([r.url])"
                  [attr.title]="r.description"
                >
                  <div class="tool-icon">{{ getToolIcon(r.name) }}</div>
                  <h3 class="tool-name">{{ r.name }}</h3>
                  <p class="tool-description">{{ getShortDescription(r.description) }}</p>
                </button>
              }
            </div>
          </div>
        }
      </section>
    </main>
  `,
  styleUrl: './welcome.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeComponent {
  categories = RouteService.routeCategories.filter((x) => x.name !== 'Home');
  router = inject(Router);
  private meta = inject(Meta);
  private title = inject(Title);

  constructor() {
    var data = getRouteData('Welcome');
    if (!data) {
      this.title.setTitle('error');
      throw new Error('Route data not found for welcome');
    }
    this.title.setTitle('UtilPlex |' + data.title);
    if (data.description) this.meta.updateTag({ name: 'description', content: data.description });
    RouteService.Title.set('Welcome to UtilPlex');
  }

  getCategoryIcon(categoryName: string): string {
    const icons: Record<string, string> = {
      'Formatters': '🎨',
      'Converters': '🔄',
      'Encoding': '🔐',
      'Time': '⏰',
      'Generators': '⚡'
    };
    return icons[categoryName] || '🛠️';
  }

  getCategoryDescription(categoryName: string): string {
    const descriptions: Record<string, string> = {
      'Formatters': 'Beautify and organize your code for better readability',
      'Converters': 'Transform data between different formats seamlessly',
      'Encoding': 'Encode and decode data for secure transmission',
      'Time': 'Work with time zones and date conversions',
      'Generators': 'Generate unique identifiers and placeholder content'
    };
    return descriptions[categoryName] || 'Useful developer tools';
  }

  getToolIcon(toolName: string): string {
    const icons: Record<string, string> = {
      'SQL': '🗃️',
      'JSON': '📋',
      'CSS': '🎨',
      'JavaScript': '📜',
      'Json To Yaml': '🔄',
      'Base64': '🔐',
      'Time Zones': '🌍',
      'GUID': '🆔',
      'Lorem': '📝'
    };
    return icons[toolName] || '⚙️';
  }

  getShortDescription(description?: string): string {
    if (!description) return '';
    return description.length > 60 ? description.substring(0, 60) + '...' : description;
  }
}

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
        <div class="hero-links">
          <button class="whats-new-link" (click)="router.navigate(['/patch-notes'])">
            What's new in v2.5 →
          </button>
          <button class="how-link" (click)="router.navigate(['/how-it-works'])">
            How it works
          </button>
        </div>
      </header>

      <section class="categories-grid">
        @for (c of categories; track c.name) {
          <div class="category-card">
            <div class="category-header" [style.border-image]="c.gradient ? c.gradient + ' 1' : ''">
              <span class="category-icon">{{ c.icon || '🛠️' }}</span>
              <div class="category-info">
                <h2 class="category-name">{{ c.name }}</h2>
                <p class="category-desc">{{ c.categoryDescription }}</p>
              </div>
            </div>
            <div class="tool-list">
              @for (r of c.routes; track r.url) {
                <button class="tool-item" (click)="router.navigate([r.url])" [attr.title]="r.description">
                  <span class="tool-icon">{{ r.icon || '⚙️' }}</span>
                  <div class="tool-text">
                    <span class="tool-name">{{ r.name }}</span>
                    <span class="tool-desc">{{ r.description }}</span>
                  </div>
                  <span class="tool-arrow">→</span>
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
}

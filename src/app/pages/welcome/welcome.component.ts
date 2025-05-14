import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { getRouteData, RouteService } from 'src/app/_services/route.service';

@Component({
  selector: 'app-welcome',
  imports: [CommonModule],
  template: `
    <main>
      <section>
        <p>
          Util Plex is a web-based platform designed to assist developers and coders by providing tools for formatting
          programming code and converting data formats.
        </p>
      </section>

      <section class="tools">
        @for (c of categories; track c.name) {
          <div class="section">
            <div class="section-header">
              <div>{{ c.name }}</div>
            </div>
            <div class="section-content">
              @for (r of c.routes; track r.name) {
                <button (click)="router.navigate([r.url])">{{ r.name }}</button>
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
    RouteService.Title.set('Welcome to Util Plex');
  }
}

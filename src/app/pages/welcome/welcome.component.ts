import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RouteService } from 'src/app/_services/route.service';

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
  categories = RouteService.routeCategories;
  router = inject(Router);
}

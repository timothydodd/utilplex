import { Component, inject, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivationStart, Router, RouterOutlet } from '@angular/router';
import { SideBarComponent } from './nav/side-bar/side-bar.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, SideBarComponent],
})
export class AppComponent {
  router = inject(Router);
  title = signal(null);
  private metaService = inject(Meta);
  private titleService = inject(Title);
  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof ActivationStart) {
        const data = event.snapshot.data;

        if (data['title']) {
          this.titleService.setTitle(data['title']);
          this.title.set(data['title']);
        }
        if (data['description']) {
          this.metaService.updateTag({
            name: 'description',
            content: data['description'],
          });
        }
      }
    });
  }
}

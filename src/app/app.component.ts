import { Component, inject, signal } from '@angular/core';
import { ActivationStart, Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})

export class AppComponent {

  router = inject(Router);
  title = signal(null)
  constructor() {

    this.router.events.subscribe((event) => {
      if (event instanceof ActivationStart) {

        const data = event.snapshot.data['title'] || null;
        this.title.set(data);
      }
    });
  }
}

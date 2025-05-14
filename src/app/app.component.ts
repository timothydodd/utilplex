import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
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
}

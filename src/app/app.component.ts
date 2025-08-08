import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouteService } from './_services/route.service';
import { SideBarComponent } from './nav/side-bar/side-bar.component';
import { AnimatedBackgroundComponent } from './components/animated-background/animated-background.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [CommonModule, RouterOutlet, SideBarComponent, AnimatedBackgroundComponent],
})
export class AppComponent {
  router = inject(Router);
  RouterService = RouteService;
  sidebarCollapsed = signal(false);

  onSidebarToggle(collapsed: boolean) {
    this.sidebarCollapsed.set(collapsed);
  }
}

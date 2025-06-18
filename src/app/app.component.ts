import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { RouteService } from './_services/route.service';
import { SideBarComponent } from './nav/side-bar/side-bar.component';
import { AnimatedBackgroundComponent } from './components/animated-background/animated-background.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, SideBarComponent, AnimatedBackgroundComponent],
})
export class AppComponent {
  router = inject(Router);
  RouterService = RouteService;
}

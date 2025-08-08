import { ChangeDetectionStrategy, Component, inject, signal, HostBinding, output } from '@angular/core';
import { IsActiveMatchOptions, Router, RouterLinkActive, RouterLink as RouterLink_1 } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouteService } from 'src/app/_services/route.service';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLinkActive, RouterLink_1],
})
export class SideBarComponent {
  categories: RouterCategory[] = [];
  router = inject(Router);
  isCollapsed = signal(false);
  sidebarToggle = output<boolean>();
  
  @HostBinding('class.collapsed')
  get collapsed() {
    return this.isCollapsed();
  }
  
  constructor() {
    this.categories = RouteService.routeCategories.filter((x) => x.name !== 'Home');
  }

  toggleSidebar() {
    const newState = !this.isCollapsed();
    this.isCollapsed.set(newState);
    this.sidebarToggle.emit(newState);
  }
  isRouteActive(url: string) {
    return this.router.isActive(url, {
      paths: 'exact',
      queryParams: 'exact',
      fragment: 'ignored',
      matrixParams: 'ignored',
    } as IsActiveMatchOptions);
  }
}

export interface RouterCategory {
  name: string;
  routes: RouterLink[];
}
export interface RouterLink {
  name: string;
  url: string;
}

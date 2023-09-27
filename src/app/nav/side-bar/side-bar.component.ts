import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { IsActiveMatchOptions, Router } from '@angular/router';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideBarComponent {
  categories: RouterCategory[] = [];
  router = inject(Router);
  constructor() {

    this.categories = [
      {
        name: 'Formatters',
        routes: [
          { name: 'SQL', url: '/format/sql' },
          { name: 'JSON', url: '/format/json' }
        ]
      },
      {
        name: 'Converters',
        routes: [
          { name: 'Json To Yaml', url: '/convert/json-yaml' },
        ]
      }
    ]
  }
  isRouteActive(url: string) {
    return this.router.isActive(url, { paths: 'exact', queryParams: 'exact', fragment: 'ignored', matrixParams: 'ignored' } as IsActiveMatchOptions);
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
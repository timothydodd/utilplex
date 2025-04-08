import { Routes } from '@angular/router';
import { RouteService } from './_services/route.service';

export const routes: Routes = [...RouteService.getRoutes()];

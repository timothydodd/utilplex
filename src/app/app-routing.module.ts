import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteService } from './_services/route.service';

const routes: Routes = [...RouteService.getRoutes()];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FJsonComponent } from './formatters/f-json/f-json.component';
import { FSqlComponent } from './formatters/f-sql/f-sql.component';

const routes: Routes = [{ path: 'format/sql', pathMatch: 'full', component: FSqlComponent },
  { path: 'format/json', pathMatch: 'full', component: FJsonComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

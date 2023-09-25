import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FSqlComponent } from './formatters/f-sql/f-sql.component';

const routes: Routes = [{ path: 'format/sql', pathMatch: 'full', component: FSqlComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DrinkTypesPage } from './drink-types.page';

const routes: Routes = [
  {
    path: '',
    component: DrinkTypesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DrinkTypesPageRoutingModule {}

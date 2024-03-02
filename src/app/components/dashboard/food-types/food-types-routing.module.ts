import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FoodTypesPage } from './food-types.page';

const routes: Routes = [
  {
    path: '',
    component: FoodTypesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FoodTypesPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChairsPage } from './chairs.page';

const routes: Routes = [
  {
    path: '',
    component: ChairsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChairsPageRoutingModule {}

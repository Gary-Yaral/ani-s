import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShowPackagePage } from './show-package.page';

const routes: Routes = [
  {
    path: '',
    component: ShowPackagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShowPackagePageRoutingModule {}

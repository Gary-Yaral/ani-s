import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalPackagePage } from './modal-package.page';

const routes: Routes = [
  {
    path: '',
    component: ModalPackagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalPackagePageRoutingModule {}

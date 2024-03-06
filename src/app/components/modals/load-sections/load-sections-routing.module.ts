import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoadSectionsPage } from './load-sections.page';

const routes: Routes = [
  {
    path: '',
    component: LoadSectionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoadSectionsPageRoutingModule {}

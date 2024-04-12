import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShowPackagePageRoutingModule } from './show-package-routing.module';

import { ShowPackagePage } from './show-package.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShowPackagePageRoutingModule
  ],
  declarations: [ShowPackagePage]
})
export class ShowPackagePageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalPackagePageRoutingModule } from './modal-package-routing.module';

import { ModalPackagePage } from './modal-package.page';
import { EllipsisPipe } from '../pipes/ellipsis.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ModalPackagePageRoutingModule,
    IonicModule.forRoot(),
  ],
  declarations: [ModalPackagePage, EllipsisPipe]
})
export class ModalPackagePageModule {}

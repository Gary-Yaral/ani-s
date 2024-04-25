import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ShowPackagePageRoutingModule } from './show-package-routing.module';
import { ShowPackagePage } from './show-package.page';
import { FormsModule } from '@angular/forms';

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

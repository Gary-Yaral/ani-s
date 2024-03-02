import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FoodTypesPageRoutingModule } from './food-types-routing.module';

import { FoodTypesPage } from './food-types.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FoodTypesPageRoutingModule
  ],
  declarations: [FoodTypesPage]
})
export class FoodTypesPageModule {}

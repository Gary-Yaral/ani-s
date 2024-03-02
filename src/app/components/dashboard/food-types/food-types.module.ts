import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FoodTypesPageRoutingModule } from './food-types-routing.module';

import { FoodTypesPage } from './food-types.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FoodTypesPageRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [FoodTypesPage]
})
export class FoodTypesPageModule {}

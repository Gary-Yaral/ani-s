import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FoodTypesPageRoutingModule } from './subcategories-routing.module';

import { SubcategoriesPage } from './subcategories.page';
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
  declarations: [SubcategoriesPage]
})
export class SubcategoriesPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DrinkTypesPageRoutingModule } from './drink-types-routing.module';

import { DrinkTypesPage } from './drink-types.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DrinkTypesPageRoutingModule
  ],
  declarations: [DrinkTypesPage]
})
export class DrinkTypesPageModule {}

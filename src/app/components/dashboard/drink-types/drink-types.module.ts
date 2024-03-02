import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DrinkTypesPageRoutingModule } from './drink-types-routing.module';

import { DrinkTypesPage } from './drink-types.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DrinkTypesPageRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [DrinkTypesPage]
})
export class DrinkTypesPageModule {}

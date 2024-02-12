import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DrinksPageRoutingModule } from './drinks-routing.module';

import { DrinksPage } from './drinks.page';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DrinksPageRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [DrinksPage]
})
export class DrinksPageModule {}

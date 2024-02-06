import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DecorationsPageRoutingModule } from './decorations-routing.module';

import { DecorationsPage } from './decorations.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DecorationsPageRoutingModule
  ],
  declarations: [DecorationsPage]
})
export class DecorationsPageModule {}

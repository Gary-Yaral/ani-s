import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChairsPageRoutingModule } from './chairs-routing.module';

import { ChairsPage } from './chairs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChairsPageRoutingModule
  ],
  declarations: [ChairsPage]
})
export class ChairsPageModule {}

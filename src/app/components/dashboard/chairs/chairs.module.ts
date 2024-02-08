import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChairsPageRoutingModule } from './chairs-routing.module';

import { ChairsPage } from './chairs.page';
import { TableCommonComponent } from '../../table-common/table-common.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChairsPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [ChairsPage, TableCommonComponent]
})
export class ChairsPageModule {}

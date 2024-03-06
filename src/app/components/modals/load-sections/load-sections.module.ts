import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoadSectionsPageRoutingModule } from './load-sections-routing.module';

import { LoadSectionsPage } from './load-sections.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoadSectionsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [LoadSectionsPage]
})
export class LoadSectionsPageModule {}

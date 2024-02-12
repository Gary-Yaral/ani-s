import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableCommonComponent } from '../table-common/table-common.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [TableCommonComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [TableCommonComponent]
})
export class SharedModule { }

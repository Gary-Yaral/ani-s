import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { RestApiService } from 'src/app/services/rest-api.service';
import { Limit, clearErrors, detectChange } from 'src/app/utilities/functions';
import { API_PATHS } from 'src/constants';

@Component({
  selector: 'app-update-status',
  templateUrl: './update-status.page.html',
  styleUrls: ['./update-status.page.scss'],
})
export class UpdateStatusPage implements OnInit {
  @Input() data!: any
  title: string ='Revisión'
  errors: any = {
    statusId: ''
  }
  statuses: any = []
  constructor(
    private modalCrl: ModalController,
    private restApi: RestApiService
  ) { }

  formGroup: FormGroup = new FormGroup({
    statusId: new FormControl('', [Validators.required])
  })

  // Detectar errores mientras se llena el formulario
  detectChange: Function = ($event: any, name: string, limit: Limit = {}) => detectChange(this.formGroup, this.errors)($event, name, limit)

  ngOnInit() {
    if(this.data) {
      this.formGroup.setValue({
        statusId: this.data.reservation.statusId
      })
      console.log(this.data)

    }
    this.loadStatuses()
  }

  cancel() {
    this.formGroup.reset()
    clearErrors(this.errors)
    this.modalCrl.dismiss()
  }

  loadStatuses() {
    this.restApi.get(API_PATHS.reservations + 'statuses').subscribe((response) => {
      if(response.data) {
        this.statuses = response.data
      }
    })
  }

  updateStatus() {
    console.log('se envia');

  }
}

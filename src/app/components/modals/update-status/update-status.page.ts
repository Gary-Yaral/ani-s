import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { ReloadService } from 'src/app/services/reload.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { CHANGES_TYPE } from 'src/app/utilities/constants';
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
    private restApi: RestApiService,
    private Swal: SweetAlertService,
    private reloadService: ReloadService
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

  async updateStatus() {
    this.Swal.fire({
      title: '!Atencíon!',
      icon: 'info',
      text: '¿Deseas actualizar el estado de la reservación?',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, Actualizar'
    }).then((options: any) => {
      if(options.isConfirmed) {
        let id = this.data.reservation.id
        this.restApi.put(API_PATHS.reservations + 'status/' + id, this.formGroup.value).subscribe((response) => {
          console.log(response)
          if(response.error) {
            this.Swal.fire({
              title: 'Error',
              icon: 'error',
              text: response.msg,
              confirmButtonText: 'Aceptar'
            })
          }
          if(response.done) {
            this.Swal.fire({
              title: '!Listo!',
              icon: 'success',
              html: response.msg,
              confirmButtonText: 'Aceptar'
            })
          }
          // Notificamos que hubo cambios para que se refresque la tabla
          this.reloadService.addChanges({changes: true, type: CHANGES_TYPE.ADD})
          this.cancel()
        })
      }
    })
  }
}

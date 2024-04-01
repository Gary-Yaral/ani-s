import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { ReloadService } from 'src/app/services/reload.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { CHANGES_TYPE } from 'src/app/utilities/constants';
import { Limit, detectChange, ellipsis, textValidator, validateFields } from 'src/app/utilities/functions';
import { API_PATHS } from 'src/constants';

@Component({
  selector: 'app-modal-package',
  templateUrl: './modal-package.page.html',
  styleUrls: ['./modal-package.page.scss'],
})
export class ModalPackagePage implements OnInit {
  @Input() items: any = []
  @Input() package!: any
  statuses: any = []
  pathLoad: string = API_PATHS.packages
  // Para dibujar los ... en caso de que queramos limiar el texto
  ellipsis: Function = ellipsis
  // Mensajes de error
  errors: any = {
    name: '',
    status: ''
  }

  formGroup: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, textValidator()]),
    status: new FormControl('', [Validators.required])
  })

  // Detectar errores mientras se llena el formulario
  detectChange: Function = ($event: any, name: string, limit: Limit = {}) => detectChange(this.formGroup, this.errors)($event, name, limit)

  // Ruta para consultar la imagenes
  pathImages: string = API_PATHS.images

  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private restApi: RestApiService,
    private Swal: SweetAlertService,
    private reloadService: ReloadService
  ) { }

  ngOnInit() {
    this.loadPackageStatus()
  }

  loadPackageStatus() {
    this.restApi.get(this.pathLoad+'statuses').subscribe((response)=> {
      this.statuses = response.data.statuses;
      if(this.package) {
        console.log('existe', this.package)

        this.formGroup.setValue({
          name: this.package.name,
          status: this.package.status
        })
      }
    })
  }

  hideModal() {
    this.modalCtrl.dismiss()
  }

  getTotal() {
    let total = 0
    this.items.forEach((item: any) => {
      total += item.price * item.quantity
    })
    return total
  }

  plus(id: any) {
    this.items.map((item: any) => {
      if(item.id === id) {
        item.quantity++
      }
      return item
    })
  }

  rest(id: any) {
    this.items.map((item: any) => {
      if(item.id === id) {
        if(item.quantity >= 2) {
          item.quantity--
        }
        return item
      }
    })
  }

  remove(id: any) {
    this.items= this.items.filter((item: any) => item.id !== id)
    if(this.items.length === 0) {
      this.modalCtrl.dismiss({empty: true})
    }
  }

  savePackage() {
    if(this.items.length > 0 && this.formGroup.valid) {
      this.restApi.post(this.pathLoad, { items: this.items, ...this.formGroup.value }).subscribe((response) => {
        if(response.error) {
          this.Swal.fire({
            title: 'Error',
            text: response.msg,
            icon: 'error'
          })
        }

        if(response.done) {
          this.Swal.fire({
            title: 'Ok',
            text: response.msg,
            icon: 'success'
          })
          this.reloadService.addChanges({changes: true, type: CHANGES_TYPE.ADD})
          this.modalCtrl.dismiss({success: true})
        }
      })
    } else {
      validateFields(this.formGroup, this.errors)
    }
  }

  updatePackage() {
    if(this.items.length > 0 && this.formGroup.valid) {
      this.restApi.put(this.pathLoad + this.package.id, { items: this.items, ...this.formGroup.value }).subscribe((response) => {
        if(response.error) {
          this.Swal.fire({
            title: 'Error',
            text: response.msg,
            icon: 'error'
          })
        }

        if(response.done) {
          this.Swal.fire({
            title: 'Ok',
            text: response.msg,
            icon: 'success'
          })
          this.reloadService.addChanges({changes: true, type: CHANGES_TYPE.ADD})
          this.modalCtrl.dismiss({success: true})
        }
      })
    } else {
      validateFields(this.formGroup, this.errors)
    }
  }

  async presentAlert(action: string) {
    const alert = await this.alertCtrl.create({
      header: '¿Desea guardar paquete?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        }, {
          text: 'Si',
          handler: () => {
            if(action === 'save') {
              this.savePackage()
            }
            if(action === 'update') {
              this.updatePackage()
            }
          }
        }
      ]
    });

    await alert.present()
  }

  setValue($event: any, id: any) {
    let value = $event.target.value
    if(value === '' || value.includes('.') || value.includes('-')) {
      value = 1
    } else {
      value = parseInt(value)
    }
    this.items.map((item: any) => {
      if(item.id === id) {
        if(value >= 1) {
          item.quantity = value
        }
        return item
      }
    })
    $event.target.value = value
  }
}

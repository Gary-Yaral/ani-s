import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { ReloadService } from 'src/app/services/reload.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { CHANGES_TYPE, PACKAGE_STATUS } from 'src/app/utilities/constants';
import { Limit, detectChange, ellipsis, textValidator, validateFields } from 'src/app/utilities/functions';
import { API_PATHS } from 'src/constants';

@Component({
  selector: 'app-modal-package',
  templateUrl: './modal-package.page.html',
  styleUrls: ['./modal-package.page.scss'],
})
export class ModalPackagePage implements OnInit {
  @Input() items: any = {}
  @Input() sectionNames: any = {}
  @Input() package!: any
  categories: string[] = []
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
    this.loadCategories()
    this.loadPackageStatus()
  }

  loadPackageStatus() {
    this.restApi.get(this.pathLoad+'statuses').subscribe((response)=> {
      this.statuses = response.data.statuses;
      if(this.package) {
        this.formGroup.setValue({
          name: this.package.name,
          status: this.package.status
        })
      }
    })
  }

  loadCategories() {
    this.categories = Object.keys(this.items)
  }

  hideModal() {
    this.modalCtrl.dismiss()
  }

  getTotal() {
    let total = 0
    this.categories.forEach((cat: any) => {
      this.items[cat].forEach((item: any) => {
        total += item.price * item.quantity
      })
    })
    return total
  }

  plus(category: any, id: any) {
    this.items[category].map((item: any) => {
      if(item.id === id) {
        item.quantity++
      }
      return item
    })
  }

  rest(category: any, id: any) {
    this.items[category].map((item: any) => {
      if(item.id === id) {
        if(item.quantity >= 2) {
          item.quantity--
        }
        return item
      }
    })
  }

  remove(category: any, id: any) {
    let copy = [...this.items[category]]
    this.items[category]= copy.filter((item) => item.id !== id)
    if(this.items[category].length === 0) {
      this.categories = this.categories.filter((cat:any) => cat !== category)
      delete this.items[category]
    }

    if(this.categories.length === 0) {
      this.hideModal()
    }
  }

  savePackage() {
    if(this.categories.length > 0 && this.formGroup.valid) {
      let data = this.prepareDataSend()
      this.restApi.post(this.pathLoad, { ...data, ...this.formGroup.value }).subscribe((response) => {
        console.log(response);

        if(response.result) {
          this.Swal.fire({
            title: 'Ok',
            text: response.message,
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
    if(this.categories.length > 0 && this.formGroup.valid) {
      let data = this.prepareDataSend()
      this.restApi.put(this.pathLoad + this.package.id, { ...data, ...this.formGroup.value }).subscribe((response) => {
        console.log(response);

        if(response.result) {
          this.Swal.fire({
            title: 'Ok',
            text: response.message,
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

  prepareDataSend() {
    let obj: any = {}
    this.categories.forEach((category:string)=>{
      obj[category] = []
      this.items[category].forEach((item: any) => {
        obj[category].push({
          itemId: item.id,
          quantity: item.quantity,
          packageId: this.package ? this.package.id : null
        })
      })
    })
    return obj
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

  setValue($event: any, category: any, id: any) {
    let value = $event.target.value
    if(value === '' || value.includes('.') || value.includes('-')) {
      value = 1
    } else {
      value = parseInt(value)
    }
    this.items[category].map((item: any) => {
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

import { Component,Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IonModal, ModalController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { ReloadService } from 'src/app/services/reload.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ALERT_BTNS } from 'src/app/utilities/alertModal';
import { CHANGES_TYPE, FORM_ACTIONS } from 'src/app/utilities/constants';
import { API_PATHS } from 'src/constants';
import { ModalPackagePage } from '../../modal-package/modal-package.page';
import { Limit, detectChange } from 'src/app/utilities/functions';

@Component({
  selector: 'app-load-sections',
  templateUrl: './load-sections.page.html',
  styleUrls: ['./load-sections.page.scss'],
})
export class LoadSectionsPage implements OnInit {
  @Input() data!: any
  constructor(
    private restApi: RestApiService,
    private modalCrtl: ModalController,
  ) {}
  // Path para cargar los datos de la tabla
  pathLoad: string = API_PATHS.packages
  // Items de la sección visible
  items: any = []
  // Categorias de los items
  categories: any = []
  // Subcategorias de los items
  subcategories: any = []
  // Ruta para consultar la imagenes
  pathImages: string = API_PATHS.images
  // Titulo de la sección
  sectionTitle: string = 'Paquete'
  // Action que hará el formulario
  formAction: string = 'Nueva'
  // Id seleccionado para editar
  selectedId!: number
  // Sección seleccionada para cargar
  selectedSection!: string;
  selectedPackage!: any;
  // Datos seleccionados
  selectedData: any = []
  // Mensajes de error de formulario
  errors: any = {
    request: ''
  }

  sections: any = {
    chairs:       'chairs',
    tables:       'tables',
    drinks:       'drinks',
    dishes:       'dishes',
    decorations:  'decorations'
  }

  sectionNames: any = {
    chairs:       'Asientos',
    tables:       'Mesas',
    drinks:       'Bebidas',
    dishes:       'Comidas',
    decorations:  'Decoraciones'
  }

  formGroup: FormGroup = new FormGroup({
    categoryId: new FormControl('', [Validators.required]),
    subcategoryId: new FormControl('', [Validators.required])
  })

  // Detectar errores mientras se llena el formulario
  detectChange: Function = ($event: any, name: string, limit: Limit = {}, callback: Function = () => {}) => detectChange(this.formGroup, this.errors)($event, name, limit)


  ngOnInit() {
    this.loadCategories()
    if(this.data) {
      this.formAction = this.data.eventType
      if(this.data.package) {
        this.getPackageData()
        this.loadDataUpdate(this.data.package.id)
      }
    }

  }

  loadDataUpdate(id: any) {
    this.restApi.get(this.pathLoad+'load/'+id).subscribe((response:any) => {
      if(response.data.length > 0) {
        this.selectedData = response.data
      }
    })
  }

  getSectionName() {
    let name = this.sectionNames[this.formGroup.get('section')?.value]
    return name
  }

  loadSection() {
    let validation = this.canLoadSubcategories()
    if(validation.valid) {
      this.restApi.get(API_PATHS.items+'subcategory/' + validation.id).subscribe((response) => {
        if(response.data) {
          this.items = response.data


        }
      })
    } else {
      this.items = []
    }
  }

  checkIfExists(id: number) {
    for (let item of this.selectedData){
      return item.id === id
    }
    return false
  }

  cancel() {
    this.items = []
    this.selectedData = {}
    this.modalCrtl.dismiss(null, 'cancel');
  }

  selectItem($event:any, item: any) {
    let isChecked = $event.target.checked
    if(isChecked) {
      // Buscamos el item para ver si no se repite
      let found = this.selectedData.find((info:any) => info.id === item.id)
      if(!found) {
        // Creamos una copia del item
        let obj = {...item}
        // Le añadimos la propiedad de cantidad
        obj.quantity = 1
        // Lo agregamos al paquete
        this.selectedData.push(obj)
      }
    } else {
      // Removemos el item del paquete
      this.selectedData = this.selectedData.filter((info: any) => info.id !== item.id)
    }
  }

  resetData() {
    this.formGroup.setValue({
      categoryId: '',
      subcategoryId: '',
    })
  }

  async showPackage() {
    if(this.selectedData.length === 0){return}
    this.resetData()
    const modal = await this.modalCrtl.create({
      component: ModalPackagePage,
      componentProps: {
        items: this.selectedData,
        package: this.selectedPackage
      }
    })

    await modal.present();
    const { data } = await modal.onDidDismiss();
    if(data) {
      if(data.success) {
        this.cancel()
      };
      if(data.empty) {
        this.selectedData = []
      };
    }
  }

  showBtnNextWindow() {
    return Object.keys(this.selectedData).length > 0
  }

  loadSubcategories() {
    this.items = []
    this.subcategories = []
    this.formGroup.get('subcategoryId')?.setValue('')
    const id = this.formGroup.get('categoryId')?.value
    if(id !== '' && id !== null) {
      this.restApi.get(API_PATHS.subcategories + 'list/' + id).subscribe((response) => {
        if(response.data){
          this.subcategories = response.data
        }
      })
    }
  }

  loadCategories() {
    this.restApi.get(API_PATHS.categories + 'list').subscribe((response) => {
      if(response.data) {
        this.categories = response.data
      }
    })
  }

  canLoadSubcategories() {
    const value = this.formGroup.get('subcategoryId')?.value
    return {
      valid: value !== '' && value !== null,
      id: value
    }
  }

  getPackageData() {
    if(this.data.package) {
      if(this.data.package.id) {
        this.restApi.get(this.pathLoad + 'find/' + this.data.package.id).subscribe((response) => {
          if(response.data) {
            this.selectedPackage = response.data
          }
        })
      }
    }
  }
}





import { Component,Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IonModal, ModalController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert.service';
import { ReloadService } from 'src/app/services/reload.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ALERT_BTNS } from 'src/app/utilities/alertModal';
import { CHANGES_TYPE, FORM_ACTIONS } from 'src/app/utilities/constants';
import { API_PATHS } from 'src/constants';
import { ModalPackagePage } from '../../modal-package/modal-package.page';

@Component({
  selector: 'app-load-sections',
  templateUrl: './load-sections.page.html',
  styleUrls: ['./load-sections.page.scss'],
})
export class LoadSectionsPage implements OnInit {
  @Input() data!: any
  constructor(
    private restApi: RestApiService,
    private reloadService: ReloadService,
    private Swal: SweetAlertService,
    private alert: AlertService,
    private modalCrtl: ModalController
  ) {}
  // Path para cargar los datos de la tabla
  pathLoad: string = API_PATHS.packages
  // Items de la sección visible
  items: any = []
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
  // Datos seleccionados
  selectedData: any = {}
  // Paquete seleccionado para editar
  selectedPackage!: any
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
    section: new FormControl(null)
  })

  ngOnInit() {
    if(this.data) {
      this.formAction = this.data.eventType
      if(this.data.package) {
        this.loadDataUpdate(this.data.package.id)
      }
    }

  }

  loadDataUpdate(id: any) {
    this.restApi.get(this.pathLoad+'find/'+id).subscribe((response:any) => {
      Object.keys(this.sections).forEach((category: string) =>{
        if(response.data[category].length > 0) {
          this.selectedData[category] = response.data[category]
        }
      })

      this.selectedPackage = response.package
    })
  }

  getSectionName() {
    let name = this.sectionNames[this.formGroup.get('section')?.value]
    return name

  }

  onRadioChange($event: any) {
    this.loadSection()
  }

  loadSection() {
    let sectionName = this.formGroup.get('section')?.value
    this.restApi.get(API_PATHS[sectionName]+'list').subscribe((response) => {
      if(response.result) {
        this.items = response.data
      }
    })
  }

  cancel() {
    this.items = []
    this.selectedData = {}
    this.modalCrtl.dismiss(null, 'cancel');
  }

  selectItem($event:any, item: any) {
    let isChecked = $event.target.checked
    let sectionName = this.formGroup.get('section')?.value
    if(isChecked) {
      if(!this.selectedData[sectionName]) {
        this.selectedData[sectionName] = []
      }
      // Buscamos el item para ver si no se repite
      let found = this.selectedData[sectionName].find((info:any) => info.id === item.id)
      if(!found) {
        // Creamos una copia del item
        let obj = {...item}
        // Le añadimos la propiedad de cantidad
        obj.quantity = 1
        // Lo agregamos al paquete
        this.selectedData[sectionName].push(obj)
      }
    } else {
      // Removemos el item del paquete
      this.selectedData[sectionName] = this.selectedData[sectionName].filter((info: any) => info.id !== item.id)
    }
  }

  isChecked(id: any) {
    let sectionName = this.formGroup.get('section')?.value
    if(this.selectedData[sectionName]) {
      let found = this.selectedData[sectionName].find((info:any) => info.id === id)
      return found ? true: false
    }
    return false
  }

  async showPackage() {
    const modal = await this.modalCrtl.create({
      component: ModalPackagePage,
      componentProps: {
        items: this.selectedData,
        sectionNames:this.sectionNames,
        package: this.selectedPackage
      }
    })

    await modal.present();
    const { data } = await modal.onDidDismiss();
    if(data) {
      if(data.success) {
        this.cancel()
      };
    }

  }

  showBtnNextWindow() {
    return Object.keys(this.selectedData).length > 0
  }
}





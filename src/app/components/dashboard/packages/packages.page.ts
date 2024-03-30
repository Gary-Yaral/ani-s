import { Component, ElementRef, ViewChild } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ReloadService } from 'src/app/services/reload.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { CHANGES_TYPE, FORM_ACTIONS } from 'src/app/utilities/constants';
import { API_PATHS } from 'src/constants';
import { LoadSectionsPage } from '../../modals/load-sections/load-sections.page';

@Component({
  selector: 'app-packages',
  templateUrl: './packages.page.html',
  styleUrls: ['./packages.page.scss'],
})
export class PackagesPage {
  constructor(
    private restApi: RestApiService,
    private reloadService: ReloadService,
    private Swal: SweetAlertService,
    private alertCtrl: AlertController,
    private modalCrtl: ModalController
  ) {}


  // Formulario HTML
  @ViewChild('formToSend') formRef!: ElementRef;

  // Path para cargar los datos de la tabla
  pathLoad: string = API_PATHS.packages
  // Cabeceras de la tabla
  theads: string[] = ['N°', 'Nombre','Tipo', 'Precio', 'Estado', 'Opciones']
  // Campos o propiedades que se extraeran de cada objeto, lo botones se generan por defecto
  fields: string[] = ['index', 'name', 'type', 'price', 'status']
  // Propiedades de tipo moneda
  money: string[] = ['price']
  // Ruta para consultar la imagenes
  pathImages: string = API_PATHS.images
  // Nombre de endopoint para filtrar en la tabla, será concatenado con path principal
  pathFilter: string = 'filter'
  // Id seleccionado para editar
  selectedId!: number

  async showToAdd() {
    const modal = await this.modalCrtl.create({
      component: LoadSectionsPage,
      componentProps: {
        data: {
          eventType: FORM_ACTIONS.ADD,
          package: null
        }
      }
    })

    await modal.present();
    const { data } = await modal.onDidDismiss();
    if(data) {
      if(data.success) {};
    }
  }

  async showDelete(item: any) {
    console.log(item.id);
    this.selectedId = item.id

    let alert = await this.alertCtrl.create({
      header: '¿Deseas eliminar este paquete?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        }, {
          text: 'Si',
          handler: () => {
            this.deleteRegister()
          }
        }
      ]
    })
    await alert.present()
  }

  async showUpdate($event: any) {
    const modal = await this.modalCrtl.create({
      component: LoadSectionsPage,
      componentProps: {
        data: {
          eventType: FORM_ACTIONS.UPDATE,
          package: $event
        }
      }
    })

    await modal.present();
  }

  deleteRegister() {
    this.restApi.delete(this.pathLoad + this.selectedId).subscribe((result:any) => {
      if(result.error) {
        this.Swal.fire({
          title: 'Error',
          icon: 'error',
          text: result.error
        })
      } else {
        this.Swal.fire({
          title: 'Ok',
          icon: 'success',
          text: result.messaje
        })
        // Hacemos que la tabla se refresque notificando que hubo cambios
        this.reloadService.addChanges({changes: true, type: CHANGES_TYPE.DELETE})
      }
    })
  }
}




import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(private alertController: AlertController) {}

  async getAddAlert(cancel: any, accept: any) {
    // Creamos la alerta que vamos a mostrar
    const alert = await this.alertController.create({
      subHeader: '¿Deseas guardar el registro?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
              cancel()
              alert.dismiss()
          }
        },
        {
          text: 'Guardar',
          handler: () => accept
        }
      ]
    })
    alert.present()
    return alert
  }

  async getUpdateAlert(cancel: any, accept: any) {
    // Creamos la alerta que vamos a mostrar
    const alert = await this.alertController.create({
      subHeader: '¿Deseas guardar los cambios?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
              cancel()
              alert.dismiss()
          }
        },
        {
          text: 'Guardar',
          handler: () => accept
        }
      ]
    })
    alert.present()
    return alert
  }

  async getDeleteAlert(accept: any, cancel: any = ()=>{}) {
    // Creamos la alerta que vamos a mostrar
    const alert = await this.alertController.create({
      subHeader: '¿Deseas eliminar este registro?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
              cancel()
              alert.dismiss()
          }
        },
        {
          text: 'Eliminar',
          handler: () => accept()
        }
      ]
    })

    alert.present()
    return alert
  }


}

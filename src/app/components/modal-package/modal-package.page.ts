import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { API_PATHS } from 'src/constants';

@Component({
  selector: 'app-modal-package',
  templateUrl: './modal-package.page.html',
  styleUrls: ['./modal-package.page.scss'],
})
export class ModalPackagePage implements OnInit {
  @Input() items: any = {}
  @Input() sectionNames: any = {}
  categories: string[] = []

  // Ruta para consultar la imagenes
  pathImages: string = API_PATHS.images

  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.loadData()
  }

  loadData() {
    this.categories = Object.keys(this.items)
  }

  hideModal() {
    this.modalCtrl.dismiss(this.items)
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
    console.log(this.items);
  }

  async presentAlert() {
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
            this.savePackage()
          }
        }
      ]
    });

    await alert.present();
  }

}

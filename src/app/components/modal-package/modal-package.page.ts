import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
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

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    console.log('here');
    console.log(this.items);
    this.loadData()
  }

  loadData() {
    this.categories = Object.keys(this.items)
  }

  hideModal() {
    console.log(this.items);

    this.modalCtrl.dismiss(this.items)
  }

}

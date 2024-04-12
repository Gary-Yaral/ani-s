import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { RestApiService } from 'src/app/services/rest-api.service';
import { ellipsis } from 'src/app/utilities/functions';
import { API_PATHS } from 'src/constants';

@Component({
  selector: 'app-show-package',
  templateUrl: './show-package.page.html',
  styleUrls: ['./show-package.page.scss'],
})
export class ShowPackagePage implements OnInit {
  @Input() data!: any;
  constructor(
    private restApi: RestApiService,
    private modalCrtl: ModalController
  ) { }
  items: any = []
  pathImages: string = API_PATHS.images
  title: string = 'Items del paquete'
    // Para dibujar los ... en caso de que queramos limiar el texto
    ellipsis: Function = ellipsis
  ngOnInit() {
    console.log(this.data)
    if(this.data) {
      this.loadPackageData(this.data.reservation.id)
    }

  }

  async loadPackageData(reservationId: any) {
    this.restApi.post(API_PATHS.reservations + 'package', {reservationId}).subscribe((response) => {
      if(response.data) {
        this.items = response.data
        let result = this.items.reduce((acc: any, next: any) => {
          return acc + (next.price *  next.quantity)
        }, 0)
        console.log(result)

      }
      console.log(response.data)

    })
  }

  cancel() {
    this.modalCrtl.dismiss()
  }

}

import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { RestApiService } from 'src/app/services/rest-api.service';
import { StorageData } from 'src/app/utilities/storage';
import { API_PATHS } from 'src/constants';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  adminRole: string = 'ADMINISTRADOR'
  data: any = [
    {
      type: 'users',
      label: 'Usuarios',
      total: 0,
      class: 'card-blue'
    },
    {
      type: 'rooms',
      label: 'Locales',
      total: 0,
      class: 'card-green'
    },
    {
      type: 'reservations',
      label: 'Reservaciones',
      total: 0,
      class: 'card-purple'
    },
    {
      type: 'items',
      label: 'Items',
      total: 0,
      class: 'card-orange'
    }
  ]

  suscription!: Subscription

  constructor(
    private restApi: RestApiService
  ) { }

  ngOnInit() {
    this.loadData()
  }

  loadData() {
    this.restApi.get(API_PATHS.home).subscribe((response) => {
      if(response.data) {
        if(response.data.length > 0) {
          const processed: any = []
          const isAdmin = StorageData.get().roleName === this.adminRole
          if(isAdmin) {
            delete response.data[0].users
          }
          const keys = Object.keys(response.data[0])
          keys.forEach((key) => {
            let item = this.data.find((card: any) => card.type === key)
            item.total = response.data[0][key]
            processed.push(item)
          })

          this.data = processed
        }
      }

    })
  }

}

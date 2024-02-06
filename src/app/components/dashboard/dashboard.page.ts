import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestApiService } from 'src/app/services/rest-api.service';
import { WINDOW_TITLES } from 'src/constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  view:string = WINDOW_TITLES['home']
  userLogged!: string;
  loggedIcon: string = 'checkmark-circle';
  public appPages = [
    { title: 'Inicio', url: '/dashboard/home', icon: 'home' },
    { title: 'Usuarios', url: '/dashboard/users', icon: 'person' },
    { title: 'Bebidas', url: '/dashboard/drinks', icon: 'beer' },
    { title: 'Menus', url: '/dashboard/menus', icon: 'restaurant' },
    { title: 'Mesas', url: '/dashboard/tables', icon: 'square' },
    { title: 'Sillas', url: '/dashboard/chairs', icon: 'layers' },
    { title: 'Decoraciones', url: '/dashboard/decorations', icon: 'flower' },
    { title: 'Reservaciones', url: '/dashboard/reservations', icon: 'qr-code' },
    { title: 'Paquetes', url: '/dashboard/packages', icon: 'cube' },
    { title: 'Pagos', url: '/dashboard/payments', icon: 'card' },
    { title: 'Configuración', url: '/dashboard/settings', icon: 'options' },
  ];
  public labels = [
    { title: 'Web', url: '/dashboard/spam', icon: 'globe' }
  ];

  constructor(
    private route: ActivatedRoute,
    private restApi: RestApiService
    ) { }

  ngOnInit(): void {
    const viewParam = this.route.snapshot.params['view'];
    if(viewParam && viewParam !== '') {
      this.view = WINDOW_TITLES[viewParam]
    }
    this.userLogged = 'Federico Pilares Montiel'
  }

}

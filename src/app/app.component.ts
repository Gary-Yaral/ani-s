import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  userLogged!: string;
  loggedIcon: string = 'checkmark-circle';
  public appPages = [
    { title: 'Inicio', url: '/folder/home', icon: 'home' },
    { title: 'Usuarios', url: '/folder/users', icon: 'person' },
    { title: 'Bebidas', url: '/folder/drinks', icon: 'beer' },
    { title: 'Menus', url: '/folder/menus', icon: 'restaurant' },
    { title: 'Mesas', url: '/folder/tables', icon: 'square' },
    { title: 'Sillas', url: '/folder/chairs', icon: 'layers' },
    { title: 'Decoraciones', url: '/folder/decorations', icon: 'flower' },
    { title: 'Reservaciones', url: '/folder/reservations', icon: 'qr-code' },
    { title: 'Paquetes', url: '/folder/packages', icon: 'cube' },
    { title: 'Pagos', url: '/folder/payments', icon: 'card' },
    { title: 'Configuración', url: '/folder/settings', icon: 'options' },
  ];
  public labels = [
    { title: 'Web', url: '/folder/spam', icon: 'globe' }
  ];

  ngOnInit() {
    this.userLogged = 'Andres García'
  }
  constructor() {}
}

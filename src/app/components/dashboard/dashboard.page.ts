import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { RestApiService } from 'src/app/services/rest-api.service';
import { clearStorage, getData, refreshToken } from 'src/app/utilities/storageOptions';
import { API_PATHS, FIND_USER_PATH, WINDOW_TITLES } from 'src/constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  view:string = WINDOW_TITLES['home']
  userLogged!: string;
  loggedIcon: string = 'shield-checkmark';
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
    { title: 'Configuración', url: '/dashboard/settings', icon: 'options' }
  ];
  public labels = [
    { title: 'Web', url: '/dashboard/spam', icon: 'globe' }
  ];

  constructor(
    private restApi: RestApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Cargamos el titulo de la sección
    this.loadSectionTitle()
    // Cargamos usuario logueado
    this.loadUser()
    // Inicializamos el refreshToken
    this.refreshToken()
  }

  loadSectionTitle() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      if(!event) {return}
      if(!event.url) {return}
      if(typeof event.url !== 'string') {return}
      if(!event.url.includes('/')){return}
      const path = event.url.split('/')
      this.view = WINDOW_TITLES[path[path.length -1]]
    });
  }

  refreshToken() {
    this.refresh()
    const minutes = 2 * 60 * 1000
    setInterval(() => {
      this.refresh()
    }, minutes)
  }

  refresh() {
    this.restApi.get(API_PATHS.refreshToken).subscribe((result: any) => {
      // Si hay error eliminamos la sesión
      if(result.error) {
        return this.destroySession()
      }
      // Guardamos el nuevo token
      if(result.token) {
        refreshToken(result.token)
      }
    })
  }

  loadUser() {
    // Leemos el id del usuario logueado desde el localStorage
    const { userId } = getData()
    // Consultamos el usuario
    this.restApi.get(FIND_USER_PATH + userId).subscribe((data: any) => {
      if(data.User) {
        const { name, lastname } = data.User
        // Combinamos el nombre con el apaellido
        this.userLogged = name + ' ' + lastname
      }

    })
  }

  destroySession() {
    clearStorage()
    this.router.navigate(['/login'])
  }
}

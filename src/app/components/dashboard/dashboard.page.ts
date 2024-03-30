import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Browser } from '@capacitor/browser';
import { Subscription, filter } from 'rxjs';
import { NavbarService } from 'src/app/services/navbar.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { StorageData } from 'src/app/utilities/storage';
import { BUSSINESS_NAME, FIND_USER_PATH, WINDOW_TITLES } from 'src/constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, OnDestroy {
  view:string = WINDOW_TITLES['home']
  userLogged!: string;
  userRole!: string;
  loggedIcon: string = 'shield-checkmark';
  appName: string = `${BUSSINESS_NAME} App`
  public appPages = [
    { title: 'Inicio', url: '/dashboard/home', icon: 'home' },
    { title: 'Usuarios', url: '/dashboard/users', icon: 'person' },
    { title: 'Items', url: '/dashboard/items', icon: 'list'},
    { title: 'Paquetes', url: '/dashboard/packages', icon: 'cube' },
    { title: 'Pagos', url: '/dashboard/payments', icon: 'card' },
    { title: 'Locales', url: '/dashboard/rooms', icon: 'business' },
    { title: 'Reservaciones', url: '/dashboard/reservations', icon: 'qr-code' },
    { title: 'Configuración', url: '/dashboard/settings', icon: 'options' }
  ];

  public labels = [
    { title: 'Web', url: '/dashboard/spam', icon: 'globe' }
  ];

  suscriptionUser!:Subscription

  constructor(
    private restApi: RestApiService,
    private router: Router,
    private navService: NavbarService
  ) { }

  redirectTo(url:string) {
    const urlRoot: string = window.location.origin;
    // Redirige a la URL de la ventana que deseamos
    window.location.href = urlRoot + url
  }

  ngOnInit(): void {
    this.suscriptionUser = this.navService.$user.subscribe((changed) => {
      if(changed) {
        this.loadUser()
      }
    })
    this.loadUser()
  }

  ngOnDestroy() {
    if(this.suscriptionUser) {
      this.suscriptionUser.unsubscribe()
    }
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

  loadUser() {
    this.restApi.get(FIND_USER_PATH).subscribe((data: any) => {
      if(data.User) {
        const { name, lastname } = data.User
        // Combinamos el nombre con el apaellido
        this.userLogged = name + ' ' + lastname
      }

      if(data.Role) {
        const { role} = data.Role
        this.userRole = role
      }

    })
  }

  destroySession() {
    StorageData.remove()
    this.router.navigate(['/login'])
  }

  async goToPage() {
    await Browser.open({ url: 'https://www.google.com',toolbarColor: '#ffffff' })
  }
}

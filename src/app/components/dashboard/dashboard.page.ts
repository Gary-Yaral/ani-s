import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Browser } from '@capacitor/browser';
import { Subscription, filter } from 'rxjs';
import { NavbarService } from 'src/app/services/navbar.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { StorageData } from 'src/app/utilities/storage';
import { BUSSINESS_NAME, FIND_USER_PATH, WINDOW_TITLES } from 'src/constants';
import { appPages, routesPath } from './constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, OnDestroy {
  view:string = routesPath.home.title
  userLogged!: string;
  userRole!: string;
  loggedIcon: string = 'shield-checkmark';
  appName: string = `${BUSSINESS_NAME} App`
  public appPages = appPages
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
    this.loadSectionTitle()
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
      if(path.length > 0) {
        const pathToLoad = path[path.length - 1]
        if(routesPath[pathToLoad]) {
          this.view = routesPath[pathToLoad].title
        }
      }
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

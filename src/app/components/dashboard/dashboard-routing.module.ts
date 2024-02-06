import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPage } from './dashboard.page';
import { HomePage } from './home/home.page';
import { ChairsPage } from './chairs/chairs.page';
import { TablesPage } from './tables/tables.page';
import { MenusPage } from './menus/menus.page';
import { DrinksPage } from './drinks/drinks.page';
import { DecorationsPage } from './decorations/decorations.page';
import { ReservationsPage } from './reservations/reservations.page';
import { PackagesPage } from './packages/packages.page';
import { PaymentsPage } from './payments/payments.page';
import { SettingsPage } from './settings/settings.page';
import { UsersPage } from './users/users.page';

const routes: Routes = [
  {
    path: '',
    component: DashboardPage,
    children: [
      {
        path: 'home',
        component: HomePage
      },
      {
        path: 'users',
        component: UsersPage
      },
      {
        path: 'chairs',
        component: ChairsPage
      },
      {
        path: 'tables',
        component: TablesPage
      },
      {
        path: 'menus',
        component: MenusPage
      },
      {
        path: 'drinks',
        component: DrinksPage
      },
      {
        path: 'decorations',
        component: DecorationsPage
      },
      {
        path: 'reservations',
        component: ReservationsPage
      },
      {
        path: 'packages',
        component: PackagesPage
      },
      {
        path: 'reservations',
        component: ReservationsPage
      },
      {
        path: 'payments',
        component: PaymentsPage
      },
      {
        path: 'settings',
        component: SettingsPage
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'menus',
    loadChildren: () => import('./menus/menus.module').then( m => m.MenusPageModule)
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users.module').then( m => m.UsersPageModule)
  },
  {
    path: 'drinks',
    loadChildren: () => import('./drinks/drinks.module').then( m => m.DrinksPageModule)
  },
  {
    path: 'tables',
    loadChildren: () => import('./tables/tables.module').then( m => m.TablesPageModule)
  },
  {
    path: 'chairs',
    loadChildren: () => import('./chairs/chairs.module').then( m => m.ChairsPageModule)
  },
  {
    path: 'decorations',
    loadChildren: () => import('./decorations/decorations.module').then( m => m.DecorationsPageModule)
  },
  {
    path: 'reservations',
    loadChildren: () => import('./reservations/reservations.module').then( m => m.ReservationsPageModule)
  },
  {
    path: 'packages',
    loadChildren: () => import('./packages/packages.module').then( m => m.PackagesPageModule)
  },
  {
    path: 'payments',
    loadChildren: () => import('./payments/payments.module').then( m => m.PaymentsPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPage } from './dashboard.page';
import { HomePage } from './home/home.page';
import { ReservationsPage } from './reservations/reservations.page';
import { PackagesPage } from './packages/packages.page';
import { PaymentsPage } from './payments/payments.page';
import { SettingsPage } from './settings/settings.page';
import { UsersPage } from './users/users.page';
import { CategoriesPage } from './categories/categories.page';
import { RoomsPage } from './rooms/rooms.page';
import { ItemsPage } from './items/items.page';
import { SubcategoriesPage } from './subcategories/subcategories.page';
import { SchedulePage } from './schedule/schedule.page';

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
        path: 'items',
        component: ItemsPage
      },
      {
        path: 'categories',
        component: CategoriesPage
      },
      {
        path: 'subcategories',
        component: SubcategoriesPage
      },
      {
        path: 'schedules',
        component: SchedulePage
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
        path: 'rooms',
        component: RoomsPage
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
    path: 'categories',
    loadChildren: () => import('./categories/categories.module').then( m => m.CategoriesPageModule)
  },
  {
    path: 'subcategories',
    loadChildren: () => import('./subcategories/subcategories.module').then( m => m.SubcategoriesPageModule)
  },
  {
    path: 'reservations',
    loadChildren: () => import('./reservations/reservations.module').then( m => m.ReservationsPageModule)
  },
  {
    path: 'rooms',
    loadChildren: () => import('./rooms/rooms.module').then( m => m.RoomsPageModule)
  },
  {
    path: 'schedules',
    loadChildren: () => import('./schedule/schedule.module').then( m => m.SchedulePageModule)
  },
  {
    path: 'items',
    loadChildren: () => import('./items/items.module').then( m => m.ItemsPageModule)
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
  },
  {
    path: 'rooms',
    loadChildren: () => import('./rooms/rooms.module').then( m => m.RoomsPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardPageRoutingModule {}

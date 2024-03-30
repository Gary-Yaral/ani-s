import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPage } from './dashboard.page';
import { HomePage } from './home/home.page';
import { ReservationsPage } from './reservations/reservations.page';
import { PackagesPage } from './packages/packages.page';
import { PaymentsPage } from './payments/payments.page';
import { SettingsPage } from './settings/settings.page';
import { UsersPage } from './users/users.page';
import { DrinkTypesPage } from './drink-types/drink-types.page';
import { FoodTypesPage } from './food-types/food-types.page';
import { RoomsPage } from './rooms/rooms.page';
import { ItemsPage } from './items/items.page';

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
        path: 'drink-types',
        component: DrinkTypesPage
      },
      {
        path: 'food-types',
        component: FoodTypesPage
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
    path: 'drinks',
    loadChildren: () => import('./drinks/drinks.module').then( m => m.DrinksPageModule)
  },
  {
    path: 'tables',
    loadChildren: () => import('./tables/tables.module').then( m => m.TablesPageModule)
  },
  {
    path: 'chairs',
    loadChildren: () => import('./items/items.module').then( m => m.ChairsPageModule)
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
    path: 'rooms',
    loadChildren: () => import('./rooms/rooms.module').then( m => m.RoomsPageModule)
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
    path: 'drink-types',
    loadChildren: () => import('./drink-types/drink-types.module').then( m => m.DrinkTypesPageModule)
  },
  {
    path: 'food-types',
    loadChildren: () => import('./food-types/food-types.module').then( m => m.FoodTypesPageModule)
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

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { DashboardGuard } from './guards/dashboard.guard';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    canActivate: [DashboardGuard],
    loadChildren: () => import('./components/dashboard/dashboard.module').then( m => m.DashboardPageModule),
  },
  {
    path: 'login',
    canActivate: [LoginGuard],
    loadChildren: () => import('./components/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: '**',
    redirectTo: 'login'
  },
  {
    path: 'modal-package',
    loadChildren: () => import('./components/modal-package/modal-package.module').then( m => m.ModalPackagePageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

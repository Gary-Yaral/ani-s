import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { dashboardGuard } from './guards/dashboard.guard';
import { loginGuard } from './guards/login.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    canActivate: [dashboardGuard],
    loadChildren: () => import('./components/dashboard/dashboard.module').then( m => m.DashboardPageModule),
  },
  {
    path: 'login',
    canActivate: [loginGuard],
    loadChildren: () => import('./components/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'reset-password',
    canActivate: [loginGuard],
    loadChildren: () => import('./components/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
  {
    path: '**',
    redirectTo: 'login'
  },
  {
    path: 'modal-package',
    loadChildren: () => import('./components/modal-package/modal-package.module').then( m => m.ModalPackagePageModule)
  },
  {
    path: 'load-sections',
    loadChildren: () => import('./components/modals/load-sections/load-sections.module').then( m => m.LoadSectionsPageModule)
  },
  {
    path: 'show-package',
    loadChildren: () => import('./components/modals/show-package/show-package.module').then( m => m.ShowPackagePageModule)
  },
  {
    path: 'update-status',
    loadChildren: () => import('./components/modals/update-status/update-status.module').then( m => m.UpdateStatusPageModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./components/reset-password/reset-password.module').then( m => m.ResetPasswordPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

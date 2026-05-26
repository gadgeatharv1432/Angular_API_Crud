import { Routes } from '@angular/router';

import { LoginComponent } from './component/login/login.component';
import { TasklistComponent } from './component/tasklist/tasklist.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'task',
    component: TasklistComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { role: 'Admin'}
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
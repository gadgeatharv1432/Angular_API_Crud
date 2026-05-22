import { Routes } from '@angular/router';

import { LoginComponent } from './component/login/login.component';
import { TasklistComponent } from './component/tasklist/tasklist.component';

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
  }

];
import { Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { TasklistComponent } from './component/tasklist/tasklist.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { LayoutComponent } from './component/layout/layout.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [

    // Public route — no layout, no guard
    {
        path: 'login',
        component: LoginComponent
    },

    // Protected routes — all share the Layout (Navbar + Sidebar)
    {
        path: '',
        component: LayoutComponent,
        canActivate: [authGuard],
        children: [

            // Default child — redirect to task
            {
                path: '',
                redirectTo: 'task',
                pathMatch: 'full'
            },

            // Task List — all logged-in users
            {
              path: 'task',
              component: TasklistComponent
            },

            // Dashboard — Admin only
            {
                path: 'dashboard',
                component: DashboardComponent,
                canActivate: [roleGuard],
                data: { role: 'Admin' }
            }
        ]
    },

    // Fallback
    {
        path: '**',
        redirectTo: 'login'
    }
];
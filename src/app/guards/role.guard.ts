import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthserviceService } from '../service/authservice.service';

export const roleGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthserviceService);
    const router = inject(Router);

    // Read the required role from the route's data property
    // (we will set data: { role: 'Admin' } in the routes file)
    const expectedRole = route.data?.['role'] as string;

    // Read the logged-in user's role from localStorage
    const userRole = authService.getUserRole();

    if (userRole === expectedRole) {
        return true;  // Role matches → allow
    }

    // Role does not match → redirect to task list
    router.navigate(['/task']);
    return false;
};
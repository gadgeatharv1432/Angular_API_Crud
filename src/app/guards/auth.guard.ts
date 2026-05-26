import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthserviceService } from '../service/authservice.service';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthserviceService);
    const router = inject(Router);

    if (authService.isLoggedIn()) {
        return true;  // Token exists → allow access
    }

    // No token → redirect to login
    router.navigate(['/login']);
    return false;
};
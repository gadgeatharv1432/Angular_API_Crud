import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthserviceService } from '../service/authservice.service';

export const authInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
) => {
    const authService = inject(AuthserviceService);
    const router = inject(Router);

    // Read the stored JWT token
    const token = authService.getToken();

    // If token exists, clone the request and add the Authorization header
    if (token) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }

    // Pass the (modified) request forward
    return next(req).pipe(
        catchError((error) => {
            // If server returns 401 (Unauthorized) → token expired → force logout
            if (error.status === 401) {
                authService.logout();
                router.navigate(['/login']);
            }
            return throwError(() => error);
        })
    );
};
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import Swal from 'sweetalert2';

import { Login } from '../../interfaces/login';
import { AuthserviceService } from '../../service/authservice.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatCardModule,
        MatInputModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {

    hidePassword: boolean = true;
    isLoading: boolean = false;

    loginObj: Login = {
        Email: '',
        Password: ''
    };

    constructor(
        private authService: AuthserviceService,
        private router: Router
    ) { }

    login() {
        this.isLoading = true;  // Show spinner, disable button

        this.authService.login(this.loginObj).subscribe({

            next: (res) => {
                this.isLoading = false;

                // Store token and user info from res.data (ApiResponse wrapper)
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('role', res.data.role);
                localStorage.setItem('user', JSON.stringify(res.data));

                Swal.fire({
                    icon: 'success',
                    title: 'Welcome Back!',
                    text: `Hello, ${res.data.userName}`,
                    timer: 1500,
                    showConfirmButton: false
                }).then(() => {
                    // Navigate based on role
                    if (res.data.role === 'Admin') {
                        this.router.navigate(['/dashboard']);
                    } else {
                        this.router.navigate(['/task']);
                    }
                });
            },

            error: (err) => {
                this.isLoading = false;

                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: err.error?.message || 'Invalid email or password.',
                    confirmButtonColor: '#2563eb'
                });
            }
        });
    }
}
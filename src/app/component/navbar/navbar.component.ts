// src/app/component/navbar/navbar.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthserviceService } from '../../service/authservice.service';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [
        CommonModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule
    ],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

    userName: string = '';
    userRole: string = '';

    constructor(
        private authService: AuthserviceService,
        private router: Router
    ) { }

    ngOnInit(): void {
        // Read user info stored during login
        const userJson = localStorage.getItem('user');
        if (userJson) {
            const user = JSON.parse(userJson);
            this.userName = user.userName;
            this.userRole = user.role;
        }
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
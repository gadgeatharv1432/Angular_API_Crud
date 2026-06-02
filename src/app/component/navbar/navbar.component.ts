import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { Subscription } from 'rxjs';
import { AuthserviceService } from '../../service/authservice.service';
import { PhotoService } from '../../service/photo.service';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatDividerModule
    ],
    templateUrl: './navbar.component.html',
    styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {

    userName: string = '';
    userRole: string = '';
    currentPhoto: string | null = null;

    // Store subscription so we can clean up in ngOnDestroy
    private photoSubscription!: Subscription;

    constructor(
        private authService: AuthserviceService,
        private router: Router,
        private photoService: PhotoService
    ) { }

    ngOnInit(): void {
        const userJson = localStorage.getItem('user');
        if (userJson) {
            const user = JSON.parse(userJson);
            this.userName = user.userName;
            this.userRole = user.role;
        }

        this.photoSubscription = this.photoService.photo$.subscribe(photo => {
            this.currentPhoto = photo;
        });
    }

    ngOnDestroy(): void {
        this.photoSubscription?.unsubscribe();
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

    // Computed: first letter of username for avatar fallback
    get avatarInitial(): string {
        return this.userName?.charAt(0).toUpperCase() || 'U';
    }
}
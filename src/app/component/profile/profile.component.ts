import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import Swal from 'sweetalert2';

import { ProfileService } from '../../service/profile.service';
import { PhotoService } from '../../service/photo.service';
import { ChangePasswordDTO, GetProfileDTO, UpdateProfileDTO } from '../../interfaces/profile';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatDividerModule
    ],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
    @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

    // Current profile photo (Base64 string or null)
    currentPhoto: string | null = null;

    // Profile data from API
    profile: GetProfileDTO = {
        id: '',
        userName: '',
        email: '',
        role: ''
    };

    // Form models
    updateForm: UpdateProfileDTO = { userName: '' };

    passwordForm: ChangePasswordDTO = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    };

    // Loading states
    isLoadingProfile = false;
    isSavingProfile = false;
    isChangingPassword = false;

    // Password visibility toggles
    hideCurrentPassword = true;
    hideNewPassword = true;
    hideConfirmPassword = true;

    // Computed: first letter of username for the avatar circle
    get avatarInitial(): string {
        return this.profile.userName?.charAt(0).toUpperCase() || '?';
    }

    constructor(
        private profileService: ProfileService,
        private photoService: PhotoService
    ) { }

    ngOnInit(): void {
        this.photoService.photo$.subscribe(photo => {
            this.currentPhoto = photo;
        });

        this.loadProfile();
    }

    // ── Load profile from API ──────────────────────────────────
    loadProfile(): void {
        this.isLoadingProfile = true;
        this.profileService.getProfile().subscribe({
            next: (res) => {
                this.isLoadingProfile = false;
                this.profile = res.data;
                this.updateForm.userName = res.data.userName;
            },
            error: () => {
                this.isLoadingProfile = false;
                Swal.fire('Error', 'Could not load profile.', 'error');
            }
        });
    }

    // ── Trigger the hidden file input ──────────────────────────
    triggerFileInput(): void {
        this.fileInput.nativeElement.click();
    }

    // ── Handle file selection ──────────────────────────────────
    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            Swal.fire('Invalid File', 'Please select an image file (JPG, PNG, GIF).', 'warning');
            return;
        }

        const maxSize = 800 * 1024;
        if (file.size > maxSize) {
            Swal.fire('File Too Large', 'Please select an image under 800KB.', 'warning');
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            const base64 = reader.result as string;
            this.photoService.setPhoto(base64);
            input.value = '';

            Swal.fire({
                icon: 'success',
                title: 'Photo Updated!',
                timer: 1500,
                showConfirmButton: false,
                toast: true,
                position: 'bottom-end'
            });
        };

        reader.readAsDataURL(file);
    }

    // ── Remove photo ───────────────────────────────────────────
    removePhoto(): void {
        Swal.fire({
            title: 'Remove Photo?',
            text: 'Your profile photo will be removed.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            confirmButtonText: 'Yes, remove it'
        }).then(result => {
            if (result.isConfirmed) {
                this.photoService.clearPhoto();
            }
        });
    }

    // ── Save profile changes ───────────────────────────────────
    saveProfile(): void {
        if (!this.updateForm.userName?.trim()) {
            Swal.fire('Validation', 'Full name cannot be empty.', 'warning');
            return;
        }

        this.isSavingProfile = true;
        this.profileService.updateProfile(this.updateForm).subscribe({
            next: () => {
                this.isSavingProfile = false;
                this.profile.userName = this.updateForm.userName;
                const userJson = localStorage.getItem('user');
                if (userJson) {
                    const user = JSON.parse(userJson);
                    user.userName = this.updateForm.userName;
                    localStorage.setItem('user', JSON.stringify(user));
                }

                Swal.fire({
                    icon: 'success',
                    title: 'Profile Updated!',
                    timer: 2000,
                    showConfirmButton: false
                });
            },
            error: () => {
                this.isSavingProfile = false;
                Swal.fire('Error', 'Could not update profile.', 'error');
            }
        });
    }

    // ── Change password ────────────────────────────────────────
    changePassword(): void {
        if (!this.passwordForm.currentPassword) {
            Swal.fire('Validation', 'Please enter your current password.', 'warning');
            return;
        }
        if (this.passwordForm.newPassword.length < 6) {
            Swal.fire('Validation', 'New password must be at least 6 characters.', 'warning');
            return;
        }
        if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
            Swal.fire('Validation', 'Passwords do not match.', 'warning');
            return;
        }

        this.isChangingPassword = true;
        this.profileService.changePassword(this.passwordForm).subscribe({
            next: () => {
                this.isChangingPassword = false;
                this.passwordForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
                Swal.fire({
                    icon: 'success',
                    title: 'Password Changed!',
                    timer: 2000,
                    showConfirmButton: false
                });
            },
            error: (err) => {
                this.isChangingPassword = false;
                Swal.fire('Error', err.error?.message || 'Could not change password.', 'error');
            }
        });
    }
}
import { Component, OnInit } from '@angular/core';
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

    // ── Profile data loaded from API ───────────────────────────
    profile: GetProfileDTO = {
        id: '',
        userName: '',
        email: '',
        role: ''
    };

    // ── Form model for "Personal Information" section ──────────
    updateForm: UpdateProfileDTO = {
        userName: ''
    };

    // ── Form model for "Change Password" section ───────────────
    passwordForm: ChangePasswordDTO = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    };

    // ── Loading states — show spinners while API calls run ─────
    isLoadingProfile: boolean = false;
    isSavingProfile: boolean = false;
    isChangingPassword: boolean = false;

    // ── Password visibility toggles ────────────────────────────
    hideCurrentPassword: boolean = true;
    hideNewPassword: boolean = true;
    hideConfirmPassword: boolean = true;

    // ── Avatar initial letter (computed from userName) ─────────
    get avatarInitial(): string {
        return this.profile.userName
            ? this.profile.userName.charAt(0).toUpperCase()
            : '?';
    }

    constructor(private profileService: ProfileService) { }

    ngOnInit(): void {
        this.loadProfile();
    }

    // ── Load profile from API ──────────────────────────────────
    loadProfile(): void {
        this.isLoadingProfile = true;

        this.profileService.getProfile().subscribe({
            next: (res) => {
                this.isLoadingProfile = false;
                this.profile = res.data;

                // Pre-fill the editable form with current values
                this.updateForm.userName = res.data.userName;
            },
            error: () => {
                this.isLoadingProfile = false;
                Swal.fire('Error', 'Could not load profile.', 'error');
            }
        });
    }

    // ── Save profile changes ───────────────────────────────────
    saveProfile(): void {
        // Basic validation — don't call API with empty name
        if (!this.updateForm.userName?.trim()) {
            Swal.fire('Validation Error', 'Full name cannot be empty.', 'warning');
            return;
        }

        this.isSavingProfile = true;

        this.profileService.updateProfile(this.updateForm).subscribe({
            next: () => {
                this.isSavingProfile = false;

                // Update the local profile display with the new name
                this.profile.userName = this.updateForm.userName;

                Swal.fire({
                    icon: 'success',
                    title: 'Profile Updated!',
                    text: 'Your profile has been saved successfully.',
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
        // Frontend validation before hitting the API
        if (!this.passwordForm.currentPassword) {
            Swal.fire('Validation', 'Please enter your current password.', 'warning');
            return;
        }
        if (this.passwordForm.newPassword.length < 6) {
            Swal.fire('Validation', 'New password must be at least 6 characters.', 'warning');
            return;
        }
        if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
            Swal.fire('Validation', 'New password and confirm password do not match.', 'warning');
            return;
        }

        this.isChangingPassword = true;

        this.profileService.changePassword(this.passwordForm).subscribe({
            next: () => {
                this.isChangingPassword = false;

                // Clear the password form after success
                this.passwordForm = {
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                };

                Swal.fire({
                    icon: 'success',
                    title: 'Password Changed!',
                    text: 'Your password has been updated successfully.',
                    timer: 2000,
                    showConfirmButton: false
                });
            },
            error: (err) => {
                this.isChangingPassword = false;
                const msg = err.error?.message || 'Could not change password.';
                Swal.fire('Error', msg, 'error');
            }
        });
    }
}
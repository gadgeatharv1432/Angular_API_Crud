import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response';
import { ChangePasswordDTO, GetProfileDTO, UpdateProfileDTO } from '../interfaces/profile';

@Injectable({
    providedIn: 'root'    // Singleton — one instance for the whole app
})
export class ProfileService {

    // Base URL — must match ProfileController route
    private apiUrl = 'http://localhost:5205/api/Profile';

    constructor(private http: HttpClient) { }

    // GET /api/Profile — fetch logged-in user's profile
    getProfile(): Observable<ApiResponse<GetProfileDTO>> {
        return this.http.get<ApiResponse<GetProfileDTO>>(this.apiUrl);
    }

    // PUT /api/Profile — update username
    updateProfile(dto: UpdateProfileDTO): Observable<ApiResponse<object>> {
        return this.http.put<ApiResponse<object>>(this.apiUrl, dto);
    }

    // PUT /api/Profile/change-password — change password
    changePassword(dto: ChangePasswordDTO): Observable<ApiResponse<object>> {
        return this.http.put<ApiResponse<object>>(
            `${this.apiUrl}/change-password`, dto);
    }
}
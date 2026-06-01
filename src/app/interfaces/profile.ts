export interface Profile {
}
export interface GetProfileDTO {
    id: string;
    userName: string;
    email: string;
    role: string;
}

export interface UpdateProfileDTO {
    userName: string;
}

export interface ChangePasswordDTO {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}
export interface AuthResponse {
    success: boolean;
    message: string;
    statusCode: number;
    data: {
        id: string;
        userName: string;
        email: string;
        role: string;
        token: string;
        tokenExpiry: string;
    };
}

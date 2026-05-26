import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from '../interfaces/login';
import { Observable } from 'rxjs';
import { AuthResponse } from '../interfaces/auth-response';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {
  private appurl : string = "http://localhost:5205/api/Auth";

  constructor(private http:HttpClient) { }

  login(data:Login):Observable<AuthResponse>
  {
    return this.http.post<AuthResponse>(`${this.appurl}/login`,(data));
  }
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
  }
  getToken(): string | null{
    return localStorage.getItem('token');
  }
  isLoggedIn(): boolean{
    return !!this.getToken();
  }
  getUserRole(): string | null{
    return localStorage.getItem('role');
  }
}

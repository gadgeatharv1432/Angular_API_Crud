import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from '../interfaces/login';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {
  appurl : string = "http://localhost:5205/api/Auth"
  constructor(private http:HttpClient) { }

  login(data:Login):Observable<any>
  {
    return this.http.post(`${this.appurl}\\login`,(data));
  }
}

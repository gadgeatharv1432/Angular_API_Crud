// src/app/service/taskservice.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../interfaces/task';
import { ApiResponse } from '../interfaces/api-response';

@Injectable({
    providedIn: 'root'
})
export class TaskserviceService {

    private apiUrl: string = 'http://localhost:5205/api/Employeetask';

    constructor(private http: HttpClient) { }

    // GET /api/Employeetask
    getAllTasks(): Observable<ApiResponse<Task[]>> {
        return this.http.get<ApiResponse<Task[]>>(this.apiUrl);
    }

    // GET /api/Employeetask/{id}
    getTaskById(id: string): Observable<ApiResponse<Task>> {
        return this.http.get<ApiResponse<Task>>(`${this.apiUrl}/${id}`);
    }

    // POST /api/Employeetask
    createTask(task: Task): Observable<ApiResponse<Task>> {
        return this.http.post<ApiResponse<Task>>(this.apiUrl, task);
    }

    // PUT /api/Employeetask/{id}
    updateTask(id: string, task: Task): Observable<ApiResponse<Task>> {
        return this.http.put<ApiResponse<Task>>(`${this.apiUrl}/${id}`, task);
    }

    // DELETE /api/Employeetask/{id}
    deleteTask(id: string): Observable<ApiResponse<object>> {
        return this.http.delete<ApiResponse<object>>(`${this.apiUrl}/${id}`);
    }
}
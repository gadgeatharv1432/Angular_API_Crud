// src/app/component/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Task } from '../../interfaces/task';
import { TaskserviceService } from '../../service/taskservice.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatIconModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

    tasks: Task[] = [];
    isLoading: boolean = false;

    // Computed stats
    get totalTasks()     { return this.tasks.length; }
    get completedTasks() { return this.tasks.filter(t => t.taskStatus === 'Done').length; }
    get pendingTasks()   { return this.tasks.filter(t => t.taskStatus !== 'Done').length; }
    get highPriority()   { return this.tasks.filter(t => t.taskPriority === 'High').length; }
    get inProgress()     { return this.tasks.filter(t => t.taskStatus === 'InProgress').length; }

    // Recent 5 tasks
    get recentTasks()    { return this.tasks.slice(0, 5); }

    constructor(private taskService: TaskserviceService) { }

    ngOnInit(): void {
        this.isLoading = true;
        this.taskService.getAllTasks().subscribe({
            next: (res) => {
                this.tasks = res.data;
                this.isLoading = false;
            },
            error: () => { this.isLoading = false; }
        });
    }

    getPriorityClass(priority: string): string {
        const map: Record<string, string> = {
            'High': 'chip-high',
            'Medium': 'chip-medium',
            'Low': 'chip-low'
        };
        return map[priority] || '';
    }

    getStatusClass(status: string): string {
        const map: Record<string, string> = {
            'Todo': 'chip-todo',
            'InProgress': 'chip-progress',
            'Done': 'chip-done'
        };
        return map[status] || '';
    }
}
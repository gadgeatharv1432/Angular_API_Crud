// src/app/component/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
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
        MatButtonModule,
        MatProgressSpinnerModule
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

    tasks: Task[] = [];
    isLoading: boolean = false;

    // ── Computed stats ─────────────────────────────────────────
    get totalTasks()     { return this.tasks.length; }
    get completedTasks() { return this.tasks.filter(t => t.taskStatus === 'Done').length; }
    get pendingTasks()   { return this.tasks.filter(t => t.taskStatus === 'Todo').length; }
    get inProgress()     { return this.tasks.filter(t => t.taskStatus === 'InProgress').length; }

    // ── Priority percentages for donut chart ──────────────────
    get highCount()    { return this.tasks.filter(t => t.taskPriority === 'High').length; }
    get mediumCount()  { return this.tasks.filter(t => t.taskPriority === 'Medium').length; }
    get lowCount()     { return this.tasks.filter(t => t.taskPriority === 'Low').length; }

    get highPercent()   { return this.totalTasks ? Math.round((this.highCount / this.totalTasks) * 100) : 0; }
    get mediumPercent() { return this.totalTasks ? Math.round((this.mediumCount / this.totalTasks) * 100) : 0; }
    get lowPercent()    { return this.totalTasks ? Math.round((this.lowCount / this.totalTasks) * 100) : 0; }

    // ── Bar chart data ────────────────────────────────────────
    // WHY: We compute bar heights as percentages relative to the max count
    // so the tallest bar fills 100% height.
    get statusBars() {
        const todo       = this.tasks.filter(t => t.taskStatus === 'Todo').length;
        const inProgress = this.tasks.filter(t => t.taskStatus === 'InProgress').length;
        const review     = this.tasks.filter(t => t.taskStatus === 'Review').length;
        const done       = this.tasks.filter(t => t.taskStatus === 'Done').length;
        const maxVal     = Math.max(todo, inProgress, review, done, 1);

        return [
            { label: 'To Do',       count: todo,       percent: (todo / maxVal) * 100,       color: '#d1d5db' },
            { label: 'In Progress', count: inProgress, percent: (inProgress / maxVal) * 100, color: '#f59e0b' },
            { label: 'Review',      count: review,     percent: (review / maxVal) * 100,     color: '#a78bfa' },
            { label: 'Done',        count: done,       percent: (done / maxVal) * 100,       color: '#22c55e' },
        ];
    }

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
}
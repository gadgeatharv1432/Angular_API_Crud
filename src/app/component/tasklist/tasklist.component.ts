// src/app/component/tasklist/tasklist.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { Task } from '../../interfaces/task';
import { TaskserviceService } from '../../service/taskservice.service';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';

@Component({
    selector: 'app-tasklist',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        MatChipsModule,
        MatTooltipModule,
        MatProgressSpinnerModule,
        MatInputModule,
        MatFormFieldModule
    ],
    templateUrl: './tasklist.component.html',
    styleUrl: './tasklist.component.css'
})
export class TasklistComponent implements OnInit {

    // All tasks from the API
    allTasks: Task[] = [];

    // Filtered list shown in the table
    filteredTasks: Task[] = [];

    // Search text bound to the search box
    searchText: string = '';

    // Table column names
    displayedColumns: string[] = [
        'taskName', 'taskPriority', 'taskStatus',
        'assignee', 'dueDate', 'actions'
    ];

    isLoading: boolean = false;

    constructor(
        private taskService: TaskserviceService,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.loadTasks();
    }

    // ── Load all tasks from backend ──────────────────────────
    loadTasks(): void {
        this.isLoading = true;

        this.taskService.getAllTasks().subscribe({
            next: (res) => {
                this.isLoading = false;
                this.allTasks = res.data;
                this.filteredTasks = res.data;
            },
            error: () => {
                this.isLoading = false;
                Swal.fire('Error', 'Could not load tasks.', 'error');
            }
        });
    }

    // ── Filter table as user types in search box ─────────────
    applySearch(): void {
        const term = this.searchText.toLowerCase().trim();
        if (!term) {
            this.filteredTasks = this.allTasks;
            return;
        }
        this.filteredTasks = this.allTasks.filter(t =>
            t.taskName.toLowerCase().includes(term) ||
            t.assignee.toLowerCase().includes(term) ||
            t.taskStatus.toLowerCase().includes(term) ||
            t.taskPriority.toLowerCase().includes(term)
        );
    }

    // ── Open dialog for Add Task ──────────────────────────────
    openAddDialog(): void {
        const dialogRef = this.dialog.open(TaskDialogComponent, {
            data: { task: null }  // null = add mode
        });

        dialogRef.afterClosed().subscribe((result: Task | null) => {
            if (result) {
                this.taskService.createTask(result).subscribe({
                    next: () => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Task Added!',
                            timer: 1500,
                            showConfirmButton: false
                        });
                        this.loadTasks();  // Refresh the table
                    },
                    error: () => Swal.fire('Error', 'Could not create task.', 'error')
                });
            }
        });
    }

    // ── Open dialog for Edit Task ─────────────────────────────
    openEditDialog(task: Task): void {
        const dialogRef = this.dialog.open(TaskDialogComponent, {
            data: { task: { ...task } }  // Pass a copy so cancel works
        });

        dialogRef.afterClosed().subscribe((result: Task | null) => {
            if (result && result.id) {
                this.taskService.updateTask(result.id, result).subscribe({
                    next: () => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Task Updated!',
                            timer: 1500,
                            showConfirmButton: false
                        });
                        this.loadTasks();
                    },
                    error: () => Swal.fire('Error', 'Could not update task.', 'error')
                });
            }
        });
    }

    // ── Delete task with confirmation ─────────────────────────
    deleteTask(task: Task): void {
        Swal.fire({
            title: 'Delete Task?',
            text: `"${task.taskName}" will be permanently deleted.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it'
        }).then((result) => {
            if (result.isConfirmed && task.id) {
                this.taskService.deleteTask(task.id).subscribe({
                    next: () => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Deleted!',
                            timer: 1200,
                            showConfirmButton: false
                        });
                        this.loadTasks();
                    },
                    error: () => Swal.fire('Error', 'Could not delete task.', 'error')
                });
            }
        });
    }

    // ── Helper: returns CSS class for priority chip ───────────
    getPriorityClass(priority: string): string {
        const map: Record<string, string> = {
            'High': 'chip-high',
            'Medium': 'chip-medium',
            'Low': 'chip-low'
        };
        return map[priority] || '';
    }

    // ── Helper: returns CSS class for status chip ─────────────
    getStatusClass(status: string): string {
        const map: Record<string, string> = {
            'Todo': 'chip-todo',
            'InProgress': 'chip-progress',
            'Done': 'chip-done'
        };
        return map[status] || '';
    }
}
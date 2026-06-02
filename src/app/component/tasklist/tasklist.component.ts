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
import { MatTabsModule } from '@angular/material/tabs';   // ← NEW: for tab filtering
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import Swal from 'sweetalert2';
import { Task } from '../../interfaces/task';
import { TaskserviceService } from '../../service/taskservice.service';
import { TaskDialogComponent } from '../../task-dialog/task-dialog/task-dialog.component';

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
    MatTabsModule,

    // Required for search bar
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './tasklist.component.html',
  styleUrl: './tasklist.component.css'
})
export class TasklistComponent implements OnInit {
    searchText: string = '';
    allTasks: Task[] = [];
    filteredTasks: Task[] = [];

    // ← NEW: tracks which tab is active (0=All, 1=Active, 2=Completed)
    activeTabIndex: number = 0;

    // UPDATED: removed 'taskStatus' — tabs replace that column
    displayedColumns: string[] = [
        'check', 'taskName', 'taskPriority', 'assignee', 'dueDate', 'actions'
    ];

    isLoading: boolean = false;

    constructor(
        private taskService: TaskserviceService,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.loadTasks();
    }

    loadTasks(): void {
        this.isLoading = true;
        this.taskService.getAllTasks().subscribe({
            next: (res) => {
                this.isLoading = false;
                this.allTasks = res.data;
                this.applyFilters();  // Apply current tab filter after load
            },
            error: () => {
                this.isLoading = false;
                Swal.fire('Error', 'Could not load tasks.', 'error');
            }
        });
    }

    // ── Tab filtering logic 
    onTabChange(index: number): void {
    this.activeTabIndex = index;
    this.applyFilters();  // Re-apply BOTH filters
    }
    applySearch(): void {
        this.applyFilters();  // Re-apply BOTH filters
    }

    // THE CORE METHOD — chains tab filter then search filter
    applyFilters(): void {
        // STAGE 1: Apply tab filter to the original source of truth
        // WHY use allTasks here (not filteredTasks)?
        // If we filtered filteredTasks, each search would narrow the list
        // further and further — you'd never see items back.
        // Always filter from the ORIGINAL complete list.
        let result = this.getTabFiltered();

        // STAGE 2: Apply search text filter on top of Stage 1 result
        const term = this.searchText?.toLowerCase().trim();
        if (term) {
            result = result.filter(t =>
                t.taskName.toLowerCase().includes(term)      ||
                t.assignee.toLowerCase().includes(term)      ||
                t.taskStatus.toLowerCase().includes(term)    ||
                t.taskPriority.toLowerCase().includes(term)  ||
                t.taskDescription?.toLowerCase().includes(term)
            );
        }

        this.filteredTasks = result;
    }

    private getTabFiltered(): Task[] {
        switch (this.activeTabIndex) {
            case 0: return [...this.allTasks];
            case 1: return this.allTasks.filter(t => t.taskStatus !== 'Done');
            case 2: return this.allTasks.filter(t => t.taskStatus === 'Done');
            default: return [...this.allTasks];
        }
    }
    // ── Toggle task complete (circle checkbox click) ──────────
    // WHY: PDF shows circle checkboxes. Clicking marks task done.
    toggleComplete(task: Task): void {
        if (!task.id) return;
        const updated: Task = {
            ...task,
            taskStatus: task.taskStatus === 'Done' ? 'InProgress' : 'Done',
            isCompleted: task.taskStatus !== 'Done'
        };
        this.taskService.updateTask(task.id, updated).subscribe({
            next: () => this.loadTasks(),
            error: () => Swal.fire('Error', 'Could not update task.', 'error')
        });
    }

    // ── Add/Edit dialogs ──────────────────────────────────────
    openAddDialog(): void {
        const dialogRef = this.dialog.open(TaskDialogComponent, {
            data: { task: null },
            width: '600px'
        });
        dialogRef.afterClosed().subscribe((result: Task | null) => {
            if (result) {
                this.taskService.createTask(result).subscribe({
                    next: () => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Task saved successfully.',
                            timer: 1500,
                            showConfirmButton: false,
                            toast: true,
                            position: 'bottom'
                        });
                        this.loadTasks();
                    },
                    error: () => Swal.fire('Error', 'Could not create task.', 'error')
                });
            }
        });
    }

    openEditDialog(task: Task): void {
        const dialogRef = this.dialog.open(TaskDialogComponent, {
            data: { task: { ...task } },
            width: '600px'
        });
        dialogRef.afterClosed().subscribe((result: Task | null) => {
            if (result && result.id) {
                this.taskService.updateTask(result.id, result).subscribe({
                    next: () => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Task updated successfully.',
                            timer: 1500,
                            showConfirmButton: false,
                            toast: true,
                            position: 'bottom'
                        });
                        this.loadTasks();
                    },
                    error: () => Swal.fire('Error', 'Could not update task.', 'error')
                });
            }
        });
    }

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

    // ── Helper methods ────────────────────────────────────────

    // WHY: Gets initials for the avatar circle (e.g., "Sarah Johnson" → "SJ")
    getInitials(name: string): string {
        if (!name) return '?';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
        return name.substring(0, 2).toUpperCase();
    }

    // WHY: Shows red date for overdue tasks
    isOverdue(dueDate: string | undefined): boolean {
        if (!dueDate) return false;
        return new Date(dueDate) < new Date();
    }

    getPriorityClass(priority: string): string {
        const map: Record<string, string> = {
            'High': 'chip-high',
            'Medium': 'chip-medium',
            'Low': 'chip-low',
            'Critical': 'chip-critical'
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
// src/app/task-dialog/task-dialog/task-dialog.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Task } from '../../interfaces/task';
import { CommonModule as NgCommonModule } from '@angular/common';

@Component({
    selector: 'app-task-dialog',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule
    ],
    templateUrl: './task-dialog.component.html',
    styleUrl: './task-dialog.component.css'
})
export class TaskDialogComponent implements OnInit {

    taskObj: Task = {
        taskName: '',
        taskDescription: '',
        taskPriority: 'High',       // Default: High (matches PDF dropdown default)
        taskStatus: 'Todo',
        assignee: '',
        dueDate: '',
        isCompleted: false
    };

    isEditMode: boolean = false;

    // ← CHANGED: "Create New Task" matches PDF exactly
    dialogTitle: string = 'Create New Task';

    // ← ADDED: Critical option to match PDF's "Critical" chip
    priorityOptions = ['Low', 'Medium', 'High', 'Critical'];
    statusOptions   = ['Todo', 'InProgress', 'Done'];

    constructor(
        public dialogRef: MatDialogRef<TaskDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { task: Task | null }
    ) { }

    ngOnInit(): void {
        if (this.data?.task) {
            this.isEditMode = true;
            // ← CHANGED: "Edit Task" for edit mode
            this.dialogTitle = 'Edit Task';
            this.taskObj = { ...this.data.task };
        }
    }

    save(): void {
        this.dialogRef.close(this.taskObj);
    }

    cancel(): void {
        this.dialogRef.close(null);
    }
}
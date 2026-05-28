// src/app/component/task-dialog/task-dialog.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { Task } from '../../interfaces/task';

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
        MatDatepickerModule,
        MatNativeDateModule,
        MatIconModule
    ],
    templateUrl: './task-dialog.component.html',
    styleUrl: './task-dialog.component.css'
})
export class TaskDialogComponent implements OnInit {

    // The task object we will bind the form to
    taskObj: Task = {
        taskName: '',
        taskDescription: '',
        taskPriority: 'Medium',
        taskStatus: 'Todo',
        assignee: '',
        dueDate: '',
        isCompleted: false
    };

    isEditMode: boolean = false;
    dialogTitle: string = 'Add New Task';

    priorityOptions = ['Low', 'Medium', 'High'];
    statusOptions = ['Todo', 'InProgress', 'Done'];

    constructor(
        public dialogRef: MatDialogRef<TaskDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { task: Task | null }
    ) { }

    ngOnInit(): void {
        // If a task was passed in → Edit mode
        if (this.data && this.data.task) {
            this.isEditMode = true;
            this.dialogTitle = 'Edit Task';
            // Copy the task data into our form object
            this.taskObj = { ...this.data.task };
        }
    }

    save(): void {
        // Send form data back to the caller
        this.dialogRef.close(this.taskObj);
    }

    cancel(): void {
        this.dialogRef.close(null);
    }
}
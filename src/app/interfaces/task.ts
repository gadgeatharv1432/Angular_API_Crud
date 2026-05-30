export interface Task {
    id?: string;
    taskName: string;
    taskDescription: string;
    taskPriority: string;
    taskStatus: string;
    assignee: string;
    dueDate: string;
    isCompleted: boolean;
}

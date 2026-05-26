export interface Task {
    id?: string;
    taskName: string;
    taskDescription: string;
    taskPriority: string;
    taskStatus: string;
    assignee: string;
    duedate: string;
    isCompleted: boolean;
}

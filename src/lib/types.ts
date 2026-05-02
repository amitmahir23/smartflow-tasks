export type TaskStatus = "todo" | "in-progress" | "done";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignee?: string;
  deadline?: string;
  projectId: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export const COLUMN_CONFIG: Record<TaskStatus, { label: string; colorClass: string }> = {
  "todo": { label: "To Do", colorClass: "bg-column-todo" },
  "in-progress": { label: "In Progress", colorClass: "bg-column-progress" },
  "done": { label: "Done", colorClass: "bg-column-done" },
};

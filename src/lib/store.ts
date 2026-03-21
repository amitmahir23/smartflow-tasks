import { Task, Project, User, TaskStatus } from "./types";

const STORAGE_KEYS = {
  user: "tm_user",
  projects: "tm_projects",
  tasks: "tm_tasks",
};

function generateId() {
  return crypto.randomUUID();
}

// User
export function getUser(): User | null {
  const raw = localStorage.getItem(STORAGE_KEYS.user);
  return raw ? JSON.parse(raw) : null;
}

export function loginUser(name: string, email: string): User {
  const user: User = { id: generateId(), name, email };
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
  return user;
}

export function logoutUser() {
  localStorage.removeItem(STORAGE_KEYS.user);
}

// Projects
export function getProjects(): Project[] {
  const raw = localStorage.getItem(STORAGE_KEYS.projects);
  return raw ? JSON.parse(raw) : [];
}

export function createProject(name: string, description?: string): Project {
  const projects = getProjects();
  const project: Project = { id: generateId(), name, description, createdAt: new Date().toISOString() };
  projects.push(project);
  localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(projects));
  return project;
}

export function deleteProject(id: string) {
  const projects = getProjects().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(projects));
  const tasks = getTasks().filter((t) => t.projectId !== id);
  localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks));
}

// Tasks
export function getTasks(): Task[] {
  const raw = localStorage.getItem(STORAGE_KEYS.tasks);
  return raw ? JSON.parse(raw) : [];
}

export function getTasksByProject(projectId: string): Task[] {
  return getTasks().filter((t) => t.projectId === projectId);
}

export function createTask(data: Omit<Task, "id" | "createdAt">): Task {
  const tasks = getTasks();
  const task: Task = { ...data, id: generateId(), createdAt: new Date().toISOString() };
  tasks.push(task);
  localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks));
  return task;
}

export function updateTaskStatus(taskId: string, status: TaskStatus) {
  const tasks = getTasks().map((t) => (t.id === taskId ? { ...t, status } : t));
  localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks));
}

export function deleteTask(taskId: string) {
  const tasks = getTasks().filter((t) => t.id !== taskId);
  localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks));
}

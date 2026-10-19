export type Priority = 'urgent' | 'high' | 'medium' | 'low';

export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  completedAt?: string; // ISO date string
  dueDate?: string;     // YYYY-MM-DD
  dueTime?: string;     // HH:mm
  priority: Priority;
  projectId?: string;
  tags: string[];
  repeat: RecurrenceType;
  subtasks: Subtask[];
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  description?: string;
  createdAt: string;
}

export interface CompletionRecord {
  id: string;
  taskId: string;
  taskTitle: string;
  completedAt: string; // ISO string
  date: string;        // YYYY-MM-DD
  projectId?: string;
}

export type ViewType =
  | 'inbox'
  | 'today'
  | 'upcoming'
  | 'all'
  | 'completed'
  | 'dashboard'
  | 'project';

export interface FilterOptions {
  search: string;
  priority: Priority | 'all';
  projectId: string; // 'all' or id
  tag: string;       // 'all' or tag string
  status: 'all' | 'active' | 'completed';
}

export type SortBy = 'dueDate' | 'priority' | 'createdAt' | 'alphabetical';
export type SortDirection = 'asc' | 'desc';

export interface UserPreferences {
  theme: 'dark' | 'light';
  sidebarCollapsed: boolean;
  rightPanelCollapsed: boolean;
  soundEffects: boolean;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  action?: {
    label: string;
    onClick: () => void;
  };
}

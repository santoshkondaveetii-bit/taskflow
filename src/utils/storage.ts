import { Task, Project, CompletionRecord, UserPreferences } from '../types';
import { getTodayString } from './date';

const STORAGE_KEYS = {
  TASKS: 'taskflow_tasks_v2',
  PROJECTS: 'taskflow_projects_v2',
  HISTORY: 'taskflow_history_v2',
  PREFERENCES: 'taskflow_preferences_v2',
  MIGRATION_CLEARED: 'taskflow_clean_slate_applied_v2',
};

// Clean fresh workspace: zero default seed projects or tasks
export const DEFAULT_PROJECTS: Project[] = [];

export function getInitialSeedTasks(): Task[] {
  return [];
}

export function getInitialSeedHistory(): CompletionRecord[] {
  return [];
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'dark',
  sidebarCollapsed: false,
  rightPanelCollapsed: false,
  soundEffects: true,
};

// Automatic one-time cleanup of previous mock/seed data from localStorage
function ensureCleanSlate() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (!localStorage.getItem(STORAGE_KEYS.MIGRATION_CLEARED)) {
        // Clear old v1 keys that had sample tasks
        localStorage.removeItem('taskflow_tasks_v1');
        localStorage.removeItem('taskflow_projects_v1');
        localStorage.removeItem('taskflow_history_v1');
        localStorage.removeItem('taskflow_preferences_v1');

        // Initialize fresh empty arrays in v2
        localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify([]));
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify([]));
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify([]));
        localStorage.setItem(STORAGE_KEYS.MIGRATION_CLEARED, 'true');
      }
    }
  } catch (err) {
    // Ignore in non-browser environment
  }
}

ensureCleanSlate();

export const Storage = {
  getTasks(): Task[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (!data) {
        this.saveTasks([]);
        return [];
      }
      return JSON.parse(data);
    } catch (err) {
      console.error('Error reading tasks from localStorage:', err);
      return [];
    }
  },

  saveTasks(tasks: Task[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (err) {
      console.error('Error saving tasks to localStorage:', err);
    }
  },

  getProjects(): Project[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (!data) {
        this.saveProjects([]);
        return [];
      }
      return JSON.parse(data);
    } catch (err) {
      console.error('Error reading projects from localStorage:', err);
      return [];
    }
  },

  saveProjects(projects: Project[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch (err) {
      console.error('Error saving projects to localStorage:', err);
    }
  },

  getHistory(): CompletionRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (!data) {
        this.saveHistory([]);
        return [];
      }
      return JSON.parse(data);
    } catch (err) {
      console.error('Error reading completion history from localStorage:', err);
      return [];
    }
  },

  saveHistory(history: CompletionRecord[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    } catch (err) {
      console.error('Error saving history to localStorage:', err);
    }
  },

  getPreferences(): UserPreferences {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      if (!data) {
        return DEFAULT_PREFERENCES;
      }
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(data) };
    } catch (err) {
      console.error('Error reading preferences from localStorage:', err);
      return DEFAULT_PREFERENCES;
    }
  },

  savePreferences(prefs: UserPreferences): void {
    try {
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
    } catch (err) {
      console.error('Error saving preferences to localStorage:', err);
    }
  },

  exportBackup(): void {
    const backupData = {
      app: 'TASKFLOW',
      version: '2.0.0',
      exportedAt: new Date().toISOString(),
      tasks: this.getTasks(),
      projects: this.getProjects(),
      history: this.getHistory(),
      preferences: this.getPreferences(),
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `taskflow-backup-${getTodayString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  importBackup(jsonString: string): { success: boolean; message: string; count?: number } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || !Array.isArray(parsed.tasks)) {
        return { success: false, message: 'Invalid Taskflow backup file format: missing tasks array.' };
      }

      this.saveTasks(parsed.tasks);
      if (Array.isArray(parsed.projects)) {
        this.saveProjects(parsed.projects);
      }
      if (Array.isArray(parsed.history)) {
        this.saveHistory(parsed.history);
      }
      if (parsed.preferences) {
        this.savePreferences(parsed.preferences);
      }

      return {
        success: true,
        message: `Successfully imported ${parsed.tasks.length} tasks and ${parsed.projects?.length || 0} projects!`,
        count: parsed.tasks.length,
      };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Failed to parse JSON backup file.' };
    }
  },

  resetAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
    localStorage.removeItem(STORAGE_KEYS.PREFERENCES);
    localStorage.removeItem('taskflow_tasks_v1');
    localStorage.removeItem('taskflow_projects_v1');
    localStorage.removeItem('taskflow_history_v1');
    this.saveTasks([]);
    this.saveProjects([]);
    this.saveHistory([]);
  },
};

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Task,
  Project,
  CompletionRecord,
  UserPreferences,
  ViewType,
  FilterOptions,
  SortBy,
  SortDirection,
  ToastMessage,
} from './types';
import { Storage } from './utils/storage';
import { getTodayString, isToday, isOverdue, formatDateReadable } from './utils/date';
import { getTodayStats, calculateStreaks } from './utils/analytics';
import { createNextRecurringTask } from './utils/recurrence';
import { triggerTaskConfetti, triggerGoalCelebration } from './utils/confetti';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { RightPanel } from './components/RightPanel';
import { TaskCard } from './components/TaskCard';
import { QuickAddTask } from './components/QuickAddTask';
import { FilterBar } from './components/FilterBar';
import { EmptyState } from './components/EmptyState';
import { TaskModal } from './components/TaskModal';
import { ProjectModal } from './components/ProjectModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { SettingsModal } from './components/SettingsModal';
import { DashboardView } from './components/DashboardView';
import { ToastContainer } from './components/Toast';
import { MobileNavigation } from './components/MobileNavigation';

import { CheckCircle2, AlertTriangle, Calendar, Layers } from 'lucide-react';
import './App.css';

export function App() {
  // Persistence state
  const [tasks, setTasks] = useState<Task[]>(() => Storage.getTasks());
  const [projects, setProjects] = useState<Project[]>(() => Storage.getProjects());
  const [history, setHistory] = useState<CompletionRecord[]>(() => Storage.getHistory());
  const [preferences, setPreferences] = useState<UserPreferences>(() => Storage.getPreferences());

  // View state
  const [currentView, setCurrentView] = useState<ViewType>('today');
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(undefined);

  // Filters & Sorting
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    priority: 'all',
    projectId: 'all',
    tag: 'all',
    status: 'all',
  });
  const [sortBy, setSortBy] = useState<SortBy>('dueDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Modals
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Apply dark mode class to root document element
  useEffect(() => {
    if (preferences.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [preferences.theme]);

  // Sync state to LocalStorage
  useEffect(() => {
    Storage.saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    Storage.saveProjects(projects);
  }, [projects]);

  useEffect(() => {
    Storage.saveHistory(history);
  }, [history]);

  useEffect(() => {
    Storage.savePreferences(preferences);
  }, [preferences]);

  // Toast trigger helper
  const showToast = useCallback(
    (message: string, type: ToastMessage['type'] = 'info', action?: ToastMessage['action']) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      setToasts((prev) => [...prev, { id, message, type, action }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    },
    []
  );

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Keyboard shortcut listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setEditingTask(null);
        setTaskModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Task Actions
  const handleToggleTaskComplete = (task: Task) => {
    const isNowCompleted = !task.completed;
    const nowIso = new Date().toISOString();
    const today = getTodayString();

    const updatedTask: Task = {
      ...task,
      completed: isNowCompleted,
      completedAt: isNowCompleted ? nowIso : undefined,
      updatedAt: nowIso,
    };

    let updatedTasks = tasks.map((t) => (t.id === task.id ? updatedTask : t));

    if (isNowCompleted) {
      // Record completion history record
      const record: CompletionRecord = {
        id: `hist_${Date.now()}`,
        taskId: task.id,
        taskTitle: task.title,
        completedAt: nowIso,
        date: today,
        projectId: task.projectId,
      };
      setHistory((prev) => [record, ...prev]);

      // Trigger Confetti micro-interaction
      if (preferences.soundEffects) {
        triggerTaskConfetti();
      }

      // Handle recurrence if configured
      if (task.repeat && task.repeat !== 'none') {
        const nextOccurrence = createNextRecurringTask(task);
        if (nextOccurrence) {
          updatedTasks = [nextOccurrence, ...updatedTasks];
        }
      }

      // Check if all today's tasks are now done for celebratory burst!
      const currentStats = getTodayStats(updatedTasks, history);
      if (currentStats.remainingToday === 0 && currentStats.totalToday > 0) {
        triggerGoalCelebration();
      }

      showToast(`Completed: "${task.title}"`, 'success', {
        label: 'Undo',
        onClick: () => handleUndoComplete(task),
      });
    } else {
      // Reopening task: remove from today's history log
      setHistory((prev) => prev.filter((h) => !(h.taskId === task.id && h.date === today)));
      showToast(`Reopened: "${task.title}"`, 'info');
    }

    setTasks(updatedTasks);
  };

  const handleUndoComplete = (originalTask: Task) => {
    const nowIso = new Date().toISOString();
    const today = getTodayString();

    setTasks((prev) =>
      prev.map((t) =>
        t.id === originalTask.id
          ? { ...t, completed: false, completedAt: undefined, updatedAt: nowIso }
          : t
      )
    );
    setHistory((prev) => prev.filter((h) => !(h.taskId === originalTask.id && h.date === today)));
    showToast(`Restored: "${originalTask.title}"`, 'info');
  };

  const handleToggleSubtask = (task: Task, subtaskId: string) => {
    const updatedSubtasks = (task.subtasks || []).map((sub) =>
      sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
    );
    const updatedTask: Task = {
      ...task,
      subtasks: updatedSubtasks,
      updatedAt: new Date().toISOString(),
    };
    setTasks((prev) => prev.map((t) => (t.id === task.id ? updatedTask : t)));
  };

  const handleSaveTask = (
    taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'completed' | 'completedAt'> & { id?: string }
  ) => {
    const nowIso = new Date().toISOString();

    if (taskData.id) {
      // Edit existing
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskData.id
            ? {
                ...t,
                ...taskData,
                updatedAt: nowIso,
              }
            : t
        )
      );
      showToast(`Updated task: "${taskData.title}"`, 'success');
    } else {
      // Create new
      const newTask: Task = {
        ...taskData,
        id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        completed: false,
        createdAt: nowIso,
        updatedAt: nowIso,
      };
      setTasks((prev) => [newTask, ...prev]);
      showToast(`Created task: "${taskData.title}"`, 'success');
    }
  };

  const handleDuplicateTask = (task: Task) => {
    const nowIso = new Date().toISOString();
    const cloned: Task = {
      ...task,
      id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: `${task.title} (Copy)`,
      completed: false,
      completedAt: undefined,
      subtasks: (task.subtasks || []).map((s) => ({
        ...s,
        id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        completed: false,
      })),
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    setTasks((prev) => [cloned, ...prev]);
    showToast(`Duplicated: "${task.title}"`, 'info');
  };

  const handleDeleteTask = (task: Task) => {
    setDeleteConfirm({
      isOpen: true,
      title: 'Delete Task',
      message: `Are you sure you want to permanently delete "${task.title}"? This cannot be undone once deleted.`,
      onConfirm: () => {
        setTasks((prev) => prev.filter((t) => t.id !== task.id));
        setDeleteConfirm((prev) => ({ ...prev, isOpen: false }));
        showToast(`Deleted task: "${task.title}"`, 'info', {
          label: 'Undo',
          onClick: () => {
            setTasks((prev) => [task, ...prev]);
            showToast(`Restored task: "${task.title}"`, 'success');
          },
        });
      },
    });
  };

  // Project Actions
  const handleSaveProject = (projectData: { id?: string; name: string; color: string; description?: string }) => {
    const nowIso = new Date().toISOString();
    if (projectData.id) {
      setProjects((prev) =>
        prev.map((p) => (p.id === projectData.id ? { ...p, ...projectData } : p))
      );
      showToast(`Project updated: "${projectData.name}"`, 'success');
    } else {
      const newProj: Project = {
        ...projectData,
        id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        createdAt: nowIso,
      };
      setProjects((prev) => [...prev, newProj]);
      showToast(`Project created: "${projectData.name}"`, 'success');
    }
  };

  const handleDeleteProject = (project: Project) => {
    const taskCount = tasks.filter((t) => t.projectId === project.id).length;
    setDeleteConfirm({
      isOpen: true,
      title: 'Delete Project',
      message: `Delete project "${project.name}"? ${
        taskCount > 0
          ? `${taskCount} task(s) in this project will be safely moved to your Inbox.`
          : 'This project has no tasks.'
      }`,
      onConfirm: () => {
        setProjects((prev) => prev.filter((p) => p.id !== project.id));
        // Reassign tasks to inbox
        setTasks((prev) =>
          prev.map((t) => (t.projectId === project.id ? { ...t, projectId: undefined } : t))
        );
        if (selectedProjectId === project.id) {
          setCurrentView('inbox');
          setSelectedProjectId(undefined);
        }
        setDeleteConfirm((prev) => ({ ...prev, isOpen: false }));
        showToast(`Project deleted: "${project.name}"`, 'info');
      },
    });
  };

  // Backup & Import
  const handleExportBackup = () => {
    Storage.exportBackup();
    showToast('Taskflow backup exported successfully!', 'success');
  };

  const handleImportBackup = (jsonString: string) => {
    const result = Storage.importBackup(jsonString);
    if (result.success) {
      setTasks(Storage.getTasks());
      setProjects(Storage.getProjects());
      setHistory(Storage.getHistory());
      setPreferences(Storage.getPreferences());
      showToast(result.message, 'success');
    } else {
      showToast(result.message, 'error');
    }
    return result;
  };

  const handleResetData = () => {
    Storage.resetAllData();
    const freshTasks = Storage.getTasks();
    const freshProjects = Storage.getProjects();
    const freshHistory = Storage.getHistory();
    setTasks(freshTasks);
    setProjects(freshProjects);
    setHistory(freshHistory);
    showToast('All tasks and projects have been reset to defaults.', 'info');
  };

  // View Navigation
  const handleSelectView = (view: ViewType, projectId?: string) => {
    setCurrentView(view);
    setSelectedProjectId(projectId);
    setFilters((prev) => ({
      ...prev,
      projectId: projectId || (view === 'inbox' ? 'all' : prev.projectId),
      search: '',
    }));
  };

  // Derived counts for sidebar
  const todayStr = getTodayString();

  const inboxCount = useMemo(
    () => tasks.filter((t) => !t.completed && !t.dueDate && !t.projectId).length,
    [tasks]
  );

  const todayTasksList = useMemo(
    () => tasks.filter((t) => !t.completed && t.dueDate && (t.dueDate === todayStr || t.dueDate < todayStr)),
    [tasks, todayStr]
  );
  const todayCount = todayTasksList.length;

  const overdueCount = useMemo(
    () => tasks.filter((t) => !t.completed && t.dueDate && t.dueDate < todayStr).length,
    [tasks, todayStr]
  );

  const upcomingCount = useMemo(
    () => tasks.filter((t) => !t.completed && t.dueDate && t.dueDate > todayStr).length,
    [tasks, todayStr]
  );

  const allCount = useMemo(() => tasks.filter((t) => !t.completed).length, [tasks]);
  const completedCount = useMemo(() => tasks.filter((t) => t.completed).length, [tasks]);

  // Available tags across all tasks
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    tasks.forEach((t) => {
      (t.tags || []).forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [tasks]);

  // Selected project object
  const currentProject = useMemo(
    () => (selectedProjectId ? projects.find((p) => p.id === selectedProjectId) : undefined),
    [projects, selectedProjectId]
  );

  // Statistics & Streak
  const todayStats = useMemo(() => getTodayStats(tasks, history), [tasks, history]);
  const { currentStreak } = useMemo(() => calculateStreaks(history), [history]);

  // Upcoming deadlines for Right Panel
  const upcomingDeadlines = useMemo(() => {
    return tasks
      .filter((t) => !t.completed && t.dueDate)
      .sort((a, b) => (a.dueDate! > b.dueDate! ? 1 : -1));
  }, [tasks]);

  // Task filtering & sorting for current view
  const viewFilteredTasks = useMemo(() => {
    let list: Task[] = [];

    switch (currentView) {
      case 'inbox':
        list = tasks.filter((t) => !t.dueDate && !t.projectId);
        break;
      case 'today':
        list = tasks.filter((t) => t.dueDate && (t.dueDate === todayStr || t.dueDate < todayStr));
        break;
      case 'upcoming':
        list = tasks.filter((t) => t.dueDate && t.dueDate > todayStr);
        break;
      case 'all':
        list = [...tasks];
        break;
      case 'completed':
        list = tasks.filter((t) => t.completed);
        break;
      case 'project':
        list = tasks.filter((t) => t.projectId === selectedProjectId);
        break;
      case 'dashboard':
        return [];
      default:
        list = [...tasks];
    }

    // Apply User Filters
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q)) ||
          (t.tags && t.tags.some((tag) => tag.toLowerCase().includes(q)))
      );
    }

    if (filters.priority !== 'all') {
      list = list.filter((t) => t.priority === filters.priority);
    }

    if (filters.projectId !== 'all' && currentView !== 'project') {
      list = list.filter((t) => t.projectId === filters.projectId);
    }

    if (filters.tag !== 'all') {
      list = list.filter((t) => (t.tags || []).includes(filters.tag));
    }

    if (filters.status === 'active') {
      list = list.filter((t) => !t.completed);
    } else if (filters.status === 'completed') {
      list = list.filter((t) => t.completed);
    } else if (currentView !== 'completed' && filters.status === 'all') {
      // By default in task views, prioritize active tasks first
    }

    // Apply Sorting
    list.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'dueDate': {
          const dateA = a.dueDate || '9999-99-99';
          const dateB = b.dueDate || '9999-99-99';
          comparison = dateA.localeCompare(dateB);
          break;
        }
        case 'priority': {
          const priorityWeight = { urgent: 4, high: 3, medium: 2, low: 1 };
          comparison = priorityWeight[b.priority] - priorityWeight[a.priority];
          break;
        }
        case 'createdAt':
          comparison = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          break;
        case 'alphabetical':
          comparison = a.title.localeCompare(b.title);
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return list;
  }, [tasks, currentView, selectedProjectId, filters, sortBy, sortDirection, todayStr]);

  // Categorize tasks for Today view (Overdue vs Today)
  const overdueTasks = useMemo(
    () => viewFilteredTasks.filter((t) => !t.completed && isOverdue(t.dueDate, t.completed)),
    [viewFilteredTasks]
  );
  const dueTodayTasks = useMemo(
    () => viewFilteredTasks.filter((t) => !t.completed && isToday(t.dueDate)),
    [viewFilteredTasks]
  );
  const otherOrCompletedTasks = useMemo(
    () => viewFilteredTasks.filter((t) => t.completed || (!isOverdue(t.dueDate, t.completed) && !isToday(t.dueDate))),
    [viewFilteredTasks]
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 dark:bg-[#0c0e14] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Left Sidebar */}
      <Sidebar
        currentView={currentView}
        selectedProjectId={selectedProjectId}
        projects={projects}
        inboxCount={inboxCount}
        todayCount={todayCount}
        overdueCount={overdueCount}
        upcomingCount={upcomingCount}
        allCount={allCount}
        completedCount={completedCount}
        isDark={preferences.theme === 'dark'}
        isOpenMobile={mobileSidebarOpen}
        onSelectView={handleSelectView}
        onOpenCreateTask={() => {
          setEditingTask(null);
          setTaskModalOpen(true);
        }}
        onOpenCreateProject={() => {
          setEditingProject(null);
          setProjectModalOpen(true);
        }}
        onEditProject={(proj) => {
          setEditingProject(proj);
          setProjectModalOpen(true);
        }}
        onDeleteProject={handleDeleteProject}
        onToggleTheme={() =>
          setPreferences((prev) => ({
            ...prev,
            theme: prev.theme === 'dark' ? 'light' : 'dark',
          }))
        }
        onOpenSettings={() => setSettingsModalOpen(true)}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Sticky App Header */}
        <Header
          currentView={currentView}
          selectedProject={currentProject}
          isDark={preferences.theme === 'dark'}
          rightPanelCollapsed={preferences.rightPanelCollapsed}
          onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          onToggleTheme={() =>
            setPreferences((prev) => ({
              ...prev,
              theme: prev.theme === 'dark' ? 'light' : 'dark',
            }))
          }
          onToggleRightPanel={() =>
            setPreferences((prev) => ({
              ...prev,
              rightPanelCollapsed: !prev.rightPanelCollapsed,
            }))
          }
          onOpenCreateTask={() => {
            setEditingTask(null);
            setTaskModalOpen(true);
          }}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-5 md:py-6">
          {currentView === 'dashboard' ? (
            <DashboardView
              tasks={tasks}
              projects={projects}
              history={history}
              onSelectTask={(task) => {
                setEditingTask(task);
                setTaskModalOpen(true);
              }}
              onGoToView={(view) => setCurrentView(view)}
            />
          ) : (
            <div className="max-w-4xl mx-auto space-y-6 pb-24 md:pb-12">
              {/* Daily Completion Mini Progress Bar */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 backdrop-blur-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-sm shrink-0 border border-indigo-500/20">
                    {todayStats.completionRate}%
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                      <span>Daily Progress</span>
                      <span className="text-[11px] font-normal text-slate-400">
                        ({todayStats.completedToday} completed / {todayStats.totalToday} total)
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-48 sm:w-64 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 mt-1.5 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${todayStats.completionRate}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  {todayStats.remainingToday > 0 ? (
                    <span>{todayStats.remainingToday} tasks left for today</span>
                  ) : todayStats.totalToday > 0 ? (
                    <span className="text-emerald-500 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> All tasks clear!
                    </span>
                  ) : (
                    <span>No tasks due today</span>
                  )}
                </div>
              </div>

              {/* Quick Inline Add Task Field */}
              <QuickAddTask
                projects={projects}
                defaultProjectId={selectedProjectId}
                defaultDueDate={currentView === 'today' ? todayStr : undefined}
                onAddTask={({ title, dueDate, priority, projectId }) => {
                  handleSaveTask({
                    title,
                    dueDate,
                    priority,
                    projectId: projectId || selectedProjectId,
                    tags: [],
                    repeat: 'none',
                    subtasks: [],
                  });
                }}
              />

              {/* Search, Filter, and Sort Controls */}
              <FilterBar
                filters={filters}
                sortBy={sortBy}
                sortDirection={sortDirection}
                projects={projects}
                availableTags={availableTags}
                totalTasksCount={tasks.length}
                filteredTasksCount={viewFilteredTasks.length}
                onUpdateFilters={(updates) => setFilters((prev) => ({ ...prev, ...updates }))}
                onUpdateSort={(s, d) => {
                  setSortBy(s);
                  if (d) setSortDirection(d);
                }}
                onClearFilters={() =>
                  setFilters({
                    search: '',
                    priority: 'all',
                    projectId: 'all',
                    tag: 'all',
                    status: 'all',
                  })
                }
              />

              {/* Task List or Empty State */}
              {viewFilteredTasks.length === 0 ? (
                <EmptyState
                  view={currentView}
                  projectName={currentProject?.name}
                  isFiltered={
                    Boolean(filters.search) ||
                    filters.priority !== 'all' ||
                    filters.projectId !== 'all' ||
                    filters.tag !== 'all' ||
                    filters.status !== 'all'
                  }
                  onAddTask={() => {
                    setEditingTask(null);
                    setTaskModalOpen(true);
                  }}
                  onClearFilters={() =>
                    setFilters({
                      search: '',
                      priority: 'all',
                      projectId: 'all',
                      tag: 'all',
                      status: 'all',
                    })
                  }
                />
              ) : currentView === 'today' && !filters.search && filters.priority === 'all' && filters.tag === 'all' ? (
                /* Specialized Grouped Today View */
                <div className="space-y-6">
                  {/* Overdue Section */}
                  {overdueTasks.length > 0 && (
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-rose-500 uppercase tracking-wider">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Overdue Tasks ({overdueTasks.length})</span>
                      </div>
                      <div className="space-y-2">
                        {overdueTasks.map((t) => (
                          <TaskCard
                            key={t.id}
                            task={t}
                            project={projects.find((p) => p.id === t.projectId)}
                            onToggleComplete={handleToggleTaskComplete}
                            onEdit={(task) => {
                              setEditingTask(task);
                              setTaskModalOpen(true);
                            }}
                            onDuplicate={handleDuplicateTask}
                            onDelete={handleDeleteTask}
                            onToggleSubtask={handleToggleSubtask}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Due Today Section */}
                  {dueTodayTasks.length > 0 && (
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase tracking-wider">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Due Today ({dueTodayTasks.length})</span>
                      </div>
                      <div className="space-y-2">
                        {dueTodayTasks.map((t) => (
                          <TaskCard
                            key={t.id}
                            task={t}
                            project={projects.find((p) => p.id === t.projectId)}
                            onToggleComplete={handleToggleTaskComplete}
                            onEdit={(task) => {
                              setEditingTask(task);
                              setTaskModalOpen(true);
                            }}
                            onDuplicate={handleDuplicateTask}
                            onDelete={handleDeleteTask}
                            onToggleSubtask={handleToggleSubtask}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Other / Completed Section */}
                  {otherOrCompletedTasks.length > 0 && (
                    <div className="space-y-2.5 pt-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        <Layers className="w-3.5 h-3.5" />
                        <span>Completed / Other ({otherOrCompletedTasks.length})</span>
                      </div>
                      <div className="space-y-2">
                        {otherOrCompletedTasks.map((t) => (
                          <TaskCard
                            key={t.id}
                            task={t}
                            project={projects.find((p) => p.id === t.projectId)}
                            onToggleComplete={handleToggleTaskComplete}
                            onEdit={(task) => {
                              setEditingTask(task);
                              setTaskModalOpen(true);
                            }}
                            onDuplicate={handleDuplicateTask}
                            onDelete={handleDeleteTask}
                            onToggleSubtask={handleToggleSubtask}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Standard Task List */
                <div className="space-y-2.5">
                  {viewFilteredTasks.map((t) => (
                    <TaskCard
                      key={t.id}
                      task={t}
                      project={projects.find((p) => p.id === t.projectId)}
                      onToggleComplete={handleToggleTaskComplete}
                      onEdit={(task) => {
                        setEditingTask(task);
                        setTaskModalOpen(true);
                      }}
                      onDuplicate={handleDuplicateTask}
                      onDelete={handleDeleteTask}
                      onToggleSubtask={handleToggleSubtask}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Right Productivity Panel (Collapsible on Desktop) */}
      {currentView !== 'dashboard' && (
        <RightPanel
          stats={todayStats}
          streak={currentStreak}
          upcomingTasks={upcomingDeadlines}
          isCollapsed={preferences.rightPanelCollapsed}
          onToggleCollapse={() =>
            setPreferences((prev) => ({
              ...prev,
              rightPanelCollapsed: !prev.rightPanelCollapsed,
            }))
          }
          onSelectTask={(task) => {
            setEditingTask(task);
            setTaskModalOpen(true);
          }}
          onGoToDashboard={() => setCurrentView('dashboard')}
        />
      )}

      {/* Mobile Sticky Bottom Navigation */}
      <MobileNavigation
        currentView={currentView}
        todayCount={todayCount}
        inboxCount={inboxCount}
        onSelectView={(v) => {
          setCurrentView(v);
          setSelectedProjectId(undefined);
        }}
        onOpenCreateTask={() => {
          setEditingTask(null);
          setTaskModalOpen(true);
        }}
        onOpenMobileProjects={() => setMobileSidebarOpen(true)}
      />

      {/* Modals & Dialogs */}
      <TaskModal
        isOpen={taskModalOpen}
        initialTask={editingTask}
        projects={projects}
        defaultProjectId={selectedProjectId}
        defaultDueDate={currentView === 'today' ? todayStr : undefined}
        onClose={() => {
          setTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
      />

      <ProjectModal
        isOpen={projectModalOpen}
        initialProject={editingProject}
        onClose={() => {
          setProjectModalOpen(false);
          setEditingProject(null);
        }}
        onSave={handleSaveProject}
      />

      <DeleteConfirmModal
        isOpen={deleteConfirm.isOpen}
        title={deleteConfirm.title}
        message={deleteConfirm.message}
        onConfirm={deleteConfirm.onConfirm}
        onCancel={() => setDeleteConfirm((prev) => ({ ...prev, isOpen: false }))}
      />

      <SettingsModal
        isOpen={settingsModalOpen}
        preferences={preferences}
        onUpdatePreferences={(newPrefs) => setPreferences(newPrefs)}
        onExport={handleExportBackup}
        onImport={handleImportBackup}
        onResetData={handleResetData}
        onClose={() => setSettingsModalOpen(false)}
      />

      {/* Global Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;

import React, { useState } from 'react';
import { Project, ViewType } from '../types';
import {
  Inbox,
  Calendar,
  CalendarDays,
  ListOrdered,
  CheckCircle2,
  BarChart3,
  Plus,
  Folder,
  Settings,
  Moon,
  Sun,
  Flame,
  MoreHorizontal,
  Edit2,
  Trash2,
  X,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewType;
  selectedProjectId?: string;
  projects: Project[];
  inboxCount: number;
  todayCount: number;
  overdueCount: number;
  upcomingCount: number;
  allCount: number;
  completedCount: number;
  isDark: boolean;
  isOpenMobile: boolean;
  onSelectView: (view: ViewType, projectId?: string) => void;
  onOpenCreateTask: () => void;
  onOpenCreateProject: () => void;
  onEditProject: (project: Project) => void;
  onDeleteProject: (project: Project) => void;
  onToggleTheme: () => void;
  onOpenSettings: () => void;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  selectedProjectId,
  projects,
  inboxCount,
  todayCount,
  overdueCount,
  upcomingCount,
  allCount,
  completedCount,
  isDark,
  isOpenMobile,
  onSelectView,
  onOpenCreateTask,
  onOpenCreateProject,
  onEditProject,
  onDeleteProject,
  onToggleTheme,
  onOpenSettings,
  onCloseMobile,
}) => {
  const [activeProjectMenu, setActiveProjectMenu] = useState<string | null>(null);

  const navItems = [
    {
      id: 'inbox' as ViewType,
      label: 'Inbox',
      icon: Inbox,
      count: inboxCount,
      color: 'text-sky-500',
    },
    {
      id: 'today' as ViewType,
      label: 'Today',
      icon: Calendar,
      count: todayCount,
      badge: overdueCount > 0 ? `${overdueCount} overdue` : undefined,
      color: 'text-amber-500',
    },
    {
      id: 'upcoming' as ViewType,
      label: 'Upcoming',
      icon: CalendarDays,
      count: upcomingCount,
      color: 'text-indigo-500',
    },
    {
      id: 'all' as ViewType,
      label: 'All Tasks',
      icon: ListOrdered,
      count: allCount,
      color: 'text-violet-500',
    },
    {
      id: 'completed' as ViewType,
      label: 'Completed',
      icon: CheckCircle2,
      count: completedCount,
      color: 'text-emerald-500',
    },
    {
      id: 'dashboard' as ViewType,
      label: 'Productivity Dashboard',
      icon: BarChart3,
      count: null,
      color: 'text-pink-500',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 md:w-60 lg:w-64 shrink-0 flex flex-col justify-between border-r border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Top Header & Branding */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  TASKFLOW
                </span>
                <span className="block text-[10px] text-indigo-500 font-medium -mt-0.5 tracking-tight">
                  Make progress, every day.
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Create Task Button */}
          <button
            type="button"
            onClick={() => {
              onOpenCreateTask();
              onCloseMobile();
            }}
            className="mt-3.5 w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer group"
          >
            <span className="flex items-center gap-2">
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
              <span>New Task</span>
            </span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-indigo-700/60 text-indigo-200 text-[10px] font-mono">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-6">
          {/* Main Views */}
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id && !selectedProjectId;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectView(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-500' : item.color}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-500/15 text-rose-500 border border-rose-500/25">
                        {item.badge}
                      </span>
                    )}
                    {item.count !== null && (
                      <span
                        className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-indigo-500/20 text-indigo-600 dark:text-indigo-300'
                            : 'text-slate-400'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Projects Section */}
          <div>
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                My Projects
              </span>
              <button
                type="button"
                onClick={onOpenCreateProject}
                className="p-1 rounded text-slate-400 hover:text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Add new project"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-0.5">
              {projects.length === 0 ? (
                <button
                  type="button"
                  onClick={onOpenCreateProject}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-xl transition-all border border-dashed border-slate-200 dark:border-slate-800 text-left cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 shrink-0" />
                  <span>Create first project</span>
                </button>
              ) : (
                projects.map((proj) => {
                  const isActive = currentView === 'project' && selectedProjectId === proj.id;
                  const isMenuOpen = activeProjectMenu === proj.id;

                  return (
                    <div
                      key={proj.id}
                      className={`group relative flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          onSelectView('project', proj.id);
                          onCloseMobile();
                        }}
                        className="flex-1 flex items-center gap-2.5 truncate text-left"
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: proj.color }}
                        />
                        <span className="truncate">{proj.name}</span>
                      </button>

                      <div className="relative shrink-0 flex items-center">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveProjectMenu(isMenuOpen ? null : proj.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded transition-opacity"
                        >
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>

                        {isMenuOpen && (
                          <>
                            <div
                              className="fixed inset-0 z-20"
                              onClick={() => setActiveProjectMenu(null)}
                            />
                            <div className="absolute right-0 top-6 z-30 w-32 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1 text-xs">
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveProjectMenu(null);
                                  onEditProject(proj);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveProjectMenu(null);
                                  onDeleteProject(proj);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Footer Controls: Theme Toggle & Settings */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={onToggleTheme}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
          >
            {isDark ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-500" />
                <span>Dark</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Settings & Backup"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>
      </aside>
    </>
  );
};

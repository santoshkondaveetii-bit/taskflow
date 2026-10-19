import React from 'react';
import { ViewType, Project } from '../types';
import { getFullFormattedCurrentDate } from '../utils/date';
import {
  Menu,
  Plus,
  Moon,
  Sun,
  PanelRight,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  currentView: ViewType;
  selectedProject?: Project;
  isDark: boolean;
  rightPanelCollapsed: boolean;
  onToggleMobileSidebar: () => void;
  onToggleTheme: () => void;
  onToggleRightPanel: () => void;
  onOpenCreateTask: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  selectedProject,
  isDark,
  rightPanelCollapsed,
  onToggleMobileSidebar,
  onToggleTheme,
  onToggleRightPanel,
  onOpenCreateTask,
}) => {
  const currentDateStr = getFullFormattedCurrentDate();

  const getViewDetails = () => {
    switch (currentView) {
      case 'inbox':
        return {
          title: 'Inbox',
          description: 'Capture everything on your mind before categorizing.',
        };
      case 'today':
        return {
          title: 'Today',
          description: `Focus on what matters most today. ${currentDateStr}`,
        };
      case 'upcoming':
        return {
          title: 'Upcoming',
          description: 'Plan ahead and stay prepared for upcoming milestones.',
        };
      case 'all':
        return {
          title: 'All Tasks',
          description: 'A comprehensive view of all your pending and active items.',
        };
      case 'completed':
        return {
          title: 'Completed',
          description: 'Review your achievements and completed workflow history.',
        };
      case 'dashboard':
        return {
          title: 'Productivity Analytics',
          description: 'Track streaks, task velocity, and habits over time.',
        };
      case 'project':
        return {
          title: selectedProject?.name || 'Project',
          description: selectedProject?.description || 'Tasks assigned to this project.',
        };
      default:
        return {
          title: 'Taskflow',
          description: 'Make progress, every single day.',
        };
    }
  };

  const viewDetails = getViewDetails();

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 sm:px-6 py-3 transition-colors">
      <div className="flex items-center justify-between gap-3">
        {/* Left Side: Mobile Menu Button & View Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 md:hidden"
            aria-label="Open navigation sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="truncate">
            <div className="flex items-center gap-2">
              {selectedProject && (
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: selectedProject.color }}
                />
              )}
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 truncate">
                {viewDetails.title}
              </h1>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate hidden sm:block">
              {viewDetails.description}
            </p>
          </div>
        </div>

        {/* Right Side: Quick Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Add Task Button */}
          <button
            type="button"
            onClick={onOpenCreateTask}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">Add Task</span>
          </button>

          {/* Theme Switcher Button */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            title={`Toggle ${isDark ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle color theme"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-500" />
            )}
          </button>

          {/* Right Panel Toggle Button (Desktop) */}
          <button
            type="button"
            onClick={onToggleRightPanel}
            className={`p-2 rounded-xl hidden lg:flex items-center justify-center transition-colors ${
              !rightPanelCollapsed
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10'
                : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80'
            }`}
            title="Toggle Right Productivity Panel"
            aria-label="Toggle productivity summary panel"
          >
            <PanelRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

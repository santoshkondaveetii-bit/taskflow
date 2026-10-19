import React from 'react';
import { ViewType } from '../types';
import {
  Calendar,
  Inbox,
  CalendarDays,
  Folder,
  BarChart3,
  Plus,
} from 'lucide-react';

interface MobileNavigationProps {
  currentView: ViewType;
  todayCount: number;
  inboxCount: number;
  onSelectView: (view: ViewType) => void;
  onOpenCreateTask: () => void;
  onOpenMobileProjects: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  currentView,
  todayCount,
  inboxCount,
  onSelectView,
  onOpenCreateTask,
  onOpenMobileProjects,
}) => {
  return (
    <div className="fixed bottom-0 inset-x-0 z-30 md:hidden bg-white/90 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-3 py-1.5 shadow-lg">
      <div className="flex items-center justify-around relative">
        {/* Today */}
        <button
          type="button"
          onClick={() => onSelectView('today')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-xs transition-colors relative ${
            currentView === 'today'
              ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span className="text-[10px]">Today</span>
          {todayCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
          )}
        </button>

        {/* Inbox */}
        <button
          type="button"
          onClick={() => onSelectView('inbox')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-xs transition-colors relative ${
            currentView === 'inbox'
              ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span className="text-[10px]">Inbox</span>
          {inboxCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-sky-500" />
          )}
        </button>

        {/* Center Floating Action Button (FAB) */}
        <div className="-mt-6 flex justify-center">
          <button
            type="button"
            onClick={onOpenCreateTask}
            className="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/40 transform active:scale-95 transition-all"
            aria-label="Create Task"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Upcoming */}
        <button
          type="button"
          onClick={() => onSelectView('upcoming')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-xs transition-colors ${
            currentView === 'upcoming'
              ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          <span className="text-[10px]">Upcoming</span>
        </button>

        {/* Analytics / Dashboard */}
        <button
          type="button"
          onClick={() => onSelectView('dashboard')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-xs transition-colors ${
            currentView === 'dashboard'
              ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span className="text-[10px]">Stats</span>
        </button>
      </div>
    </div>
  );
};

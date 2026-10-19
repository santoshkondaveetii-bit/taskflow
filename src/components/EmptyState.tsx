import React from 'react';
import { ViewType } from '../types';
import {
  Inbox,
  CheckCircle2,
  Calendar,
  CalendarDays,
  ListTodo,
  Folder,
  Plus,
  Sparkles,
} from 'lucide-react';

interface EmptyStateProps {
  view: ViewType;
  projectName?: string;
  isFiltered?: boolean;
  onAddTask: () => void;
  onClearFilters?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  view,
  projectName,
  isFiltered,
  onAddTask,
  onClearFilters,
}) => {
  if (isFiltered) {
    return (
      <div className="py-16 px-4 text-center flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-3 border border-indigo-500/20">
          <ListTodo className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
          No matching tasks found
        </h3>
        <p className="mt-1 text-xs text-slate-500 max-w-sm">
          No tasks match your active filters or search criteria. Try modifying your filters or clear them.
        </p>
        {onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all"
          >
            Clear Active Filters
          </button>
        )}
      </div>
    );
  }

  const getContent = () => {
    switch (view) {
      case 'inbox':
        return {
          icon: Inbox,
          title: 'Inbox is crystal clear',
          desc: 'Capture fleeting thoughts, ideas, or untracked to-dos here before scheduling.',
          buttonLabel: 'Add to Inbox',
        };
      case 'today':
        return {
          icon: CheckCircle2,
          title: 'All caught up for today!',
          desc: 'You have completed or have no pending tasks scheduled for today. Great job!',
          buttonLabel: 'Plan for Today',
        };
      case 'upcoming':
        return {
          icon: CalendarDays,
          title: 'No upcoming tasks scheduled',
          desc: 'Keep your future weeks organized by scheduling deadlines and recurring tasks.',
          buttonLabel: 'Schedule a Task',
        };
      case 'completed':
        return {
          icon: Sparkles,
          title: 'No completed tasks yet',
          desc: 'Tasks you mark as complete will be recorded here along with your completion timestamps.',
          buttonLabel: 'Create First Task',
        };
      case 'project':
        return {
          icon: Folder,
          title: `No tasks in ${projectName || 'this project'}`,
          desc: 'Break down your goals for this project into actionable items.',
          buttonLabel: 'Add Task to Project',
        };
      case 'all':
      default:
        return {
          icon: ListTodo,
          title: 'No tasks on your board',
          desc: 'Ready to build momentum? Add your first task and start making progress.',
          buttonLabel: 'Create First Task',
        };
    }
  };

  const content = getContent();
  const Icon = content.icon;

  return (
    <div className="py-16 px-4 text-center flex flex-col items-center justify-center animate-in fade-in duration-200">
      <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-3.5 border border-indigo-500/20">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
        {content.title}
      </h3>
      <p className="mt-1 text-xs text-slate-500 max-w-sm leading-relaxed">
        {content.desc}
      </p>
      <button
        type="button"
        onClick={onAddTask}
        className="mt-4 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>{content.buttonLabel}</span>
      </button>
    </div>
  );
};

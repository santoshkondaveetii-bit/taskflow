import React, { useState, useRef } from 'react';
import { Project, Priority } from '../types';
import { getTodayString, getOffsetDateString } from '../utils/date';
import { Plus, Calendar, Flag, Folder, CornerDownLeft } from 'lucide-react';

interface QuickAddTaskProps {
  projects: Project[];
  defaultProjectId?: string;
  defaultDueDate?: string;
  onAddTask: (taskData: {
    title: string;
    dueDate?: string;
    priority: Priority;
    projectId?: string;
  }) => void;
}

export const QuickAddTask: React.FC<QuickAddTaskProps> = ({
  projects,
  defaultProjectId,
  defaultDueDate,
  onAddTask,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState<string>(defaultDueDate || getTodayString());
  const [priority, setPriority] = useState<Priority>('medium');
  const [projectId, setProjectId] = useState<string>(defaultProjectId || '');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;

    onAddTask({
      title: trimmed,
      dueDate: dueDate || undefined,
      priority,
      projectId: projectId || undefined,
    });

    setTitle('');
    // Keep focus for continuous rapid task entry!
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      setIsFocused(false);
      setTitle('');
    }
  };

  const today = getTodayString();
  const tomorrow = getOffsetDateString(1);

  return (
    <div
      className={`relative rounded-xl border transition-all duration-200 ${
        isFocused
          ? 'bg-white dark:bg-slate-900 border-indigo-500 shadow-lg ring-1 ring-indigo-500/30'
          : 'bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div className="flex items-center px-3.5 py-2.5 gap-2.5">
        <Plus className="w-4 h-4 text-indigo-500 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Add a task... (Press Enter ↵ to save)"
          className="flex-1 bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
        />

        {title.trim().length > 0 && (
          <button
            type="button"
            onClick={() => handleSubmit()}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-sm"
          >
            <span>Add</span>
            <CornerDownLeft className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Expanded Quick Options Bar when active or text is typed */}
      {(isFocused || title.length > 0) && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 pb-2.5 pt-1 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Quick Due Date selector */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setDueDate(today)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  dueDate === today
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setDueDate(tomorrow)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  dueDate === tomorrow
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Tomorrow
              </button>
              <label className="flex items-center cursor-pointer px-1.5 py-0.5 text-slate-500 hover:text-slate-300">
                <Calendar className="w-3 h-3 mr-1" />
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="bg-transparent text-[11px] cursor-pointer focus:outline-none"
                />
              </label>
            </div>

            {/* Priority Selector */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
              <Flag className="w-3 h-3 ml-1.5 text-slate-400" />
              {(['urgent', 'high', 'medium', 'low'] as Priority[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`px-1.5 py-0.5 rounded text-[11px] capitalize font-medium transition-colors ${
                    priority === p
                      ? p === 'urgent'
                        ? 'bg-rose-500/20 text-rose-400 font-bold'
                        : p === 'high'
                        ? 'bg-amber-500/20 text-amber-400 font-bold'
                        : p === 'medium'
                        ? 'bg-indigo-500/20 text-indigo-400 font-bold'
                        : 'bg-slate-500/20 text-slate-400 font-bold'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Project Selector */}
            {projects.length > 0 && (
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                <Folder className="w-3 h-3 text-slate-400" />
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="bg-transparent text-[11px] text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
                >
                  <option value="" className="bg-white dark:bg-slate-900">
                    No Project (Inbox)
                  </option>
                  {projects.map((proj) => (
                    <option key={proj.id} value={proj.id} className="bg-white dark:bg-slate-900">
                      {proj.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <span className="text-[10px] text-slate-400 hidden sm:inline">
            Esc to dismiss
          </span>
        </div>
      )}
    </div>
  );
};

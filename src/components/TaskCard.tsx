import React, { useState } from 'react';
import { Task, Project } from '../types';
import { formatDateReadable, isOverdue, isToday } from '../utils/date';
import {
  Check,
  Calendar,
  Clock,
  Repeat,
  ListTodo,
  MoreVertical,
  Edit2,
  Copy,
  Trash2,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  Flame,
  ArrowUp,
  Minus,
  ArrowDown,
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  project?: Project;
  onToggleComplete: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDuplicate: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggleSubtask: (task: Task, subtaskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  project,
  onToggleComplete,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleSubtask,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [subtasksExpanded, setSubtasksExpanded] = useState(false);

  const overdue = isOverdue(task.dueDate, task.completed);
  const dueToday = isToday(task.dueDate);
  const totalSubtasks = task.subtasks?.length || 0;
  const completedSubtasks = task.subtasks?.filter((s) => s.completed).length || 0;

  const getPriorityBadge = () => {
    switch (task.priority) {
      case 'urgent':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide bg-rose-500/15 text-rose-400 border border-rose-500/30">
            <Flame className="w-3 h-3 shrink-0" />
            Urgent
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <ArrowUp className="w-3 h-3 shrink-0" />
            High
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium tracking-wide bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
            <Minus className="w-3 h-3 shrink-0" />
            Medium
          </span>
        );
      case 'low':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium tracking-wide bg-slate-500/15 text-slate-400 border border-slate-500/30">
            <ArrowDown className="w-3 h-3 shrink-0" />
            Low
          </span>
        );
    }
  };

  const getDueDateBadge = () => {
    if (!task.dueDate) return null;
    const formatted = formatDateReadable(task.dueDate, task.dueTime);

    if (task.completed) {
      return (
        <span className="inline-flex items-center gap-1 text-xs text-slate-500">
          <Calendar className="w-3.5 h-3.5" />
          {formatted}
        </span>
      );
    }

    if (overdue) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-rose-500/15 text-rose-400 border border-rose-500/30 animate-pulse">
          <AlertTriangle className="w-3 h-3" />
          {formatted} (Overdue)
        </span>
      );
    }

    if (dueToday) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30">
          <Clock className="w-3 h-3" />
          {formatted}
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-300 transition-colors">
        <Calendar className="w-3.5 h-3.5" />
        {formatted}
      </span>
    );
  };

  return (
    <div
      className={`group relative rounded-xl border p-3.5 sm:p-4 transition-all duration-200 ${
        task.completed
          ? 'bg-slate-900/30 border-slate-800/60 opacity-65 dark:bg-slate-950/40 dark:border-slate-800/40'
          : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800/80 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 shadow-sm hover:shadow-md'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Animated Checkbox */}
        <button
          type="button"
          onClick={() => onToggleComplete(task)}
          className={`mt-0.5 relative flex items-center justify-center w-5 h-5 rounded-md border transition-all duration-200 shrink-0 ${
            task.completed
              ? 'bg-indigo-600 border-indigo-600 text-white animate-check'
              : 'border-slate-400 dark:border-slate-600 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'
          }`}
          aria-label={task.completed ? 'Mark task as incomplete' : 'Mark task as complete'}
        >
          {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Task Core Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              onClick={() => onEdit(task)}
              className={`text-sm sm:text-base font-medium cursor-pointer transition-colors leading-snug break-words ${
                task.completed
                  ? 'line-through text-slate-400 dark:text-slate-500'
                  : 'text-slate-800 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              {task.title}
            </h3>

            {/* Actions Menu */}
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="opacity-70 group-hover:opacity-100 p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                aria-label="Task options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-7 z-30 w-36 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1 text-xs animate-in fade-in zoom-in-95">
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onEdit(task);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit task
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onDuplicate(task);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Duplicate
                    </button>
                    <div className="h-px bg-slate-200 dark:bg-slate-800 my-1" />
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onDelete(task);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Description snippet if any */}
          {task.description && (
            <p
              onClick={() => onEdit(task)}
              className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-2 cursor-pointer"
            >
              {task.description}
            </p>
          )}

          {/* Metadata Badges Bar */}
          <div className="mt-2.5 flex flex-wrap items-center gap-2 pt-1 text-xs">
            {getPriorityBadge()}

            {getDueDateBadge()}

            {/* Project Pill */}
            {project && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: project.color }}
                />
                {project.name}
              </span>
            )}

            {/* Recurrence Pill */}
            {task.repeat !== 'none' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-violet-500/10 text-violet-400 border border-violet-500/25">
                <Repeat className="w-3 h-3" />
                <span className="capitalize">{task.repeat}</span>
              </span>
            )}

            {/* Subtasks Count Button */}
            {totalSubtasks > 0 && (
              <button
                type="button"
                onClick={() => setSubtasksExpanded(!subtasksExpanded)}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border transition-colors ${
                  completedSubtasks === totalSubtasks
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <ListTodo className="w-3 h-3" />
                <span>
                  {completedSubtasks}/{totalSubtasks}
                </span>
                {subtasksExpanded ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
              </button>
            )}

            {/* Tags */}
            {task.tags &&
              task.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center text-[11px] text-slate-400 dark:text-slate-500"
                >
                  #{tag}
                </span>
              ))}
          </div>

          {/* Expandable Subtasks Checklist */}
          {totalSubtasks > 0 && subtasksExpanded && (
            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5 animate-in slide-in-from-top-1">
              {task.subtasks.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => onToggleSubtask(task, sub.id)}
                  className="flex items-center gap-2.5 py-1 px-2 rounded-lg hover:bg-slate-100/60 dark:hover:bg-slate-800/50 cursor-pointer group/sub transition-colors"
                >
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
                      sub.completed
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'border-slate-400 dark:border-slate-600'
                    }`}
                  >
                    {sub.completed && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <span
                    className={`text-xs transition-colors ${
                      sub.completed
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {sub.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

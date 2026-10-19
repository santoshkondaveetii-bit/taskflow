import React from 'react';
import { Task } from '../types';
import { TodayStats, getMotivationalMessage } from '../utils/analytics';
import { formatDateReadable } from '../utils/date';
import {
  Sparkles,
  CheckCircle2,
  ListTodo,
  AlertTriangle,
  Clock,
  ChevronRight,
  ChevronLeft,
  Flame,
  ArrowRight,
} from 'lucide-react';

interface RightPanelProps {
  stats: TodayStats;
  streak: number;
  upcomingTasks: Task[];
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onSelectTask: (task: Task) => void;
  onGoToDashboard: () => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  stats,
  streak,
  upcomingTasks,
  isCollapsed,
  onToggleCollapse,
  onSelectTask,
  onGoToDashboard,
}) => {
  if (isCollapsed) {
    return (
      <div className="hidden lg:flex flex-col items-center py-4 px-2 border-l border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/60 transition-all">
        <button
          type="button"
          onClick={onToggleCollapse}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Expand Right Panel"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="mt-6 flex flex-col items-center gap-4">
          <div className="text-[11px] font-bold text-indigo-500 writing-mode-vertical rotate-180 tracking-widest uppercase">
            Productivity
          </div>
          <div className="w-7 h-7 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-500/25">
            {stats.completionRate}%
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-0.5 text-xs font-bold text-amber-500" title={`${streak} day streak`}>
              <Flame className="w-4 h-4 fill-amber-500" />
              <span>{streak}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Circular progress ring dimensions
  const size = 120;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (stats.completionRate / 100) * circumference;

  const motivationalMsg = getMotivationalMessage(
    stats.completionRate,
    stats.totalToday,
    stats.remainingToday
  );

  return (
    <aside className="w-80 shrink-0 border-l border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md p-5 flex flex-col gap-6 overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100 tracking-tight">
            Daily Progress
          </h2>
        </div>
        <button
          type="button"
          onClick={onToggleCollapse}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Collapse Panel"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Radial Progress Ring */}
      <div className="flex flex-col items-center justify-center py-2">
        <div className="relative flex items-center justify-center">
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background Circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-slate-100 dark:text-slate-800"
              fill="transparent"
            />
            {/* Animated Progress Circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="url(#progressGradient)"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={progressOffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Percentage Display */}
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
              {stats.completionRate}%
            </span>
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              Completed
            </span>
          </div>
        </div>

        {/* Motivational Card */}
        <div className="mt-4 p-3 rounded-xl bg-indigo-500/5 dark:bg-indigo-950/20 border border-indigo-500/20 text-center w-full">
          <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
            {motivationalMsg}
          </p>
        </div>
      </div>

      {/* Completed vs Remaining Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Completed</span>
          </div>
          <div className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {stats.completedToday}
          </div>
          <div className="text-[10px] text-slate-400">tasks done today</div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
            <ListTodo className="w-3.5 h-3.5 text-indigo-400" />
            <span>Remaining</span>
          </div>
          <div className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {stats.remainingToday}
          </div>
          <div className="text-[10px] text-slate-400">tasks to conquer</div>
        </div>
      </div>

      {/* Overdue alert if any */}
      {stats.overdueCount > 0 && (
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>
            <strong>{stats.overdueCount} task{stats.overdueCount > 1 ? 's' : ''} overdue</strong>. Check Today's view to clear them!
          </span>
        </div>
      )}

      {/* Streak Badge */}
      {streak > 0 && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center">
              <Flame className="w-4 h-4 fill-amber-500" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-500">{streak} Day Streak 🔥</div>
              <div className="text-[10px] text-slate-400">Keep up the consistency!</div>
            </div>
          </div>
          <button
            type="button"
            onClick={onGoToDashboard}
            className="text-xs text-indigo-500 hover:text-indigo-400 flex items-center gap-1 font-medium"
          >
            <span>Stats</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Upcoming Deadlines */}
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span>Upcoming Deadlines</span>
          </div>
          <span className="text-[11px] text-slate-400">{upcomingTasks.length} total</span>
        </div>

        {upcomingTasks.length === 0 ? (
          <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
            No upcoming deadlines scheduled
          </div>
        ) : (
          <div className="space-y-2 overflow-y-auto pr-1">
            {upcomingTasks.slice(0, 5).map((t) => (
              <div
                key={t.id}
                onClick={() => onSelectTask(t)}
                className="p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-800/40 hover:border-indigo-500/40 cursor-pointer transition-all"
              >
                <div className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                  {t.title}
                </div>
                <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{formatDateReadable(t.dueDate, t.dueTime)}</span>
                  <span
                    className={`capitalize font-semibold ${
                      t.priority === 'urgent'
                        ? 'text-rose-400'
                        : t.priority === 'high'
                        ? 'text-amber-400'
                        : t.priority === 'medium'
                        ? 'text-indigo-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {t.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full Dashboard Quick Link */}
      <button
        type="button"
        onClick={onGoToDashboard}
        className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-500/10 text-xs font-medium text-indigo-600 dark:text-indigo-400 flex items-center justify-center gap-1.5 transition-all"
      >
        <span>View Full Productivity Analytics</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </aside>
  );
};

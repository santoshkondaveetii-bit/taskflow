import React from 'react';
import { Task, Project, CompletionRecord } from '../types';
import {
  getTodayStats,
  calculateStreaks,
  getWeeklyActivity,
} from '../utils/analytics';
import { formatDateReadable } from '../utils/date';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  CheckCircle2,
  ListTodo,
  Flame,
  Trophy,
  Calendar,
  Clock,
  TrendingUp,
  Folder,
  ArrowRight,
} from 'lucide-react';

interface DashboardViewProps {
  tasks: Task[];
  projects: Project[];
  history: CompletionRecord[];
  onSelectTask: (task: Task) => void;
  onGoToView: (view: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tasks,
  projects,
  history,
  onSelectTask,
  onGoToView,
}) => {
  const stats = getTodayStats(tasks, history);
  const { currentStreak, bestStreak } = calculateStreaks(history);
  const weeklyActivity = getWeeklyActivity(history);

  // Total completed this week
  const completedThisWeek = weeklyActivity.reduce((acc, curr) => acc + curr.completed, 0);

  // Project distribution
  const projectStats = projects.map((proj) => {
    const projTasks = tasks.filter((t) => t.projectId === proj.id);
    const completed = projTasks.filter((t) => t.completed).length;
    const active = projTasks.length - completed;
    const total = projTasks.length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return {
      ...proj,
      total,
      completed,
      active,
      rate,
    };
  });

  // Priority breakdown
  const activeTasks = tasks.filter((t) => !t.completed);
  const priorityCounts = {
    urgent: activeTasks.filter((t) => t.priority === 'urgent').length,
    high: activeTasks.filter((t) => t.priority === 'high').length,
    medium: activeTasks.filter((t) => t.priority === 'medium').length,
    low: activeTasks.filter((t) => t.priority === 'low').length,
  };

  // Recent activity log
  const recentHistory = [...history]
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 7);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Top Banner Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Productivity & Velocity Overview
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Real-time metrics, completion trends, and consistency streaks calculated from your task flow.
        </p>
      </div>

      {/* 4 Core Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Today's Rate */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Daily Completion</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
            {stats.completionRate}%
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {stats.completedToday} of {stats.totalToday} goals completed
          </div>
        </div>

        {/* Current Streak */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Current Streak</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Flame className="w-4 h-4 fill-amber-500" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-500">
            {currentStreak} {currentStreak === 1 ? 'Day' : 'Days'}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Personal best: {bestStreak} {bestStreak === 1 ? 'day' : 'days'}
          </div>
        </div>

        {/* Weekly Completed */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">This Week</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-500">
            {completedThisWeek}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            tasks finished in last 7 days
          </div>
        </div>

        {/* Remaining Today */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Remaining Today</span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <ListTodo className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
            {stats.remainingToday}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {stats.overdueCount > 0 ? `${stats.overdueCount} overdue` : '0 overdue'}
          </div>
        </div>
      </div>

      {/* 7-Day Completion Bar Chart */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">
              7-Day Activity Velocity
            </h2>
            <p className="text-xs text-slate-500">
              Tasks completed per day across the past week
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>Last 7 Days</span>
          </div>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="dayName"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
                formatter={(val: any) => [`${val} tasks completed`, 'Completions']}
                labelFormatter={(label) => `Day: ${label}`}
              />
              <Bar dataKey="completed" radius={[6, 6, 0, 0]}>
                {weeklyActivity.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.isToday ? '#6366f1' : '#475569'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Projects Distribution & Priority Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Project Progress */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">
              Project Progress Breakdown
            </h2>
            <Folder className="w-4 h-4 text-slate-400" />
          </div>

          {projectStats.length === 0 ? (
            <p className="text-xs text-slate-500">No projects created yet.</p>
          ) : (
            <div className="space-y-4">
              {projectStats.map((proj) => (
                <div key={proj.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: proj.color }}
                      />
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {proj.name}
                      </span>
                    </div>
                    <span className="text-slate-500">
                      {proj.completed}/{proj.total} done ({proj.rate}%)
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${proj.rate}%`,
                        backgroundColor: proj.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Priority Split & Recent Completions */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Active Task Priority Split
            </h2>
            <div className="grid grid-cols-4 gap-2 mb-6">
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-center">
                <div className="text-xs font-semibold text-rose-400">Urgent</div>
                <div className="text-xl font-bold text-rose-500">{priorityCounts.urgent}</div>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-center">
                <div className="text-xs font-semibold text-amber-400">High</div>
                <div className="text-xl font-bold text-amber-500">{priorityCounts.high}</div>
              </div>
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/25 text-center">
                <div className="text-xs font-semibold text-indigo-400">Med</div>
                <div className="text-xl font-bold text-indigo-500">{priorityCounts.medium}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-500/10 border border-slate-500/25 text-center">
                <div className="text-xs font-semibold text-slate-400">Low</div>
                <div className="text-xl font-bold text-slate-400">{priorityCounts.low}</div>
              </div>
            </div>
          </div>

          {/* Recent completions list */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Recent Completions Activity
            </h3>
            {recentHistory.length === 0 ? (
              <p className="text-xs text-slate-500">No tasks completed yet.</p>
            ) : (
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {recentHistory.map((h) => (
                  <div
                    key={h.id}
                    className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800"
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate text-slate-700 dark:text-slate-300">
                        {h.taskTitle}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {formatDateReadable(h.date)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

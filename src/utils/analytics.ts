import { Task, CompletionRecord } from '../types';
import { getTodayString, getOffsetDateString } from './date';

export interface TodayStats {
  completedToday: number;
  remainingToday: number;
  totalToday: number;
  completionRate: number; // 0 to 100
  overdueCount: number;
}

export interface DayActivity {
  dayName: string;
  dateStr: string;
  completed: number;
  isToday: boolean;
}

export function getTodayStats(tasks: Task[], history: CompletionRecord[]): TodayStats {
  const today = getTodayString();

  // Completed today either in history or marked completed on today's date
  const completedTodayFromHistory = history.filter((h) => h.date === today).length;
  const completedTodayFromTasks = tasks.filter(
    (t) => t.completed && t.completedAt && t.completedAt.startsWith(today)
  ).length;

  const completedToday = Math.max(completedTodayFromHistory, completedTodayFromTasks);

  // Incomplete tasks due today or overdue
  const overdueCount = tasks.filter((t) => !t.completed && t.dueDate && t.dueDate < today).length;
  const dueTodayCount = tasks.filter((t) => !t.completed && t.dueDate === today).length;
  const remainingToday = overdueCount + dueTodayCount;

  const totalToday = completedToday + remainingToday;
  const completionRate = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  return {
    completedToday,
    remainingToday,
    totalToday,
    completionRate,
    overdueCount,
  };
}

export function calculateStreaks(history: CompletionRecord[]): { currentStreak: number; bestStreak: number } {
  if (!history || history.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  // Set of unique completion dates
  const completedDates = new Set<string>();
  history.forEach((record) => {
    if (record.date) {
      completedDates.add(record.date);
    }
  });

  const sortedDates = Array.from(completedDates).sort();
  if (sortedDates.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  // Calculate best streak
  let bestStreak = 0;
  let runningStreak = 0;
  let prevDate: Date | null = null;

  for (const dateStr of sortedDates) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const curr = new Date(y, m - 1, d);

    if (!prevDate) {
      runningStreak = 1;
    } else {
      const diffDays = Math.round((curr.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        runningStreak++;
      } else if (diffDays > 1) {
        runningStreak = 1;
      }
    }
    prevDate = curr;
    if (runningStreak > bestStreak) {
      bestStreak = runningStreak;
    }
  }

  // Calculate current streak
  const today = getTodayString();
  const yesterday = getOffsetDateString(-1);

  let currentStreak = 0;
  // If user completed a task today, start from today. If not, but completed yesterday, count up to yesterday.
  let checkDateStr = completedDates.has(today) ? today : (completedDates.has(yesterday) ? yesterday : null);

  if (checkDateStr) {
    while (checkDateStr && completedDates.has(checkDateStr)) {
      currentStreak++;
      checkDateStr = getOffsetDateString(-1, checkDateStr);
    }
  }

  if (currentStreak > bestStreak) {
    bestStreak = currentStreak;
  }

  return { currentStreak, bestStreak };
}

export function getWeeklyActivity(history: CompletionRecord[]): DayActivity[] {
  const result: DayActivity[] = [];
  const today = getTodayString();

  // Last 7 days including today
  for (let i = 6; i >= 0; i--) {
    const dateStr = getOffsetDateString(-i);
    const [y, m, d] = dateStr.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });

    const completed = history.filter((h) => h.date === dateStr).length;

    result.push({
      dayName,
      dateStr,
      completed,
      isToday: dateStr === today,
    });
  }

  return result;
}

export function getMotivationalMessage(completionRate: number, totalToday: number, remainingToday: number): string {
  if (totalToday === 0) {
    return 'Your schedule is clear. Create a task to start making progress today!';
  }
  if (completionRate === 100 && totalToday > 0) {
    return 'Outstanding! All goals checked off for today. Take pride in your consistency! ✨';
  }
  if (completionRate >= 75) {
    return `Incredible momentum! Only ${remainingToday} task${remainingToday > 1 ? 's' : ''} left to finish your day strong.`;
  }
  if (completionRate >= 50) {
    return 'Past the halfway mark! Your daily focus is paying off nicely.';
  }
  if (completionRate >= 25) {
    return 'Great start! Keep the rhythm going, one task at a time.';
  }
  if (completionRate > 0) {
    return 'First wins logged today. Carry that momentum into your next task!';
  }
  return 'Make progress, every single day. Pick your highest priority task and begin!';
}

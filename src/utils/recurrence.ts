import { Task, RecurrenceType } from '../types';
import { getTodayString } from './date';

export function calculateNextDueDate(currentDueDate?: string, repeat?: RecurrenceType): string {
  if (!repeat || repeat === 'none') return '';
  
  const today = getTodayString();
  const baseStr = currentDueDate && currentDueDate >= today ? currentDueDate : today;
  const [year, month, day] = baseStr.split('-').map(Number);
  const nextDate = new Date(year, month - 1, day);

  switch (repeat) {
    case 'daily':
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    default:
      return '';
  }

  const nextYear = nextDate.getFullYear();
  const nextMonth = String(nextDate.getMonth() + 1).padStart(2, '0');
  const nextDay = String(nextDate.getDate()).padStart(2, '0');
  return `${nextYear}-${nextMonth}-${nextDay}`;
}

export function createNextRecurringTask(completedTask: Task): Task | null {
  if (completedTask.repeat === 'none') return null;

  const nextDueDate = calculateNextDueDate(completedTask.dueDate, completedTask.repeat);
  if (!nextDueDate) return null;

  const nowIso = new Date().toISOString();

  return {
    ...completedTask,
    id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    completed: false,
    completedAt: undefined,
    dueDate: nextDueDate,
    subtasks: (completedTask.subtasks || []).map((sub) => ({
      ...sub,
      id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      completed: false,
    })),
    createdAt: nowIso,
    updatedAt: nowIso,
  };
}

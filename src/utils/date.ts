/**
 * Date utility helpers for TASKFLOW
 */

export function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateReadable(dateStr?: string, timeStr?: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  const today = getTodayString();
  const tomorrow = getOffsetDateString(1);
  const yesterday = getOffsetDateString(-1);

  let dateLabel = '';
  if (dateStr === today) {
    dateLabel = 'Today';
  } else if (dateStr === tomorrow) {
    dateLabel = 'Tomorrow';
  } else if (dateStr === yesterday) {
    dateLabel = 'Yesterday';
  } else {
    dateLabel = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  }

  if (timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    const timeFormatted = `${hour12}:${String(minutes).padStart(2, '0')} ${period}`;
    return `${dateLabel}, ${timeFormatted}`;
  }

  return dateLabel;
}

export function getOffsetDateString(daysOffset: number, fromDateStr?: string): string {
  let base: Date;
  if (fromDateStr) {
    const [y, m, d] = fromDateStr.split('-').map(Number);
    base = new Date(y, m - 1, d);
  } else {
    base = new Date();
  }
  base.setDate(base.getDate() + daysOffset);
  const year = base.getFullYear();
  const month = String(base.getMonth() + 1).padStart(2, '0');
  const day = String(base.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isOverdue(dateStr?: string, isCompleted: boolean = false): boolean {
  if (!dateStr || isCompleted) return false;
  const today = getTodayString();
  return dateStr < today;
}

export function isToday(dateStr?: string): boolean {
  if (!dateStr) return false;
  return dateStr === getTodayString();
}

export function isFuture(dateStr?: string): boolean {
  if (!dateStr) return false;
  const today = getTodayString();
  return dateStr > today;
}

export function getDaysDifference(targetDateStr: string): number {
  const [y1, m1, d1] = targetDateStr.split('-').map(Number);
  const target = new Date(y1, m1 - 1, d1);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffTime = target.getTime() - today.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export function getFullFormattedCurrentDate(): string {
  const now = new Date();
  return now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
}

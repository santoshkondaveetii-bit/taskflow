import { getTodayString, getOffsetDateString, formatDateReadable, isOverdue, isToday } from '../src/utils/date';
import { getTodayStats, calculateStreaks, getWeeklyActivity, getMotivationalMessage } from '../src/utils/analytics';
import { calculateNextDueDate, createNextRecurringTask } from '../src/utils/recurrence';
import { DEFAULT_PROJECTS, getInitialSeedTasks, getInitialSeedHistory } from '../src/utils/storage';
import { Task, CompletionRecord } from '../src/types';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  } else {
    console.log(`✅ ${message}`);
  }
}

console.log('--- TEST SUITE 1: Date Utilities ---');
const today = getTodayString();
assert(/^\d{4}-\d{2}-\d{2}$/.test(today), `Today string is formatted YYYY-MM-DD: ${today}`);

const tomorrow = getOffsetDateString(1);
const yesterday = getOffsetDateString(-1);
assert(formatDateReadable(today).includes('Today'), 'Formats today as "Today"');
assert(formatDateReadable(tomorrow).includes('Tomorrow'), 'Formats tomorrow as "Tomorrow"');
assert(formatDateReadable(yesterday).includes('Yesterday'), 'Formats yesterday as "Yesterday"');

assert(isToday(today), 'isToday(today) is true');
assert(!isToday(tomorrow), 'isToday(tomorrow) is false');
assert(isOverdue(yesterday, false), 'isOverdue(yesterday) is true for incomplete task');
assert(!isOverdue(yesterday, true), 'isOverdue(yesterday) is false for completed task');
assert(!isOverdue(tomorrow, false), 'isOverdue(tomorrow) is false');

console.log('\n--- TEST SUITE 2: Recurrence Engine ---');
const dailyNext = calculateNextDueDate(today, 'daily');
assert(dailyNext === tomorrow, `Daily recurrence produces tomorrow: ${dailyNext}`);

const weeklyNext = calculateNextDueDate(today, 'weekly');
const expectedWeekly = getOffsetDateString(7, today);
assert(weeklyNext === expectedWeekly, `Weekly recurrence produces +7 days: ${weeklyNext}`);

const sampleRecurringTask: Task = {
  id: 'task_test_rec',
  title: 'Morning Yoga',
  completed: true,
  repeat: 'daily',
  dueDate: today,
  priority: 'high',
  tags: ['health'],
  subtasks: [{ id: 's1', title: 'Stretching', completed: true }],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const nextInstance = createNextRecurringTask(sampleRecurringTask);
assert(nextInstance !== null, 'Recurring task generated next instance');
assert(nextInstance?.id !== sampleRecurringTask.id, 'New instance has a unique ID');
assert(nextInstance?.completed === false, 'New instance is uncompleted');
assert(nextInstance?.dueDate === tomorrow, 'New instance is due tomorrow');
assert(nextInstance?.subtasks[0].completed === false, 'New instance subtasks are reset to uncompleted');

console.log('\n--- TEST SUITE 3: Fresh Clean Slate State ---');
const seedTasks = getInitialSeedTasks();
const seedHistory = getInitialSeedHistory();

assert(DEFAULT_PROJECTS.length === 0, 'Default projects are empty for fresh start');
assert(seedTasks.length === 0, 'Seed tasks are empty for fresh start');
assert(seedHistory.length === 0, 'Seed history is empty for fresh start');

const freshStats = getTodayStats([], []);
assert(freshStats.completedToday === 0, 'Fresh completed today is 0');
assert(freshStats.remainingToday === 0, 'Fresh remaining today is 0');
assert(freshStats.completionRate === 0, 'Fresh completion rate is 0%');

const freshStreaks = calculateStreaks([]);
assert(freshStreaks.currentStreak === 0, 'Fresh current streak is 0');
assert(freshStreaks.bestStreak === 0, 'Fresh best streak is 0');

const freshWeekly = getWeeklyActivity([]);
assert(freshWeekly.length === 7, 'Fresh weekly chart has 7 days');
assert(freshWeekly.every((d) => d.completed === 0), 'All days in fresh weekly chart start at 0');

const freshMotivational = getMotivationalMessage(0, 0, 0);
assert(freshMotivational.length > 0, 'Motivational message provides welcoming prompt on empty board');

console.log('\n--- TEST SUITE 4: Dynamic Operations on Fresh Board ---');
const createdTask: Task = {
  id: 't_user_1',
  title: 'My First Real Task',
  completed: false,
  dueDate: today,
  priority: 'high',
  tags: ['first'],
  repeat: 'none',
  subtasks: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const updatedStats = getTodayStats([createdTask], []);
assert(updatedStats.totalToday === 1, 'Total today is 1 after adding task');
assert(updatedStats.remainingToday === 1, 'Remaining today is 1 after adding task');
assert(updatedStats.completionRate === 0, 'Completion rate is 0% before completion');

const completedRecord: CompletionRecord = {
  id: 'h_1',
  taskId: createdTask.id,
  taskTitle: createdTask.title,
  completedAt: new Date().toISOString(),
  date: today,
};

const postCompletionStats = getTodayStats([{ ...createdTask, completed: true, completedAt: new Date().toISOString() }], [completedRecord]);
assert(postCompletionStats.completedToday === 1, 'Completed today is 1 after checkoff');
assert(postCompletionStats.completionRate === 100, 'Completion rate reaches 100%');

const streakAfterComplete = calculateStreaks([completedRecord]);
assert(streakAfterComplete.currentStreak === 1, 'Streak increments to 1 after completion');

console.log('\n🎉 ALL FRESH WORKSPACE TESTS PASSED SUCCESSFULLY!');

# TASKFLOW

> *"Make progress, every single day."*

TASKFLOW is a premium productivity workspace, task management system, and habit tracker designed with the speed of Linear, the organization of Todoist, and the refined typography of Notion.

---

## Features

- **Three-Part Workspace Layout**:
  - **Left Sidebar**: Quick navigation across Inbox, Today (with overdue alert), Upcoming, All Tasks, Completed, Productivity Dashboard, and custom color-coded Projects.
  - **Main Content**: Smart task grouping (*Overdue*, *Due Today*, *Upcoming*), frictionless quick-add input (`Enter ↵`), search, filters (Priority, Project, Tag, Status), and sorting.
  - **Right Productivity Panel**: Circular radial progress ring, completed vs. remaining goals, streak badge, dynamic motivational messages, and upcoming deadlines queue.
- **Task & Habit Management**:
  - Detailed task attributes: Title, description, due date, time, priority (*Urgent*, *High*, *Medium*, *Low*), projects, tags, recurrence, and subtasks.
  - **Recurrence Engine**: Automates daily, weekly, and monthly repeating schedules upon completion with unique IDs and reset subtasks.
  - **Interactive Checklist**: Expandable subtask checklists with direct check-off capabilities.
- **Productivity Analytics Dashboard**:
  - 7-Day completion velocity chart powered by `Recharts`.
  - True daily completion rate and consecutive streak tracking 🔥.
  - Project progress breakdown bars and priority split.
  - Recent activity history log with timestamps.
- **Visual Design & UX**:
  - Dark mode default (`#0c0e14`, `#141822`) with electric violet/indigo accents (`#6366f1`).
  - Sleek Light mode toggle with instant persistence.
  - Celebratory confetti effects on task completion.
  - Toast notification system with **Undo** support for task completion and deletion.
- **Data Persistence & Portability**:
  - Pure clientside persistence via `localStorage` (no paid APIs or sign-ups required).
  - Export full JSON backup (`taskflow-backup-YYYY-MM-DD.json`).
  - Import JSON backup with structural validation and feedback.
  - Reset to clean template with safety confirmation dialog.

---

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 8
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Charts**: Recharts
- **Celebrations**: Canvas Confetti

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build
```bash
npm run build
```

### 4. Run Automated Test Suite
```bash
npx tsx scripts/verify-taskflow.ts
```

---

## Keyboard Shortcuts

- `Ctrl + K` / `Cmd + K`: Open new task modal
- `Enter ↵`: Save task in Quick-Add input
- `Esc`: Close modals or cancel input

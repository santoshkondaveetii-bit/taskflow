import React from 'react';
import { FilterOptions, SortBy, SortDirection, Project, Priority } from '../types';
import {
  Search,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  Filter,
} from 'lucide-react';

interface FilterBarProps {
  filters: FilterOptions;
  sortBy: SortBy;
  sortDirection: SortDirection;
  projects: Project[];
  availableTags: string[];
  totalTasksCount: number;
  filteredTasksCount: number;
  onUpdateFilters: (updates: Partial<FilterOptions>) => void;
  onUpdateSort: (sortBy: SortBy, direction?: SortDirection) => void;
  onClearFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  sortBy,
  sortDirection,
  projects,
  availableTags,
  totalTasksCount,
  filteredTasksCount,
  onUpdateFilters,
  onUpdateSort,
  onClearFilters,
}) => {
  const hasActiveFilters =
    Boolean(filters.search) ||
    filters.priority !== 'all' ||
    filters.projectId !== 'all' ||
    filters.tag !== 'all' ||
    filters.status !== 'all';

  return (
    <div className="space-y-3">
      {/* Top search & quick controls row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onUpdateFilters({ search: e.target.value })}
            placeholder="Search tasks, descriptions, or tags..."
            className="w-full pl-9 pr-9 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onUpdateFilters({ search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sorting Dropdown & Direction */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
          <div className="flex items-center gap-1 bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-600 dark:text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => onUpdateSort(e.target.value as SortBy)}
              className="bg-transparent focus:outline-none cursor-pointer text-xs"
            >
              <option value="dueDate" className="bg-white dark:bg-slate-900">
                Due Date
              </option>
              <option value="priority" className="bg-white dark:bg-slate-900">
                Priority
              </option>
              <option value="createdAt" className="bg-white dark:bg-slate-900">
                Date Added
              </option>
              <option value="alphabetical" className="bg-white dark:bg-slate-900">
                Alphabetical
              </option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => onUpdateSort(sortBy, sortDirection === 'asc' ? 'desc' : 'asc')}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={`Sort ${sortDirection === 'asc' ? 'Descending' : 'Ascending'}`}
          >
            {sortDirection === 'asc' ? '↑ Asc' : '↓ Desc'}
          </button>
        </div>
      </div>

      {/* Filter Selectors Bar */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {/* Priority Filter */}
        <select
          value={filters.priority}
          onChange={(e) => onUpdateFilters({ priority: e.target.value as any })}
          className={`px-2.5 py-1.5 rounded-xl border text-xs focus:outline-none cursor-pointer transition-colors ${
            filters.priority !== 'all'
              ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400'
          }`}
        >
          <option value="all" className="bg-white dark:bg-slate-900">
            All Priorities
          </option>
          <option value="urgent" className="bg-white dark:bg-slate-900">
            Urgent only
          </option>
          <option value="high" className="bg-white dark:bg-slate-900">
            High only
          </option>
          <option value="medium" className="bg-white dark:bg-slate-900">
            Medium only
          </option>
          <option value="low" className="bg-white dark:bg-slate-900">
            Low only
          </option>
        </select>

        {/* Project Filter */}
        {projects.length > 0 && (
          <select
            value={filters.projectId}
            onChange={(e) => onUpdateFilters({ projectId: e.target.value })}
            className={`px-2.5 py-1.5 rounded-xl border text-xs focus:outline-none cursor-pointer transition-colors ${
              filters.projectId !== 'all'
                ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400'
            }`}
          >
            <option value="all" className="bg-white dark:bg-slate-900">
              All Projects
            </option>
            {projects.map((p) => (
              <option key={p.id} value={p.id} className="bg-white dark:bg-slate-900">
                {p.name}
              </option>
            ))}
          </select>
        )}

        {/* Tag Filter */}
        {availableTags.length > 0 && (
          <select
            value={filters.tag}
            onChange={(e) => onUpdateFilters({ tag: e.target.value })}
            className={`px-2.5 py-1.5 rounded-xl border text-xs focus:outline-none cursor-pointer transition-colors ${
              filters.tag !== 'all'
                ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400'
            }`}
          >
            <option value="all" className="bg-white dark:bg-slate-900">
              All Tags
            </option>
            {availableTags.map((t) => (
              <option key={t} value={t} className="bg-white dark:bg-slate-900">
                #{t}
              </option>
            ))}
          </select>
        )}

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={(e) => onUpdateFilters({ status: e.target.value as any })}
          className={`px-2.5 py-1.5 rounded-xl border text-xs focus:outline-none cursor-pointer transition-colors ${
            filters.status !== 'all'
              ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400'
          }`}
        >
          <option value="all" className="bg-white dark:bg-slate-900">
            All Statuses
          </option>
          <option value="active" className="bg-white dark:bg-slate-900">
            Active only
          </option>
          <option value="completed" className="bg-white dark:bg-slate-900">
            Completed only
          </option>
        </select>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 text-xs font-semibold transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Clear filters
          </button>
        )}

        <span className="text-[11px] text-slate-400 ml-auto">
          Showing {filteredTasksCount} of {totalTasksCount} tasks
        </span>
      </div>
    </div>
  );
};

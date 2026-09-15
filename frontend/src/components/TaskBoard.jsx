import React, { useState, useMemo } from 'react';
import { Plus, Search, Calendar, Check, Edit3, Trash2, CheckCircle2, Circle } from 'lucide-react';

export default function TaskBoard({
  selectedList,
  tasks,
  loadingTasks,
  onOpenCreateTask,
  onOpenEditTask,
  onToggleStatus,
  onDeleteTask,
}) {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchStatus = statusFilter === 'ALL' || t.status === statusFilter;
      const matchPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
      const matchSearch =
        !searchQuery ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchStatus && matchPriority && matchSearch;
    });
  }, [tasks, statusFilter, priorityFilter, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = tasks.length;
    const closed = tasks.filter((t) => t.status === 'CLOSED').length;
    const open = total - closed;
    const progress = total > 0 ? Math.round((closed / total) * 100) : 0;
    return { total, open, closed, progress };
  }, [tasks]);

  return (
    <div className="space-y-6">
      {/* List Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{selectedList.title}</h2>
            {selectedList.description && (
              <p className="text-sm text-slate-500 mt-1">{selectedList.description}</p>
            )}
          </div>
          <button
            onClick={onOpenCreateTask}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm shadow-indigo-200 transition-all hover:shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>

        {/* Statistics Banner */}
        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-400 font-medium uppercase">Total Tasks</p>
            <p className="text-xl font-bold text-slate-800 mt-0.5">{stats.total}</p>
          </div>
          <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-100/70">
            <p className="text-xs text-amber-600 font-medium uppercase">Open</p>
            <p className="text-xl font-bold text-amber-800 mt-0.5">{stats.open}</p>
          </div>
          <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100/70">
            <p className="text-xs text-emerald-600 font-medium uppercase">Completed</p>
            <p className="text-xl font-bold text-emerald-800 mt-0.5">{stats.closed}</p>
          </div>
          <div className="bg-indigo-50/60 p-3 rounded-xl border border-indigo-100/70">
            <p className="text-xs text-indigo-600 font-medium uppercase">Progress</p>
            <p className="text-xl font-bold text-indigo-800 mt-0.5">{stats.progress}%</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${stats.progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {/* Status Pills */}
          <div className="inline-flex bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600">
            {['ALL', 'OPEN', 'CLOSED'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg transition-all capitalize ${
                  statusFilter === s
                    ? 'bg-white text-indigo-600 font-semibold shadow-sm'
                    : 'hover:text-slate-900'
                }`}
              >
                {s.toLowerCase()}
              </button>
            ))}
          </div>

          {/* Priority Select */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="ALL">All Priorities</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {loadingTasks ? (
          <div className="py-12 text-center text-sm text-slate-400">Loading tasks...</div>
        ) : filteredTasks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-10 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6" />
            </div>
            <p className="font-semibold text-slate-700">No tasks found</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {searchQuery || statusFilter !== 'ALL' || priorityFilter !== 'ALL'
                ? 'Try changing your search query or filter selection.'
                : 'Get started by clicking the "Add Task" button above!'}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isCompleted = task.status === 'CLOSED';
            const priorityClass =
              task.priority === 'HIGH'
                ? 'badge-high'
                : task.priority === 'LOW'
                ? 'badge-low'
                : 'badge-medium';

            return (
              <div
                key={task.id}
                className={`task-card bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 flex items-start gap-4 transition-all ${
                  isCompleted ? 'opacity-70 bg-slate-50/60' : ''
                }`}
              >
                {/* Checkbox Button */}
                <button
                  onClick={() => onToggleStatus(task)}
                  className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center border transition-colors ${
                    isCompleted
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-slate-300 hover:border-indigo-500 text-transparent hover:text-indigo-200'
                  }`}
                  title={isCompleted ? 'Mark as Open' : 'Mark as Completed'}
                >
                  <Check className="w-4 h-4" />
                </button>

                {/* Task Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3
                      className={`text-base font-semibold text-slate-900 break-words ${
                        isCompleted ? 'line-through text-slate-400' : ''
                      }`}
                    >
                      {task.title}
                    </h3>
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider ${priorityClass}`}
                    >
                      {task.priority || 'MEDIUM'}
                    </span>
                  </div>

                  {task.description && (
                    <p
                      className={`text-sm text-slate-600 mt-1 whitespace-pre-line ${
                        isCompleted ? 'text-slate-400' : ''
                      }`}
                    >
                      {task.description}
                    </p>
                  )}

                  {/* Metadata / Due Date */}
                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-400 font-medium">
                    {task.dueDate && (
                      <span className="inline-flex items-center gap-1.5 text-slate-500">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(task.dueDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                      </span>
                    )}
                    <span className="capitalize">{task.status.toLowerCase()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onOpenEditTask(task)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Edit Task"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteTask(task.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}


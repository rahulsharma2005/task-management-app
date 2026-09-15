const { useState, useEffect, useMemo } = React;

// API Base URL
const API_BASE = '/task-lists';

// SVG Icons
const IconCheck = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const IconPlus = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const IconTrash = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const IconEdit = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const IconCalendar = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const IconFolder = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);

const IconClose = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const IconSearch = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

function App() {
  const [taskLists, setTaskLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loadingLists, setLoadingLists] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(false);

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL, OPEN, CLOSED
  const [priorityFilter, setPriorityFilter] = useState('ALL'); // ALL, HIGH, MEDIUM, LOW
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [editingList, setEditingList] = useState(null);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Notifications
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch Task Lists
  const fetchTaskLists = async () => {
    try {
      setLoadingLists(true);
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error('Failed to fetch task lists');
      const data = await res.json();
      setTaskLists(data);
      if (data.length > 0 && !selectedListId) {
        setSelectedListId(data[0].id);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoadingLists(false);
    }
  };

  // Fetch Tasks for selected list
  const fetchTasks = async (listId) => {
    if (!listId) return;
    try {
      setLoadingTasks(true);
      const res = await fetch(`${API_BASE}/${listId}/tasks`);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    fetchTaskLists();
  }, []);

  useEffect(() => {
    if (selectedListId) {
      fetchTasks(selectedListId);
    } else {
      setTasks([]);
    }
  }, [selectedListId]);

  // Selected List details
  const selectedList = useMemo(() => {
    return taskLists.find((l) => l.id === selectedListId) || null;
  }, [taskLists, selectedListId]);

  // Save Task List (Create / Update)
  const handleSaveList = async (listData) => {
    try {
      if (editingList) {
        const res = await fetch(`${API_BASE}/${editingList.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...editingList, ...listData })
        });
        if (!res.ok) throw new Error('Failed to update task list');
        const updated = await res.json();
        setTaskLists(taskLists.map((l) => (l.id === updated.id ? updated : l)));
        showToast('Task list updated!');
      } else {
        const res = await fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(listData)
        });
        if (!res.ok) throw new Error('Failed to create task list');
        const created = await res.json();
        setTaskLists([...taskLists, created]);
        setSelectedListId(created.id);
        showToast('Task list created!');
      }
      setIsListModalOpen(false);
      setEditingList(null);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Delete Task List
  const handleDeleteList = async (listId) => {
    if (!confirm('Are you sure you want to delete this list and all its tasks?')) return;
    try {
      const res = await fetch(`${API_BASE}/${listId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete list');
      const remaining = taskLists.filter((l) => l.id !== listId);
      setTaskLists(remaining);
      if (selectedListId === listId) {
        setSelectedListId(remaining.length > 0 ? remaining[0].id : null);
      }
      showToast('Task list deleted');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Save Task (Create / Update)
  const handleSaveTask = async (taskData) => {
    if (!selectedListId) return;
    try {
      if (editingTask) {
        const res = await fetch(`${API_BASE}/${selectedListId}/tasks/${editingTask.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...editingTask, ...taskData })
        });
        if (!res.ok) throw new Error('Failed to update task');
        const updated = await res.json();
        setTasks(tasks.map((t) => (t.id === updated.id ? updated : t)));
        showToast('Task updated successfully!');
      } else {
        const res = await fetch(`${API_BASE}/${selectedListId}/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData)
        });
        if (!res.ok) throw new Error('Failed to create task');
        const created = await res.json();
        setTasks([...tasks, created]);
        showToast('Task added successfully!');
      }
      setIsTaskModalOpen(false);
      setEditingTask(null);
      fetchTaskLists(); // Refresh counts
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Toggle Task Status (OPEN <-> CLOSED)
  const handleToggleStatus = async (task) => {
    if (!selectedListId) return;
    const newStatus = task.status === 'CLOSED' ? 'OPEN' : 'CLOSED';
    try {
      const res = await fetch(`${API_BASE}/${selectedListId}/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, status: newStatus })
      });
      if (!res.ok) throw new Error('Failed to update status');
      const updated = await res.json();
      setTasks(tasks.map((t) => (t.id === updated.id ? updated : t)));
      fetchTaskLists();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Delete Task
  const handleDeleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      const res = await fetch(`${API_BASE}/${selectedListId}/tasks/${taskId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete task');
      setTasks(tasks.filter((t) => t.id !== taskId));
      showToast('Task deleted');
      fetchTaskLists();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

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
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium transition-all ${
            toast.type === 'error' ? 'bg-rose-600 text-white' : 'bg-indigo-600 text-white'
          }`}
        >
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <IconFolder />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                TaskPulse
              </h1>
              <p className="text-xs text-slate-400 font-medium">React + Spring Boot Task Tracker</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setEditingList(null);
                setIsListModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
            >
              <IconPlus />
              <span>New List</span>
            </button>
            {selectedListId && (
              <button
                onClick={() => {
                  setEditingTask(null);
                  setIsTaskModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-sm shadow-indigo-200 transition-all hover:shadow-md"
              >
                <IconPlus />
                <span>Add Task</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">
        {/* Sidebar: Task Lists */}
        <aside className="w-full md:w-80 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sticky top-24">
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Task Lists ({taskLists.length})
              </h2>
            </div>

            {loadingLists ? (
              <div className="py-8 text-center text-sm text-slate-400">Loading lists...</div>
            ) : taskLists.length === 0 ? (
              <div className="text-center py-8 px-2 border-2 border-dashed border-slate-200 rounded-xl">
                <p className="text-sm text-slate-500 mb-3">No lists created yet.</p>
                <button
                  onClick={() => setIsListModalOpen(true)}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg"
                >
                  Create your first list
                </button>
              </div>
            ) : (
              <div className="space-y-1.5 max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
                {taskLists.map((list) => {
                  const isSelected = list.id === selectedListId;
                  const listProgress = list.progress ? Math.round(list.progress * 100) : 0;
                  return (
                    <div
                      key={list.id}
                      onClick={() => setSelectedListId(list.id)}
                      className={`group relative p-3 rounded-xl cursor-pointer transition-all border ${
                        isSelected
                          ? 'bg-indigo-50/70 border-indigo-200 text-indigo-950 shadow-sm'
                          : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200/60 text-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1 pr-2">
                          <p className="font-semibold text-sm truncate">{list.title}</p>
                          {list.description && (
                            <p className="text-xs text-slate-500 truncate mt-0.5">{list.description}</p>
                          )}
                        </div>
                        {/* List Actions */}
                        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingList(list);
                              setIsListModalOpen(true);
                            }}
                            className="p-1 hover:text-indigo-600 text-slate-400 rounded transition-colors"
                            title="Edit List"
                          >
                            <IconEdit />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteList(list.id);
                            }}
                            className="p-1 hover:text-rose-600 text-slate-400 rounded transition-colors"
                            title="Delete List"
                          >
                            <IconTrash />
                          </button>
                        </div>
                      </div>

                      {/* Progress bar in sidebar card */}
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              listProgress === 100 ? 'bg-emerald-500' : 'bg-indigo-600'
                            }`}
                            style={{ width: `${listProgress}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-medium text-slate-500">{listProgress}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

        {/* Main Content Area: Tasks for selected list */}
        <main className="flex-1 min-w-0">
          {selectedList ? (
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
                    onClick={() => {
                      setEditingTask(null);
                      setIsTaskModalOpen(true);
                    }}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm shadow-indigo-200 transition-all hover:shadow"
                  >
                    <IconPlus />
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
                    <IconSearch />
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
                      <IconCheck />
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
                        {/* Checkbox */}
                        <button
                          onClick={() => handleToggleStatus(task)}
                          className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center border transition-colors ${
                            isCompleted
                              ? 'bg-emerald-500 border-emerald-500 text-white'
                              : 'border-slate-300 hover:border-indigo-500 text-transparent hover:text-indigo-200'
                          }`}
                          title={isCompleted ? 'Mark as Open' : 'Mark as Completed'}
                        >
                          <IconCheck />
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
                                <IconCalendar />
                                <span>{new Date(task.dueDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                              </span>
                            )}
                            <span className="capitalize">{task.status.toLowerCase()}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingTask(task);
                              setIsTaskModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit Task"
                          >
                            <IconEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Task"
                          >
                            <IconTrash />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto mb-4">
                <IconFolder />
              </div>
              <h2 className="text-xl font-bold text-slate-800">No List Selected</h2>
              <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                Create a task list or select one from the sidebar to view and manage its tasks.
              </p>
              <button
                onClick={() => {
                  setEditingList(null);
                  setIsListModalOpen(true);
                }}
                className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm"
              >
                <IconPlus />
                <span>Create New List</span>
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Task List Modal */}
      {isListModalOpen && (
        <ListModal
          list={editingList}
          onClose={() => {
            setIsListModalOpen(false);
            setEditingList(null);
          }}
          onSave={handleSaveList}
        />
      )}

      {/* Task Modal */}
      {isTaskModalOpen && (
        <TaskModal
          task={editingTask}
          onClose={() => {
            setIsTaskModalOpen(false);
            setEditingTask(null);
          }}
          onSave={handleSaveTask}
        />
      )}
    </div>
  );
}

// Modal Component for Task Lists
function ListModal({ list, onClose, onSave }) {
  const [title, setTitle] = useState(list ? list.title : '');
  const [description, setDescription] = useState(list ? list.description || '' : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title: title.trim(), description: description.trim() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 p-6 modal-content">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">
            {list ? 'Edit Task List' : 'Create Task List'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <IconClose />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Work, Groceries, Project Alpha"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Optional description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm"
            >
              {list ? 'Update List' : 'Create List'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Modal Component for Tasks
function TaskModal({ task, onClose, onSave }) {
  const [title, setTitle] = useState(task ? task.title : '');
  const [description, setDescription] = useState(task ? task.description || '' : '');
  const [priority, setPriority] = useState(task ? task.priority || 'MEDIUM' : 'MEDIUM');
  const [status, setStatus] = useState(task ? task.status || 'OPEN' : 'OPEN');
  const [dueDate, setDueDate] = useState(() => {
    if (task && task.dueDate) {
      return task.dueDate.substring(0, 16);
    }
    return '';
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      priority,
      status,
      dueDate: dueDate ? (dueDate.length === 16 ? dueDate + ':00' : dueDate) : null
    };

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 p-6 modal-content">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">{task ? 'Edit Task' : 'New Task'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <IconClose />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Finish quarterly presentation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Task details and checklist..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="OPEN">Open</option>
                <option value="CLOSED">Closed (Completed)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Due Date & Time
            </label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-sm"
            >
              {task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Render into DOM
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);


import React, { useState, useEffect, useMemo } from 'react';
import {
  getTaskLists,
  createTaskList,
  updateTaskList,
  deleteTaskList,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from './api/client';
import TaskListsSidebar from './components/TaskListsSidebar';
import TaskBoard from './components/TaskBoard';
import TaskListModal from './components/TaskListModal';
import TaskModal from './components/TaskModal';
import { FolderKanban, Plus } from 'lucide-react';

export default function App() {
  const [taskLists, setTaskLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loadingLists, setLoadingLists] = useState(true);
  const [loadingTasks, setLoadingTasks] = useState(false);

  // Modals
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [editingList, setEditingList] = useState(null);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Load Task Lists
  const loadTaskLists = async () => {
    try {
      setLoadingLists(true);
      const data = await getTaskLists();
      setTaskLists(data);
      if (data.length > 0 && !selectedListId) {
        setSelectedListId(data[0].id);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to fetch task lists', 'error');
    } finally {
      setLoadingLists(false);
    }
  };

  // Load Tasks
  const loadTasks = async (listId) => {
    if (!listId) return;
    try {
      setLoadingTasks(true);
      const data = await getTasks(listId);
      setTasks(data);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to fetch tasks', 'error');
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    loadTaskLists();
  }, []);

  useEffect(() => {
    if (selectedListId) {
      loadTasks(selectedListId);
    } else {
      setTasks([]);
    }
  }, [selectedListId]);

  const selectedList = useMemo(() => {
    return taskLists.find((l) => l.id === selectedListId) || null;
  }, [taskLists, selectedListId]);

  // List actions
  const handleSaveList = async (data) => {
    try {
      if (editingList) {
        const updated = await updateTaskList(editingList.id, { ...editingList, ...data });
        setTaskLists(taskLists.map((l) => (l.id === updated.id ? updated : l)));
        showToast('Task list updated!');
      } else {
        const created = await createTaskList(data);
        setTaskLists([...taskLists, created]);
        setSelectedListId(created.id);
        showToast('Task list created!');
      }
      setIsListModalOpen(false);
      setEditingList(null);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save task list', 'error');
    }
  };

  const handleDeleteList = async (listId) => {
    if (!confirm('Are you sure you want to delete this list and all its tasks?')) return;
    try {
      await deleteTaskList(listId);
      const remaining = taskLists.filter((l) => l.id !== listId);
      setTaskLists(remaining);
      if (selectedListId === listId) {
        setSelectedListId(remaining.length > 0 ? remaining[0].id : null);
      }
      showToast('Task list deleted');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete task list', 'error');
    }
  };

  // Task actions
  const handleSaveTask = async (data) => {
    if (!selectedListId) return;
    try {
      if (editingTask) {
        const updated = await updateTask(selectedListId, editingTask.id, {
          ...editingTask,
          ...data,
        });
        setTasks(tasks.map((t) => (t.id === updated.id ? updated : t)));
        showToast('Task updated!');
      } else {
        const created = await createTask(selectedListId, data);
        setTasks([...tasks, created]);
        showToast('Task created!');
      }
      setIsTaskModalOpen(false);
      setEditingTask(null);
      loadTaskLists();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save task', 'error');
    }
  };

  const handleToggleTaskStatus = async (task) => {
    if (!selectedListId) return;
    const newStatus = task.status === 'CLOSED' ? 'OPEN' : 'CLOSED';
    try {
      const updated = await updateTask(selectedListId, task.id, {
        ...task,
        status: newStatus,
      });
      setTasks(tasks.map((t) => (t.id === updated.id ? updated : t)));
      loadTaskLists();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update task status', 'error');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await deleteTask(selectedListId, taskId);
      setTasks(tasks.filter((t) => t.id !== taskId));
      showToast('Task deleted');
      loadTaskLists();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to delete task', 'error');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
      {/* Toast Alert */}
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
              <FolderKanban className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                TaskPulse
              </h1>
              <p className="text-xs text-slate-400 font-medium">React + JavaScript Frontend</p>
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
              <Plus className="w-4 h-4" />
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
                <Plus className="w-4 h-4" />
                <span>Add Task</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">
        <TaskListsSidebar
          taskLists={taskLists}
          selectedListId={selectedListId}
          onSelectList={setSelectedListId}
          onOpenCreateList={() => {
            setEditingList(null);
            setIsListModalOpen(true);
          }}
          onOpenEditList={(list) => {
            setEditingList(list);
            setIsListModalOpen(true);
          }}
          onDeleteList={handleDeleteList}
          loading={loadingLists}
        />

        <main className="flex-1 min-w-0">
          {selectedList ? (
            <TaskBoard
              selectedList={selectedList}
              tasks={tasks}
              loadingTasks={loadingTasks}
              onOpenCreateTask={() => {
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
              onOpenEditTask={(task) => {
                setEditingTask(task);
                setIsTaskModalOpen(true);
              }}
              onToggleStatus={handleToggleTaskStatus}
              onDeleteTask={handleDeleteTask}
            />
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto mb-4">
                <FolderKanban className="w-8 h-8" />
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
                <Plus className="w-4 h-4" />
                <span>Create New List</span>
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Modals */}
      {isListModalOpen && (
        <TaskListModal
          list={editingList}
          onClose={() => {
            setIsListModalOpen(false);
            setEditingList(null);
          }}
          onSave={handleSaveList}
        />
      )}

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


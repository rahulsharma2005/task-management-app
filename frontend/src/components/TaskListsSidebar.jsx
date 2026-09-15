import React from 'react';
import { Plus, Edit3, Trash2 } from 'lucide-react';

export default function TaskListsSidebar({
  taskLists,
  selectedListId,
  onSelectList,
  onOpenCreateList,
  onOpenEditList,
  onDeleteList,
  loading,
}) {
  return (
    <aside className="w-full md:w-80 flex-shrink-0">
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sticky top-24">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Task Lists ({taskLists.length})
          </h2>
          <button
            onClick={onOpenCreateList}
            className="p-1 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
            title="Create Task List"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="py-8 text-center text-sm text-slate-400">Loading lists...</div>
        ) : taskLists.length === 0 ? (
          <div className="text-center py-8 px-2 border-2 border-dashed border-slate-200 rounded-xl">
            <p className="text-sm text-slate-500 mb-3">No lists created yet.</p>
            <button
              onClick={onOpenCreateList}
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
                  onClick={() => onSelectList(list.id)}
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
                          onOpenEditList(list);
                        }}
                        className="p-1 hover:text-indigo-600 text-slate-400 rounded transition-colors"
                        title="Edit List"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteList(list.id);
                        }}
                        className="p-1 hover:text-rose-600 text-slate-400 rounded transition-colors"
                        title="Delete List"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
  );
}


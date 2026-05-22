import { useState, useEffect, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useAuth } from '../context/AuthContext';
import * as taskService from '../services/taskService';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const COLUMNS = [
  {
    id: 'pending',
    title: 'To Do',
    dotColor: 'bg-slate-400',
    lightBg: 'bg-slate-50',
    emptyIcon: (
      <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    dotColor: 'bg-blue-500',
    lightBg: 'bg-blue-50',
    emptyIcon: (
      <svg className="w-10 h-10 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: 'completed',
    title: 'Done',
    dotColor: 'bg-emerald-500',
    lightBg: 'bg-emerald-50',
    emptyIcon: (
      <svg className="w-10 h-10 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const Dashboard = () => {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [viewMode, setViewMode] = useState('board');

  const fetchTasks = useCallback(async () => {
    try {
      const data = await taskService.getTasks(token);
      setTasks(data);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = async (formData) => {
    setFormLoading(true);
    try {
      const newTask = await taskService.createTask(formData, token);
      setTasks((prev) => [newTask, ...prev]);
      setIsModalOpen(false);
      toast.success('Task created');
    } catch (error) {
      toast.error('Failed to create task');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateTask = async (formData) => {
    setFormLoading(true);
    try {
      const updated = await taskService.updateTask(editingTask._id, formData, token);
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
      setIsModalOpen(false);
      setEditingTask(null);
      toast.success('Task updated');
    } catch (error) {
      toast.error('Failed to update task');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await taskService.deleteTask(id, token);
      setTasks((prev) => prev.filter((t) => t._id !== id));
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const updated = await taskService.updateTask(id, { status: newStatus }, token);
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId;
    setTasks((prev) =>
      prev.map((t) => (t._id === draggableId ? { ...t, status: newStatus } : t))
    );

    try {
      await taskService.updateTask(draggableId, { status: newStatus }, token);
    } catch (error) {
      fetchTasks();
      toast.error('Failed to move task');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  };

  const getColumnTasks = (status) => filteredTasks.filter((t) => t.status === status);

  if (loading) return <><Navbar /><Loader /></>;

  const statCards = [
    {
      label: 'Total Tasks',
      value: stats.total,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      bgLight: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      borderColor: 'border-l-indigo-500',
    },
    {
      label: 'To Do',
      value: stats.pending,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgLight: 'bg-slate-100',
      textColor: 'text-slate-600',
      borderColor: 'border-l-slate-400',
    },
    {
      label: 'In Progress',
      value: stats.inProgress,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600',
      borderColor: 'border-l-blue-500',
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgLight: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      borderColor: 'border-l-emerald-500',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* === Page Header === */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1">Track and manage your tasks efficiently</p>
          </div>
          <button
            onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
            id="new-task-btn"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:from-primary-dark hover:to-secondary-dark cursor-pointer transition-all duration-300 active:scale-[0.98]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            New Task
          </button>
        </div>

        {/* === STATS SECTION === */}
        <section className="mb-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {statCards.map((stat) => (
              <div
                key={stat.label}
                className={`bg-white rounded-xl border border-slate-200 p-4 sm:p-5 border-l-4 ${stat.borderColor} card-hover`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${stat.bgLight} ${stat.textColor} flex items-center justify-center`}>
                    {stat.icon}
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* === TOOLBAR SECTION === */}
        <section className="mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            {/* Search bar */}
            <div className="relative mb-3">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                id="search-tasks"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks by title or description..."
                className="block w-full pl-11 pr-10 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Filters row */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {/* Priority Filter */}
                <div className="relative">
                  <select
                    id="filter-priority"
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="block pl-3 pr-9 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer appearance-none transition-colors"
                  >
                    <option value="all">All Priorities</option>
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>

                {/* Clear filters */}
                {(searchQuery || filterPriority !== 'all') && (
                  <button
                    onClick={() => { setSearchQuery(''); setFilterPriority('all'); }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-primary bg-primary/5 hover:bg-primary/10 cursor-pointer transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear
                  </button>
                )}
              </div>

              {/* View Toggle */}
              <div className="flex items-center rounded-lg border border-slate-300 overflow-hidden">
                <button
                  onClick={() => setViewMode('board')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold cursor-pointer transition-all ${
                    viewMode === 'board'
                      ? 'bg-primary text-white'
                      : 'bg-white text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  </svg>
                  Board
                </button>
                <div className="w-px h-6 bg-slate-300"></div>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold cursor-pointer transition-all ${
                    viewMode === 'list'
                      ? 'bg-primary text-white'
                      : 'bg-white text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  List
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* === KANBAN BOARD VIEW === */}
        {viewMode === 'board' ? (
          <section>
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                {COLUMNS.map((column) => {
                  const columnTasks = getColumnTasks(column.id);
                  return (
                    <div key={column.id} className="flex flex-col min-w-0">
                      {/* Column Header */}
                      <div className="flex items-center gap-2.5 mb-4">
                        <span className={`w-2.5 h-2.5 rounded-full ${column.dotColor}`}></span>
                        <h3 className="text-sm font-bold text-slate-800">{column.title}</h3>
                        <span className="ml-auto text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">
                          {columnTasks.length}
                        </span>
                      </div>

                      {/* Droppable Area */}
                      <Droppable droppableId={column.id}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`flex-1 rounded-xl p-3 min-h-[280px] transition-all duration-300 ${
                              snapshot.isDraggingOver
                                ? `${column.lightBg} border-2 border-dashed border-primary/30`
                                : 'bg-slate-100/60 border-2 border-dashed border-slate-200'
                            }`}
                          >
                            <div className="space-y-3">
                              {columnTasks.map((task, index) => (
                                <Draggable key={task._id} draggableId={task._id} index={index}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                    >
                                      <TaskCard
                                        task={task}
                                        onEdit={handleEdit}
                                        onDelete={handleDeleteTask}
                                        onStatusChange={handleStatusChange}
                                        isDragging={snapshot.isDragging}
                                      />
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                            </div>
                            {provided.placeholder}
                            {columnTasks.length === 0 && !snapshot.isDraggingOver && (
                              <div className="flex flex-col items-center justify-center h-full min-h-[220px] gap-3">
                                {column.emptyIcon}
                                <div className="text-center">
                                  <p className="text-sm font-medium text-slate-400">No tasks</p>
                                  <p className="text-xs text-slate-300 mt-0.5">Drag tasks here</p>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  );
                })}
              </div>
            </DragDropContext>
          </section>
        ) : (
          /* === LIST VIEW === */
          <section>
            {filteredTasks.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 sm:p-20 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-lg font-bold text-slate-800">No tasks found</p>
                <p className="text-sm text-slate-400 mt-1">Create a task to get started</p>
                <button
                  onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
                  className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold shadow-lg shadow-primary/25 cursor-pointer transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create your first task
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onEdit={handleEdit}
                    onDelete={handleDeleteTask}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingTask(null); }}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
      >
        <TaskForm
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          initialData={editingTask}
          loading={formLoading}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;

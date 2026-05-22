const priorityConfig = {
  low: {
    label: 'Low',
    dot: 'bg-emerald-400',
    badge: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60',
  },
  medium: {
    label: 'Medium',
    dot: 'bg-amber-400',
    badge: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200/60',
  },
  high: {
    label: 'High',
    dot: 'bg-red-400',
    badge: 'bg-red-50 text-red-700 ring-1 ring-red-200/60',
  },
};

const statusConfig = {
  'pending': {
    label: 'Pending',
    icon: '○',
    classes: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200/60',
  },
  'in-progress': {
    label: 'In Progress',
    icon: '◐',
    classes: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200/60',
  },
  'completed': {
    label: 'Completed',
    icon: '●',
    classes: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60',
  },
};

const TaskCard = ({ task, onEdit, onDelete, onStatusChange, isDragging }) => {
  const priority = priorityConfig[task.priority] || priorityConfig.medium;
  const status = statusConfig[task.status] || statusConfig.pending;

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <div
      className={`group bg-white rounded-xl border p-4 transition-all duration-300 ${
        isDragging
          ? 'shadow-xl shadow-primary/15 border-primary/30 ring-2 ring-primary/20 rotate-[2deg] scale-[1.02]'
          : 'border-slate-200/60 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/5'
      }`}
    >
      {/* Top row: Priority + Actions */}
      <div className="flex items-center justify-between mb-3">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${priority.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`}></span>
          {priority.label}
        </span>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-all duration-200 cursor-pointer"
            title="Edit task"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 cursor-pointer"
            title="Delete task"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className={`font-semibold text-sm leading-snug mb-1 ${
        task.status === 'completed'
          ? 'line-through text-slate-400'
          : 'text-slate-800'
      }`}>
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p className="text-slate-400 text-xs leading-relaxed mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Footer: Status + Due Date */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
        <button
          onClick={() => {
            const nextStatus = task.status === 'pending' ? 'in-progress' : task.status === 'in-progress' ? 'completed' : 'pending';
            onStatusChange(task._id, nextStatus);
          }}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium hover:opacity-80 transition-all duration-200 cursor-pointer ${status.classes}`}
          title="Click to change status"
        >
          <span className="text-[10px]">{status.icon}</span>
          {status.label}
        </button>

        {task.dueDate && (
          <span className={`inline-flex items-center gap-1 text-xs font-medium ${
            isOverdue ? 'text-red-500' : 'text-slate-400'
          }`}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(task.dueDate)}
            {isOverdue && (
              <span className="ml-1 text-[10px] font-bold uppercase tracking-wide text-red-500">Overdue</span>
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;

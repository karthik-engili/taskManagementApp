import { useState, useEffect } from 'react';

const TaskForm = ({ onSubmit, initialData, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        status: initialData.status || 'pending',
        priority: initialData.priority || 'medium',
        dueDate: initialData.dueDate ? initialData.dueDate.split('T')[0] : '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} id="task-form">
      {/* Title */}
      <div className="mb-5">
        <label htmlFor="task-title" className="block text-sm font-semibold text-slate-700 mb-2">
          Title <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="title"
          id="task-title"
          value={formData.title}
          onChange={handleChange}
          required
          className="block w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
          placeholder="What needs to be done?"
        />
      </div>

      {/* Description */}
      <div className="mb-5">
        <label htmlFor="task-description" className="block text-sm font-semibold text-slate-700 mb-2">
          Description
        </label>
        <textarea
          name="description"
          id="task-description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="block w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-none"
          placeholder="Add some details about this task..."
        />
      </div>

      {/* Status & Priority — side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div>
          <label htmlFor="task-status" className="block text-sm font-semibold text-slate-700 mb-2">
            Status
          </label>
          <div className="relative">
            <select
              name="status"
              id="task-status"
              value={formData.status}
              onChange={handleChange}
              className="block w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer appearance-none pr-10 transition-colors"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>
        </div>
        <div>
          <label htmlFor="task-priority" className="block text-sm font-semibold text-slate-700 mb-2">
            Priority
          </label>
          <div className="relative">
            <select
              name="priority"
              id="task-priority"
              value={formData.priority}
              onChange={handleChange}
              className="block w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer appearance-none pr-10 transition-colors"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>
        </div>
      </div>

      {/* Due Date */}
      <div className="mb-6">
        <label htmlFor="task-due-date" className="block text-sm font-semibold text-slate-700 mb-2">
          Due Date
        </label>
        <input
          type="date"
          name="dueDate"
          id="task-due-date"
          value={formData.dueDate}
          onChange={handleChange}
          className="block w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary cursor-pointer transition-colors"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        id="task-submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-sm shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:from-primary-dark hover:to-secondary-dark disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all duration-300 active:scale-[0.98]"
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Saving...
          </span>
        ) : initialData ? 'Update Task' : 'Create Task'}
      </button>
    </form>
  );
};

export default TaskForm;

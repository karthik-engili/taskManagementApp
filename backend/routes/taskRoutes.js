import express from 'express';
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// All task routes are protected
router.use(protect);

// POST /api/tasks & GET /api/tasks
router.route('/').post(createTask).get(getTasks);

// PUT /api/tasks/:id & DELETE /api/tasks/:id
router.route('/:id').put(updateTask).delete(deleteTask);

export default router;

const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  assignTask
} = require('../controllers/taskController');

const authMiddleware = require('../middleware/auth');
const { checkRole } = require('../middleware/roles');
const { auditTaskActions, auditTaskCreateActions, auditAssignment } = require('../middleware/audit');

router.use(authMiddleware);
// router.use(checkRole(['Admin'])); 

router.post('/', getTasks);

router.post('/create', auditTaskCreateActions, createTask)

router.put('/:id', auditTaskActions, updateTask)

router.post('/:id/delete', auditTaskActions, deleteTask);

router.put('/:id/assign', auditAssignment, assignTask);

module.exports = router;

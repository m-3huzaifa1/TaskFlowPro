const AuditLog = require('../model/AuditLog');
const Task = require('../model/Task');
const taskActions = {
  POST: 'TASK_CREATED',
  PUT: 'TASK_UPDATED',
  DELETE: 'TASK_DELETED'
};

async function auditTaskCreateActions(req, res, next) {
  const action = taskActions[req.method];

  if (action) {
    try {
      const logEntry = new AuditLog({
        userId: req.userId,
        action,
        details: {
          ...req.body,
          // taskId: req.params.id,
        }
      });
      await logEntry.save();
    } catch (err) {
      console.error('Failed to save audit log:', err);
      // optionally: return next(err);
    }
  }

  next();
}

async function auditTaskActions(req, res, next) {
  const action = taskActions[req.method];
  const task = await Task.findById(req.params.id);
  if (action) {
    try {
      const logEntry = new AuditLog({
        userId: req.userId,
        action,
        details: {
          title: task?.title,
          description: task?.description,
          dueDate: task?.dueDate,
          priority: task?.priority,          
          taskId: req.params.id,
        }
      });
      await logEntry.save();
    } catch (err) {
      console.error('Failed to save audit log:', err);
      // optionally: return next(err);
    }
  }

  next();
}

async function auditAssignment(req, res, next) {
  if (req.body.assignedTo) {
    try {
      const task = await Task.findById(req.params.id);
      const logEntry = new AuditLog({
        userId: req.userId,
        action: 'TASK_ASSIGNED',

        details: {
          title: task?.title,
          description: task?.description,
          dueDate: task?.dueDate,
          priority: task?.priority,
          newAssignee: req.body.assignedTo,
          taskId: req.params.id,
        }
      });
      await logEntry.save();
    } catch (err) {
      console.error('Failed to save assignment audit log:', err);
      // optionally: return next(err);
    }
  }

  next();
}

module.exports = {
  auditTaskActions,
  auditTaskCreateActions,
  auditAssignment,
  
};

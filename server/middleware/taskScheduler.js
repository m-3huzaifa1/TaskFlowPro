const cron = require('node-cron');
const Task = require('../model/Task');

const calculateNextDueDate = (date, recurrence) => {
  // Ensure valid date input
  if (!(date instanceof Date) || isNaN(date)) {
    throw new Error('Invalid initial due date');
  }

  const newDate = new Date(date);
  
  switch(recurrence) {
    case 'daily':
      newDate.setDate(newDate.getDate() + 1);
      break;
    case 'weekly':
      newDate.setDate(newDate.getDate() + 7);
      break;
    case 'monthly':
      newDate.setMonth(newDate.getMonth() + 1);
      break;
    default:
      throw new Error('Invalid recurrence pattern');
  }

  return newDate;
};

const scheduleRecurringTasks = () => {
  cron.schedule('0 0 * * *', async () => {
    try {
      const recurringTasks = await Task.find({
        recurrence: { $ne: 'none' },
        status: 'Done',
        dueDate: { $exists: true, $ne: null } // Ensure dueDate exists
      });

      for (const task of recurringTasks) {
        if (!task?.dueDate || !(task?.dueDate instanceof Date)) {
          console.error('Invalid due date for task:', task._id);
          continue;
        }

        const newDueDate = calculateNextDueDate(task?.dueDate, task?.recurrence);
        
        const newTask = new Task({
          ...task.toObject(),
          _id: undefined,
          status: 'Todo',
          dueDate: newDueDate,
          parentTask: task._id,
          createdAt: new Date()
        });

        await newTask.save();
      }
    } catch (error) {
      console.error('Recurring task error:', error);
    }
  });
};

module.exports = scheduleRecurringTasks;

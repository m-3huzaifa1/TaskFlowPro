const Notification = require('../model/Notification.js');
const Task = require('../model/Task');
const User = require('../model/user');
const io = require('../index.js')
const Server = require('../index.js')

// const reqIO = require('socket.io')(Server, {
//   cors: {
//     origin: ['http://localhost:3000'],
//     methods: ["GET", "POST"],
//     credentials: true
//   },
// });
// console.log(reqIO, '---------------', io)

// Create task
const createTask = async (req, res) => {
  try {
    const task = new Task({
      ...req.body
    });

    await task.save();
    const notify = new Notification({
      userId: req.userId,
      message: `New Task Created: ${task?.title}`,
      type: 'CREATION',
      relatedTask: task?._id,

    });
    await notify.save()
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getTasks = async (req, res) => {
  try {
    // console.log(JSON.stringify(req.query), JSON.stringify(req.body))
    const { filter, status, priority, dueDate, search } = req.query;
    const userId = req.userId;
    // console.log(userId, filter, status, priority, dueDate, search)
    const query = {};

    // Filter by task type
    switch (filter) {
      case 'my':
        query.assignedTo = userId;
        break;
      case 'created':
        query.createdBy = userId;
        break;
      case 'overdue':
        query.dueDate = { $lt: new Date() };//either time left and not done or 
        query.status = { $ne: 'Done' };
        break;
    }

    // Additional filters
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (dueDate) query.dueDate = { $lte: new Date(dueDate) };

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    const tasks = await Task.find(query)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ dueDate: 1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update task
const updateTask = async (req, res) => {
  try {
    console.log(req.userId)
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id},
      {
        $set: {
          status: req.body.status
        }
      },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    const notify = new Notification({
      userId: task?.assignedTo || req.userId,
      message: `Task Updated: ${task?.title}`,
      type: 'UPDATION',
      relatedTask: task?._id,

    });
    
    await notify.save()
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    
    const query = { _id: req.params.id };
    console.log(query)
    const task = await Task.findOneandDelete(query);

    if (!task) {
      await Task.deleteOne(query)
        .then((res)=>console.log('deleted'))
        .catch((err)=>res.status(404).json({ error: 'Task not found' }))  
    }
    
    const notify = new Notification({
      userId: req.userId,
      message: `Task Deleted: ${task?.title}`,
      type: 'DELETION',
      relatedTask: task?._id,

    });
    await notify.save()
    res.status(401).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Assign task
const assignTask = async (req, res) => {
  try {
    const { assignedTo } = req.body;
    // console.log(assignedTo, req.params.id)
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check if assignee exists
    const user = await User.findById(assignedTo);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const previousAssignee = task.assignedTo;

    task.assignedTo = assignedTo;
    await task.save();
    console.log(previousAssignee, task)

    // Create notification

    // await Notification.create({
    //   userId: assignedTo,
    //   message: `New task assigned: ${task.title}`,
    //   type: 'ASSIGNMENT',
    //   relatedTask: task._id,
    //   metadata: {
    //     assignedBy: req.user.userId,
    //     previousAssignee
    //   }
    // })
    // .then(res=>console.log(res,'Creating'))
    // .catch(err=>console.log(err))

    const notify = new Notification({
      userId: assignedTo,
      message: `New task assigned: ${task.title}`,
      type: 'ASSIGNMENT',
      relatedTask: task._id,

    });

    await notify.save()
      .then(res => console.log('Creating Notification----------------------------------------->'))
      .catch(err => console.log(err))

    // console.log('IO Instance:', io); // Should show Socket.io server instance
    // console.log('Room Members:', io.sockets.adapter.rooms);
    // Emit Socket.io event
    // if (reqIO == {} || reqIO === undefined || reqIO == { cleanupEmptyChildNamespaces: false }) {
    //    console.log(reqIO, 'REQIO')
    //   io.to(assignedTo).emit('taskAssigned', {
    //     userId: assignedTo,
    //     message: `New task assigned: ${task.title}`,
    //     dueDate: task.dueDate,
    //     assignedBy: req.user.name
    //   });

    // }
    // else {
    //   console.log(io, 'IO')

    //   reqIO.to(assignedTo).emit('taskAssigned', {
    //     userId: assignedTo,
    //     message: `New task assigned: ${task.title}`,
    //     dueDate: task.dueDate,
    //     assignedBy: req.user.name
    //   });

    // }

    // Return populated task data
    const populatedTask = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name');

    res.json(populatedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  assignTask
};

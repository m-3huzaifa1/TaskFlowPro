const Notification = require('../model/Notification.js');

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.userId})
      .sort('-createdAt')
      .populate('relatedTask', 'title dueDate');

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

const markAsRead = async (req, res) => {
  try {
    await Notification.deleteOne({_id: req.params.id});
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
};

const markAllRead = async (req, res) => {
  try {
    await Notification.deleteMany();
    res.json({ message: 'All Notification marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
};

module.exports = { getNotifications, markAsRead, markAllRead }
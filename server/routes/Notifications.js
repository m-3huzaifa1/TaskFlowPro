const router = require('express').Router()
const { getNotifications, markAsRead, markAllRead } = require('../controllers/notificationController.js')
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware)
router.get('/', getNotifications);
router.post('/:id/read', markAsRead);
router.post('/read', markAllRead);

module.exports = router;
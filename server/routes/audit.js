const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getAuditLogs } = require('../controllers/auditController');

router.use(authMiddleware);

router.post('/', getAuditLogs)

module.exports = router;
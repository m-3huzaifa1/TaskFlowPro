const AuditLog = require('../model/AuditLog');

async function getAuditLogs(req, res) {
  try {
    const logs = await AuditLog.find()
      .populate('userId', 'name email')
      .sort('-timestamp')
      .limit(100);

    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getAuditLogs
};

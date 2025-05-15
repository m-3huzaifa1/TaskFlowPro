const mongoose = require('mongoose');
const { Schema } = mongoose;

const auditLogSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['TASK_CREATED', 'TASK_UPDATED', 'TASK_DELETED', 'TASK_ASSIGNED']
  },
  // taskId: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'Task'
  // },
  details: {
    type: Schema.Types.Mixed
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);

const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  source: {
    type: String,
    required: true,
    enum: ['BACKEND', 'FRONTEND', 'SYSTEM', 'SECURITY'],
    default: 'BACKEND'
  },
  level: {
    type: String,
    required: true,
    enum: ['INFO', 'WARN', 'ERROR', 'CRITICAL', 'DEBUG'],
    default: 'INFO'
  },
  action: {
    type: String,
    required: true,
  },
  module: {
    type: String,
    required: true,
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
  },
  metadata: {
    ip: String,
    userAgent: String,
    path: String,
    method: String,
    statusCode: Number,
    responseTime: Number,
  },
  message: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

AuditLogSchema.index({ timestamp: -1 });
AuditLogSchema.index({ source: 1, level: 1 });
AuditLogSchema.index({ user: 1 });
AuditLogSchema.index({ action: 1 });

module.exports = mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);

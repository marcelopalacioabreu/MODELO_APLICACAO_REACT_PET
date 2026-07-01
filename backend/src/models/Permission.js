const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  group: {
    type: String, // ex: PETS, CLINICA, ADMIN
    required: true
  },
  module: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['CREATE', 'READ', 'UPDATE', 'DELETE', 'SPECIAL'],
    default: 'READ'
  },
  criticality: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'LOW'
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE'],
    default: 'ACTIVE'
  },
  functionality: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Functionality',
    default: null
  }
}, { timestamps: true });

PermissionSchema.index({ group: 1 });
PermissionSchema.index({ key: 1 });

module.exports = mongoose.models.Permission || mongoose.model('Permission', PermissionSchema);

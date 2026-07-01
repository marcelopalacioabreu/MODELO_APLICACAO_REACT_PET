const mongoose = require('mongoose');

const FunctionalitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true // ex: PET_MANAGEMENT, CLINIC_CORE
  },
  description: {
    type: String,
    trim: true
  },
  icon: {
    type: String,
    default: 'Box'
  },
  module: {
    type: String,
    required: true, // ex: SAUDE, ADMINISTRATIVO, PUBLICO
    uppercase: true
  },
  permissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Permission'
  }],
  menuItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isConfigurable: {
    type: Boolean,
    default: true
  },
  config: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { timestamps: true });

FunctionalitySchema.index({ key: 1 });
FunctionalitySchema.index({ module: 1 });

module.exports = mongoose.models.Functionality || mongoose.model('Functionality', FunctionalitySchema);

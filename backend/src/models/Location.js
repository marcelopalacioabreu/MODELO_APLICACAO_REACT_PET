const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome da unidade é obrigatório'],
    unique: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['TIPO_LOCAL_01', 'TIPO_LOCAL_02'],
    default: 'TIPO_LOCAL_01'
  },
  address: {
    street: String,
    number: String,
    neighborhood: String,
    city: { type: String, default: 'Juiz de Fora' },
    state: { type: String, default: 'MG' }
  },
  phone: String,
  email: String,
  isActive: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING'
  },
  day: {
    type: String, // YYYY-MM-DD
    required: true
  },
  floorPlanImage: {
    type: String
  },
  parentLocation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    default: null
  },
  networkSettings: {
    canViewParentStock: { type: Boolean, default: false },
    canRequestTransfer: { type: Boolean, default: true },
    requireApprovalForTransfer: { type: Boolean, default: false },
    allowParentToMonitorBeds: { type: Boolean, default: false },
    // Módulos Habilitados para esta Unidade
    enabledModules: {
      reception: { type: Boolean, default: true },
      pets: { type: Boolean, default: true },
      adoptions: { type: Boolean, default: true },
      tutores: { type: Boolean, default: true },
      inventory: { type: Boolean, default: true },
      clinical: { type: Boolean, default: false },
      triage: { type: Boolean, default: false },
      agenda: { type: Boolean, default: false },
      exams: { type: Boolean, default: false },
      hospitalization: { type: Boolean, default: false },
      hotel: { type: Boolean, default: false }
    },
    maxUsers: { type: Number, default: 5 }
  }
}, { timestamps: true });

LocationSchema.index({ name: 1 });
LocationSchema.index({ type: 1 });

module.exports = mongoose.models.Location || mongoose.model('Location', LocationSchema);

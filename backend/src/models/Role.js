const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome da função é obrigatório'],
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  icon: {
    type: String,
    default: 'ShieldCheck',
  },
  color: {
    type: String,
    default: '#006644',
  },
  level: {
    type: Number,
    default: 0,
  },
  permissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Permission'
  }],
  // Backup de chaves de permissão para performance em middlewares
  permissionKeys: {
    type: [String],
    default: [],
  },
  priority: {
    type: Number,
    default: 1,
  },
  scope: {
    type: String,
    enum: ['GLOBAL', 'UNIDADE', 'SETOR'],
    default: 'GLOBAL',
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE'],
    default: 'ACTIVE',
  },
}, { timestamps: true });

RoleSchema.index({ name: 1 });

module.exports = mongoose.models.Role || mongoose.model('Role', RoleSchema);

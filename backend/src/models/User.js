const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  cpf: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    required: [true, 'Nome é obrigatório']
  },
  password: {
    type: String,
    required: [true, 'Senha é obrigatória'],
    minlength: 6,
    select: false,
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
    required: true,
  },
  mustChangePassword: {
    type: Boolean,
    default: false,
  },
  tempPasswordDisplay: {
    type: String,
    select: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  unit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location'
  },
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
    hotel: { type: Boolean, default: false },
    network_monitoring: { type: Boolean, default: false }
  },
  lastAccess: {
    type: Date,
  },
  lastIp: {
    type: String,
  },
  currentSessionId: {
    type: String, // Para controle de sessão única global via Redis
    default: null
  }
}, {
  timestamps: true,
});

// Hash password before save
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);

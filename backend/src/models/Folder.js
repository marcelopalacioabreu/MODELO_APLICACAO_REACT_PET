const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome da pasta é obrigatório'],
    trim: true,
    unique: true
  },
  description: String,
  focalPoint: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  icon: {
    type: String,
    default: 'Folder'
  },
  color: {
    type: String,
    default: '#1e293b'
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE', 'ARCHIVED'],
    default: 'ACTIVE'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Folder', folderSchema);

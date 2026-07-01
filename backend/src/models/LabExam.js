const mongoose = require('mongoose');

const LabExamSchema = new mongoose.Schema({
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: [true, 'Animal é obrigatório']
  },
  tutor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tutor',
    required: [true, 'Tutor é obrigatório']
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location',
    required: [true, 'Unidade é obrigatória']
  },
  professional: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['IMAGEM', 'SANGUE', 'BIOPSIA', 'OUTRO'],
    default: 'SANGUE'
  },
  name: {
    type: String,
    required: [true, 'Nome do exame é obrigatório'],
    trim: true
  },
  status: {
    type: String,
    enum: ['REQUESTED', 'COLLECTED', 'ANALYZING', 'FINISHED', 'CANCELED'],
    default: 'REQUESTED'
  },
  result: {
    type: String,
    default: '' // Laudo textual
  },
  attachments: [{
    type: String // Caminhos dos arquivos no servidor
  }],
  day: {
    type: String, // YYYY-MM-DD
    required: true
  }
}, { timestamps: true });

LabExamSchema.index({ pet: 1, day: -1 });
LabExamSchema.index({ location: 1, status: 1 });

module.exports = mongoose.models.LabExam || mongoose.model('LabExam', LabExamSchema);

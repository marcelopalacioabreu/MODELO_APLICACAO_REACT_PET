const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Nome do produto é obrigatório'],
    trim: true
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  category: {
    type: String,
    enum: ['MEDICAMENTO', 'VACINA', 'INSUMO', 'ALIMENTACAO', 'HIGIENE', 'EQUIPAMENTO'],
    required: true
  },
  unitOfMeasure: {
    type: String,
    enum: ['UN', 'ML', 'MG', 'KG', 'COMPRIMIDO', 'FRASCO'],
    default: 'UN'
  },
  minStock: {
    type: Number,
    default: 0
  },
  description: String,
  price: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

ProductSchema.index({ name: 'text' });
ProductSchema.index({ category: 1 });

module.exports = mongoose.models.Product || mongoose.model('Product', ProductSchema);

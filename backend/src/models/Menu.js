const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String, // Nome do ícone (Lucide ou HeroIcons)
    default: 'Circle'
  },
  path: {
    type: String,
    required: true,
    trim: true
  },
  permission: {
    type: String, // Chave da permissão necessária
    default: null
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isHeader: {
    type: Boolean,
    default: false
  },
  children: [this] // Submenus (recursivo)
}, { timestamps: true });

const MenuSchema = new mongoose.Schema({
  name: {
    type: String, // ex: SIDEBAR_ADMIN, TUTOR_MENU
    required: true,
    unique: true
  },
  items: [MenuItemSchema]
}, { timestamps: true });

module.exports = mongoose.models.Menu || mongoose.model('Menu', MenuSchema);

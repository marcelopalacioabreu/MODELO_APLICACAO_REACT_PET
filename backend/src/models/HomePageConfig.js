const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  id: String, // ex: 'hero', 'forms', 'news'
  isVisible: { type: Boolean, default: true },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  content: { type: mongoose.Schema.Types.Mixed, default: {} }, // Dados específicos da seção
  order: { type: Number, default: 0 }
});

const homePageConfigSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'DEFAULT_HOME',
    unique: true
  },
  sections: [sectionSchema],
  header: {
    logoUrl: String,
    showLoginButton: { type: Boolean, default: true },
    showRegisterButton: { type: Boolean, default: true }
  },
  footer: {
    text: String,
    address: String,
    phone: String,
    links: [{ label: String, url: String }]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('HomePageConfig', homePageConfigSchema);

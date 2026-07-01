const AuditLog = require('../models/AuditLog');

/**
 * Registra um evento no sistema de auditoria de forma assíncrona
 * @param {Object} params - Dados do log
 */
const logger = async ({ 
  user = null, 
  source = 'BACKEND', 
  level = 'INFO', 
  action, 
  module, 
  details = {}, 
  metadata = {}, 
  message = '' 
}) => {
  try {
    const timestamp = new Date().toISOString();
    const emoji = level === 'ERROR' ? '❌' : (level === 'WARN' || level === 'SECURITY') ? '⚠️' : 'ℹ️';
    console.log(`${emoji} [${timestamp}] [${module}] ${action} ${message ? `- ${message}` : ''}`);

    await AuditLog.create({
      user,
      source,
      level,
      action,
      module,
      details,
      metadata,
      message,
      timestamp: new Date()
    });
  } catch (err) {
    console.error('ERRO CRÍTICO NO SISTEMA DE LOGS:', err);
  }
};

module.exports = logger;

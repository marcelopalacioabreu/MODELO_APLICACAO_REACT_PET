const logger = require('../utils/logger');

/**
 * Mapeamento Inteligente de Rotas para Ações Humanizadas (Aplicação Modelo)
 */
const getActionDescription = (method, url) => {
  if (url.includes('/auth/login')) return 'Realizou Login no Sistema';
  if (url.includes('/auth/me') && method === 'PUT') return 'Atualizou Perfil Próprio';
  
  // Pets
  if (url.includes('/pets') && method === 'POST') return 'Cadastrou Novo PET';
  if (url.includes('/pets') && method === 'PUT') return 'Atualizou Dados de um PET';
  if (url.includes('/pets') && method === 'DELETE') return 'Excluiu um PET do Sistema';

  // Tutores
  if (url.includes('/tutores') && method === 'POST') return 'Cadastrou Novo Tutor';

  // Prontuário e Clínica
  if (url.includes('/medical-records') && method === 'POST') return 'Criou Registro no Prontuário';

  // Fallback padrão amigável
  const actionMap = {
    'POST': 'Criou um novo registro',
    'PUT': 'Atualizou um registro',
    'DELETE': 'Excluiu um registro'
  };

  return `${actionMap[method] || 'Acessou'} no módulo ${url.split('/')[2] || 'Desconhecido'}`;
};

/**
 * Middleware de Auditoria Global de Elite
 */
const auditMiddleware = (req, res, next) => {
  const isMutation = ['POST', 'PUT', 'DELETE'].includes(req.method);
  const isAuth = req.originalUrl.includes('/auth/');
  
  if (!isMutation && !isAuth) {
    return next();
  }

  const start = Date.now();

  res.on('finish', () => {
    const responseTime = Date.now() - start;
    
    if (req.originalUrl.includes('/admin/logs') && req.method === 'GET') return;

    const pathParts = req.originalUrl.split('/');
    const module = pathParts[2] ? pathParts[2].toUpperCase() : 'CORE';

    let level = 'INFO';
    if (res.statusCode >= 400) level = 'WARN';
    if (res.statusCode >= 500) level = 'ERROR';
    if (isAuth && res.statusCode >= 400) level = 'SECURITY';

    const humanAction = getActionDescription(req.method, req.originalUrl);

    let details = {};
    if (['POST', 'PUT'].includes(req.method) && req.body) {
      details = { ...req.body };
      const sensitiveFields = ['password', 'token', 'secret', 'cpf', 'newPassword', 'oldPassword'];
      sensitiveFields.forEach(field => {
        if (details[field]) details[field] = '********';
      });
    }

    logger({
      user: req.user ? req.user.id || req.user._id : null,
      source: 'BACKEND',
      level: level === 'SECURITY' ? 'WARN' : level,
      action: humanAction,
      module: module,
      details: details,
      message: `Ação: ${humanAction} | Endpoint: ${req.originalUrl} | Status: ${res.statusCode}`,
      metadata: {
        ip: req.ip || req.headers['x-forwarded-for'],
        userAgent: req.get('user-agent'),
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        responseTime: responseTime
      }
    });
  });

  next();
};

module.exports = auditMiddleware;

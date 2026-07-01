const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');
const { getAsync } = require('../services/redisService');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('express-async-handler');

/**
 * Middleware de Proteção de Rota (JWT + Redis Session)
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ErrorResponse('Não autorizado. Token não fornecido.', 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Validação de Sessão Única via Redis
    if (decoded.user && decoded.user.sessionId) {
      const sessionKey = `active_session:${decoded.user.id}`;
      const activeSessionId = await getAsync(sessionKey);
      
      if (!activeSessionId) {
        console.warn(`⚠️ [Auth] Sessão não localizada no Redis: ${sessionKey}`);
        return next(new ErrorResponse('Sessão expirada. Faça login novamente.', 401));
      }

      if (activeSessionId !== decoded.user.sessionId) {
        console.warn(`⚠️ [Auth] Conflito de Sessão: Recebido ${decoded.user.sessionId} | Ativo no Redis: ${activeSessionId}`);
        return next(new ErrorResponse('Sessão invalidada por novo login em outro dispositivo.', 401));
      }
    }

    // Elite Strategy: Normalizar req.user.role para garantir filtros consistentes
    req.user = decoded.user;
    
    // Trava de Segurança Municipal: Verificar Status da Unidade
    if (req.user.unit) {
      const Location = require('../models/Location');
      const unit = await Location.findById(req.user.unit);
      
      // Elite Logic: Subunidades (com pai) herdam a confiança da Matriz
      const isSubUnit = !!unit?.parentLocation;

      if (!unit || (unit.status !== 'APPROVED' && !isSubUnit)) {
        return next(new ErrorResponse('Acesso bloqueado. Sua unidade aguarda aprovação ou foi desabilitada pela moderação municipal.', 403));
      }
    }

    // Garantir que role.name exista para os controllers (pet, tutor, etc)
    if (req.user.role) {
      if (typeof req.user.role === 'string') {
        const roleName = req.user.role;
        req.user.role = { name: roleName, permissions: req.user.permissions || [] };
      } else if (typeof req.user.role === 'object' && !req.user.role.name) {
        // Se for objeto mas não tem nome (ex: vindo do token simplificado), assumir a role guardada no token se houver
        req.user.role.name = req.user.roleName || 'UNKNOWN';
      }
    }

    next();
  } catch (error) {
    return next(new ErrorResponse('Não autorizado. Token inválido.', 401));
  }
});

/**
 * Middleware de Autorização Baseada em Permissões Dinâmicas
 * @param {...string} requiredPermissions - Lista de chaves de permissão
 */
const authorize = (...requiredPermissions) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      return next(new ErrorResponse('Acesso negado. Usuário não autenticado.', 403));
    }

    // Elite: Buscar a Role e suas permissões atualizadas no banco de dados
    // Isso garante que se o admin desabilitar uma permissão, ela tenha efeito imediato
    const userWithRole = await User.findById(req.user.id).populate('role');
    
    // Elite Shield: Prevenir crash se o usuário não possuir mais uma Role válida no BD
    if (!userWithRole || !userWithRole.role || !userWithRole.role.name) {
      return next(new ErrorResponse('Acesso negado. A sua conta não possui um perfil de acesso válido configurado.', 403));
    }

    const roleName = userWithRole.role.name.toUpperCase();
    const userPermissions = userWithRole.role.permissionKeys || [];

    // Bypass de Elite: ADMIN tem acesso total
    if (roleName === 'ADMIN' || roleName === 'SUPERADMIN') {
      return next();
    }

    const hasPermission = requiredPermissions.some(p => userPermissions.includes(p));

    if (!hasPermission) {
      return next(new ErrorResponse(`Acesso negado. Requer pelo menos uma destas permissões: ${requiredPermissions.join(', ')}`, 403));
    }

    next();
  });
};

module.exports = { protect, authorize };

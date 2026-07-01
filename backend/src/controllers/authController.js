const User = require('../models/User');
const Role = require('../models/Role');
const Permission = require('../models/Permission');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { setAsync, delAsync } = require('../services/redisService');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('express-async-handler');
const moment = require('moment-timezone');

// Função auxiliar para enviar resposta com token
const sendTokenResponse = async (user, statusCode, res) => {
  const sessionId = crypto.randomUUID();
  await setAsync(`active_session:${user._id}`, sessionId, 24 * 60 * 60);

  const populatedUser = await User.findById(user._id).populate({
    path: 'role',
    populate: { path: 'permissions' }
  });

  const payload = {
    user: {
      id: user._id,
      name: user.name,
      mustChangePassword: populatedUser?.mustChangePassword,
      unit: user.unit, // Elite: Injetando Unidade no Token
      role: {
        id: populatedUser?.role?._id,
        name: populatedUser?.role?.name,
        permissions: populatedUser?.role?.permissionKeys || populatedUser?.role?.permissions?.map(p => p.key) || []
      },
      sessionId: sessionId
    }
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });

  const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRE
  });

  res.status(statusCode).json({
    success: true,
    token,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      role: populatedUser?.role?.name || 'UNKNOWN',
      permissions: payload.user.role.permissions,
      mustChangePassword: populatedUser?.mustChangePassword
    }
  });
};

// @desc    Autenticar usuário e obter token
const login = asyncHandler(async (req, res, next) => {
  const { cpf, email, password } = req.body;

  let query = {};
  
  // Elite Strategy: Identificador Universal (Detectar se o 'email' é na verdade um CPF)
  const identifier = (email || cpf || '').trim();
  const isCpf = /^\d+$/.test(identifier) && (identifier.length === 11 || identifier.length === 14);

  if (isCpf) {
    query.cpf = identifier;
  } else if (identifier.includes('@')) {
    query.email = identifier.toLowerCase();
  } else {
    // Tenta CPF por padrão se não houver @ e for apenas números
    if (/^\d+$/.test(identifier)) query.cpf = identifier;
    else query.email = identifier.toLowerCase();
  }

  const user = await User.findOne(query).select('+password');

  if (!user) return next(new ErrorResponse('Credenciais inválidas', 401));

  const isMatch = await user.matchPassword(password);
  if (!isMatch) return next(new ErrorResponse('Credenciais inválidas', 401));

  if (!user.isActive) return next(new ErrorResponse('Usuário inativo', 403));

  // Elite Strategy: Validar status da Unidade se o usuário for de uma clínica/ONG
  if (user.unit) {
    const Location = require('../models/Location');
    const unit = await Location.findById(user.unit);
    
    // Se não for Matriz (não tem pai) e não estiver aprovada, bloqueia. 
    // Subunidades (têm pai) herdam a confiança da Matriz.
    const isSubUnit = !!unit?.parentLocation;
    
    if (!unit || (unit.status !== 'APPROVED' && !isSubUnit)) {
      return next(new ErrorResponse('Acesso negado. Sua unidade ainda não foi homologada pela moderação municipal.', 403));
    }
  }

  sendTokenResponse(user, 200, res);
});

// @desc    Registrar Unidade Parceira (Clínica/ONG) e Administrador (Público)
// @route   POST /api/auth/register-unit
const registerUnit = asyncHandler(async (req, res, next) => {
  const { 
    unitName, unitType, cnpj, street, number, neighborhood, city, state,
    adminName, email, cpf, password, confirmPassword, phone 
  } = req.body;

  // 0. Validar Confirmação de Senha
  if (password !== confirmPassword) {
    return next(new ErrorResponse('As senhas digitadas não conferem', 400));
  }

  // 1. Verificar se usuário já existe
  const userExists = await User.findOne({ $or: [{ email }, { cpf }] });
  if (userExists) {
    return next(new ErrorResponse('Administrador (CPF ou E-mail) já cadastrado no sistema', 400));
  }

  // 2. Buscar a role de UNIT_ADMIN
  const unitRole = await Role.findOne({ name: 'UNIT_ADMIN' });
  if (!unitRole) return next(new ErrorResponse('Role de Administrador de Unidade não configurada', 500));

  // 3. Criar a Unidade (Location)
  const Location = require('../models/Location');
  const unit = await Location.create({
    name: unitName,
    type: unitType || 'CLINICA',
    address: { street, number, neighborhood, city, state: state || 'MG' },
    isActive: true,
    day: moment().tz('America/Sao_Paulo').format('YYYY-MM-DD') // Elite: Integridade de Data Civil
  });

  // 4. Criar o Usuário Administrador vinculado à unidade
  const user = await User.create({
    name: adminName,
    cpf,
    email,
    password,
    phone,
    role: unitRole._id,
    unit: unit._id // Elite: Vínculo organizacional
  });

  // 5. Atualizar a unidade com o administrador principal (opcional, mas bom para auditoria)
  unit.manager = user._id;
  await unit.save();

  res.status(201).json({
    success: true,
    message: 'Solicitação de credenciamento enviada com sucesso! Sua unidade agora passará pela moderação municipal. Você poderá realizar o login assim que for homologado.'
  });
});

// @desc    Logout / Encerrar Sessão
const logout = asyncHandler(async (req, res, next) => {
  if (req.user) await delAsync(`active_session:${req.user.id}`);
  res.clearCookie('token');
  res.status(200).json({ success: true, message: 'Logout realizado com sucesso' });
});

// @desc    Obter dados do usuário logado
const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate({
    path: 'role',
    populate: { path: 'permissions' }
  });

  if (!user) return next(new ErrorResponse('Usuário não localizado', 404));

  res.status(200).json({ 
    success: true, 
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      cpf: user.cpf,
      phone: user.phone,
      unit: user.unit, // Elite: Unidade retornada no getMe
      role: user.role?.name || 'UNKNOWN',
      roleName: user.role?.name || 'UNKNOWN',
      mustChangePassword: user.mustChangePassword,
      permissions: user.role?.permissionKeys || user.role?.permissions?.map(p => p.key) || []
    } 
  });
});

// @desc    Atualizar perfil do próprio usuário
// @route   PUT /api/auth/profile
const updateProfile = asyncHandler(async (req, res, next) => {
  const { name, email, password, phone } = req.body;
  const user = await User.findById(req.user.id);

  if (name) user.name = name;
  if (email) user.email = email;
  if (phone) user.phone = phone;
  if (password) {
    user.password = password;
    user.mustChangePassword = false; // Elite: Troca realizada com sucesso
  }

  await user.save();

  res.status(200).json({ success: true, data: user });
});

// @desc    Trocar senha do usuário (Obrigatório ou Voluntário)
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  if (!user) {
    return next(new ErrorResponse('Usuário não localizado', 404));
  }

  // Se não for troca obrigatória, validar a senha antiga
  if (!user.mustChangePassword) {
    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
      return next(new ErrorResponse('Senha atual incorreta', 400));
    }
  }

  // Definir nova senha. O hook pre-save fará o hash.
  user.password = newPassword;
  user.mustChangePassword = false;
  user.tempPasswordDisplay = undefined;

  await user.save();

  res.status(200).json({ success: true, message: 'Senha atualizada com sucesso' });
});

// @desc    Obter histórico de alterações da própria conta
// @route   GET /api/auth/profile/history
const getProfileHistory = asyncHandler(async (req, res) => {
  const AuditLog = require('../models/AuditLog');
  const logs = await AuditLog.find({ user: req.user.id })
    .sort({ timestamp: -1 })
    .limit(20);

  res.status(200).json({ success: true, data: logs });
});

module.exports = {
  login,
  logout,
  getMe,
  registerUnit,
  updateProfile,
  changePassword,
  getProfileHistory
};

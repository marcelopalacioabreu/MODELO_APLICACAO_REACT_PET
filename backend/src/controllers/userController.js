const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('express-async-handler');
const crypto = require('crypto');

// @desc    Listar todos os usuários
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().populate('role');
  res.status(200).json({ success: true, count: users.length, data: users });
});

// @desc    Criar novo usuário (Profissional ou Admin)
// @route   POST /api/users
// @access  Private/Admin
const createUser = asyncHandler(async (req, res, next) => {
  const { name, cpf, email, password, roleId } = req.body;

  const user = await User.create({
    name,
    cpf,
    email,
    password,
    role: roleId
  });

  res.status(201).json({ success: true, data: user });
});

// @desc    Atualizar status do usuário (Ativar/Inativar)
// @route   PUT /api/users/:id/status
// @access  Private/Admin
const updateUserStatus = asyncHandler(async (req, res, next) => {
  const { isActive } = req.body;

  if (req.params.id === req.user.id) {
    return next(new ErrorResponse('Você não pode inativar seu próprio acesso', 400));
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive },
    { new: true }
  );

  res.status(200).json({ success: true, data: user });
});

// @desc    Resetar senha do usuário (Padrão CRM-EMTEC)
// @route   POST /api/users/:id/reset-password
// @access  Private/Admin
const resetUserPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ErrorResponse('Usuário não localizado', 404));

  // Geração de senha provisória randômica
  const tempPassword = crypto.randomBytes(4).toString('hex'); // 8 caracteres hex
  
  user.password = tempPassword;
  user.mustChangePassword = true;
  user.tempPasswordDisplay = tempPassword; // Paridade CRM-EMTEC
  user.isActive = true;
  await user.save();

  res.status(200).json({ 
    success: true, 
    message: 'Senha resetada com sucesso',
    tempPassword 
  });
});

// @desc    Criar usuário para unidade da rede vinculada
// @route   POST /api/users/network
const createNetworkUser = asyncHandler(async (req, res, next) => {
  const { name, cpf, email, password, unitId, authorityLevel } = req.body;
  const Location = require('../models/Location');
  const Role = require('../models/Role');

  // 1. Validação de Hierarquia
  const targetUnit = await Location.findById(unitId);
  if (!targetUnit) return next(new ErrorResponse('Unidade de destino não localizada.', 404));

  const isSelfUnit = req.user.unit?.toString() === unitId.toString();
  const isChildUnit = targetUnit.parentLocation?.toString() === req.user.unit?.toString();
  const isAdmin = req.user.role?.name === 'ADMIN' || req.user.role === 'ADMIN';

  if (!isSelfUnit && !isChildUnit && !isAdmin) {
    return next(new ErrorResponse('Acesso negado. Você só pode criar usuários para sua rede.', 403));
  }

  // 2. Resolução Automática de Role (Inteligência de Elite)
  // Se for MANAGER -> UNIT_ADMIN
  // Se for OPERATOR -> Procura um perfil operacional ou usa UNIT_ADMIN (menus filtrarão)
  let roleName = authorityLevel === 'MANAGER' ? 'UNIT_ADMIN' : 'UNIT_ADMIN'; 
  
  // No futuro, se houver um perfil estritamente OPERADOR, mudamos aqui. 
  // Por enquanto, UNIT_ADMIN é o template perfeito pois o menuController já filtra os módulos.
  
  const role = await Role.findOne({ name: roleName });
  if (!role) return next(new ErrorResponse(`Perfil ${roleName} não configurado no sistema.`, 500));

  const user = await User.create({
    name,
    cpf,
    email,
    password,
    role: role._id,
    unit: unitId,
    enabledModules: req.body.enabledModules || targetUnit.networkSettings?.enabledModules, // Herda da unidade se não for enviado
    isActive: true
  });

  res.status(201).json({ success: true, data: user });
});

// @desc    Atualizar operador da rede vinculada
// @route   PUT /api/users/network/:id
const updateNetworkUser = asyncHandler(async (req, res, next) => {
  const { enabledModules, authorityLevel } = req.body;
  const Role = require('../models/Role');
  
  let user = await User.findById(req.params.id);
  if (!user) return next(new ErrorResponse('Operador não encontrado', 404));

  // Resolver Role se a autoridade mudou
  if (authorityLevel) {
    const roleName = authorityLevel === 'MANAGER' ? 'UNIT_ADMIN' : 'UNIT_ADMIN';
    const role = await Role.findOne({ name: roleName });
    if (role) user.role = role._id;
  }

  if (enabledModules) user.enabledModules = enabledModules;

  await user.save();
  res.status(200).json({ success: true, data: user });
});

module.exports = {
  getUsers,
  createUser,
  createNetworkUser,
  updateNetworkUser,
  updateUserStatus,
  resetUserPassword
};

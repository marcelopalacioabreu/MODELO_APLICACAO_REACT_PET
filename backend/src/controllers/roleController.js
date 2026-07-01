const Role = require('../models/Role');
const Permission = require('../models/Permission');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('express-async-handler');

// @desc    Listar todas as funções
// @route   GET /api/roles
// @access  Private/Admin
const getRoles = asyncHandler(async (req, res) => {
  const roles = await Role.find().populate('permissions');
  res.status(200).json({ success: true, count: roles.length, data: roles });
});

// @desc    Atualizar permissões de uma função
// @route   PUT /api/roles/:id/permissions
// @access  Private/Admin
const updateRolePermissions = asyncHandler(async (req, res, next) => {
  const { permissionIds } = req.body;

  // Buscar as chaves técnicas das permissões para denormalização (performance)
  const permissions = await Permission.find({ _id: { $in: permissionIds } });
  const permissionKeys = permissions.map(p => p.key);

  const role = await Role.findByIdAndUpdate(
    req.params.id,
    { 
      permissions: permissionIds,
      permissionKeys: permissionKeys
    },
    { new: true, runValidators: true }
  ).populate('permissions');

  if (!role) {
    return next(new ErrorResponse('Função não encontrada', 404));
  }

  res.status(200).json({ success: true, data: role });
});

module.exports = {
  getRoles,
  updateRolePermissions
};

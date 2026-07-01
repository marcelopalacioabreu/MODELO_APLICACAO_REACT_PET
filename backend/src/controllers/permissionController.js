const Permission = require('../models/Permission');
const Functionality = require('../models/Functionality');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('express-async-handler');

// @desc    Listar todas as permissões
// @route   GET /api/permissions
// @access  Private/Admin
const getPermissions = asyncHandler(async (req, res) => {
  const permissions = await Permission.find().populate('functionality');
  res.status(200).json({ success: true, count: permissions.length, data: permissions });
});

// @desc    Criar nova permissão vinculada a uma funcionalidade
// @route   POST /api/permissions
// @access  Private/Admin
const createPermission = asyncHandler(async (req, res, next) => {
  const { name, key, group, module, category, criticality, functionalityId } = req.body;

  // Se vinculada a uma funcionalidade, validar existência
  if (functionalityId) {
    const func = await Functionality.findById(functionalityId);
    if (!func) return next(new ErrorResponse('Funcionalidade não encontrada', 404));
  }

  const permission = await Permission.create({
    name,
    key: key.toLowerCase().trim(),
    group,
    module,
    category,
    criticality,
    functionality: functionalityId
  });

  // Se vinculada, atualizar a funcionalidade
  if (functionalityId) {
    await Functionality.findByIdAndUpdate(functionalityId, {
      $push: { permissions: permission._id }
    });
  }

  res.status(201).json({ success: true, data: permission });
});

module.exports = {
  getPermissions,
  createPermission
};

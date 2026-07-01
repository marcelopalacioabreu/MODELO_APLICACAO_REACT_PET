const Functionality = require('../models/Functionality');
const asyncHandler = require('express-async-handler');

// @desc    Listar todas as funcionalidades e suas permissões vinculadas
// @route   GET /api/admin/functionalities
// @access  Private/Admin
const getFunctionalities = asyncHandler(async (req, res) => {
  const functionalities = await Functionality.find().populate('permissions');
  res.status(200).json({ success: true, data: functionalities });
});

module.exports = { getFunctionalities };

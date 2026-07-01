const Location = require('../models/Location');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('express-async-handler');
const moment = require('moment-timezone');

// @desc    Listar todas as unidades
// @route   GET /api/locations
// @access  Private
const getLocations = asyncHandler(async (req, res) => {
  const locations = await Location.find({ isActive: true }).sort({ name: 1 });
  res.status(200).json({ success: true, count: locations.length, data: locations });
});

// @desc    Criar nova unidade (Clínica/Canil)
// @route   POST /api/locations
// @access  Private
const createLocation = asyncHandler(async (req, res, next) => {
  const { name, type, address, phone, email, parentLocation, networkSettings } = req.body;

  const exists = await Location.findOne({ name });
  if (exists) return next(new ErrorResponse('Uma unidade com este nome já existe', 400));

  const location = await Location.create({
    name,
    type,
    address,
    phone,
    email,
    parentLocation,
    networkSettings,
    day: moment().tz('America/Sao_Paulo').format('YYYY-MM-DD')
  });

  res.status(201).json({ success: true, data: location });
});

// @desc    Atualizar unidade
// @route   PUT /api/locations/:id
// @access  Private
const updateLocation = asyncHandler(async (req, res, next) => {
  let location = await Location.findById(req.params.id);
  if (!location) return next(new ErrorResponse('Unidade não encontrada', 404));

  location = await Location.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, data: location });
});

// @desc    Excluir unidade (Inativação Lógica)
// @route   DELETE /api/locations/:id
// @access  Private
const deleteLocation = asyncHandler(async (req, res, next) => {
  const location = await Location.findById(req.params.id);
  if (!location) return next(new ErrorResponse('Unidade não encontrada', 404));

  // Verificar se há estoque vinculado antes de inativar (Opcional, mas seguro)
  location.isActive = false;
  await location.save();

  res.status(200).json({ success: true, message: 'Unidade inativada com sucesso' });
});

// @desc    Atualizar status de moderação da unidade (ADMIN Municipal)
// @route   PUT /api/locations/:id/status
const updateLocationStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const location = await Location.findById(req.params.id);

  if (!location) return next(new ErrorResponse('Unidade não encontrada', 404));

  location.status = status;
  await location.save();

  res.status(200).json({ success: true, data: location });
});

// @desc    Buscar unidade específica
// @route   GET /api/locations/:id
const getLocation = asyncHandler(async (req, res, next) => {
  const location = await Location.findById(req.params.id);
  if (!location) return next(new ErrorResponse('Unidade não encontrada', 404));
  res.status(200).json({ success: true, data: location });
});

// @desc    Upload de planta baixa
// @route   PUT /api/locations/:id/floor-plan
const uploadFloorPlan = asyncHandler(async (req, res, next) => {
  const location = await Location.findById(req.params.id);
  if (!location) return next(new ErrorResponse('Unidade não encontrada', 404));

  if (!req.file) return next(new ErrorResponse('Por favor, selecione um arquivo de imagem', 400));

  location.floorPlanImage = `/uploads/locations/${req.file.filename}`;
  await location.save();

  res.status(200).json({ success: true, data: location });
});

// @desc    Obter rede vinculada (Círculo de Confiança Logístico)
// @route   GET /api/locations/my-network
const getMyNetwork = asyncHandler(async (req, res, next) => {
  const userUnitId = req.user.unit;
  const isAdmin = req.user.role?.name === 'ADMIN' || req.user.role === 'ADMIN';

  // Se não tem unidade mas é ADMIN Master, vê tudo
  if (!userUnitId && isAdmin) {
    const all = await Location.find({ isActive: true }).sort({ name: 1 });
    return res.status(200).json({ success: true, count: all.length, data: all });
  }

  // Se não tem unidade e não é admin master, erro
  if (!userUnitId) {
    return next(new ErrorResponse('Usuário sem vínculo organizacional ativo.', 400));
  }

  const myUnit = await Location.findById(userUnitId);
  if (!myUnit) return next(new ErrorResponse('Sua unidade de vínculo não foi localizada.', 404));

  // Círculo de Confiança (Estrito):
  const networkQuery = {
    $or: [
      { _id: userUnitId }, // Eu mesmo
      { parentLocation: userUnitId }, // Minhas filhas
    ],
    isActive: true
  };

  // Se eu sou uma filha, também vejo meu pai e meus irmãos
  if (myUnit.parentLocation) {
    networkQuery.$or.push({ _id: myUnit.parentLocation }); // Meu pai
    networkQuery.$or.push({ parentLocation: myUnit.parentLocation }); // Meus irmãos
  }

  const network = await Location.find(networkQuery).sort({ name: 1 });

  res.status(200).json({ 
    success: true, 
    count: network.length, 
    data: network 
  });
});

module.exports = {
  getLocations,
  getMyNetwork,
  createLocation,
  updateLocation,
  deleteLocation,
  updateLocationStatus,
  getLocation,
  uploadFloorPlan
};

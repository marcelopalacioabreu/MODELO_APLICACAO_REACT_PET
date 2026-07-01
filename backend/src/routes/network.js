const express = require('express');
const router = express.Router();
const { getMyNetwork, updateLocation } = require('../controllers/locationController');
const { createNetworkUser, updateNetworkUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

// Orquestração de Rede (Gestores de Unidade podem gerenciar suas vinculadas)
router.get('/my-network', authorize('units.view', 'units.manage', 'admin.all'), getMyNetwork);
router.get('/unit/:unitId/users', authorize('units.manage', 'admin.all'), async (req, res) => {
  const User = require('../models/User');
  const users = await User.find({ unit: req.params.unitId }).populate('role');
  res.status(200).json({ success: true, data: users });
});
router.post('/users', authorize('units.manage', 'admin.all'), createNetworkUser);
router.put('/users/:id', authorize('units.manage', 'admin.all'), updateNetworkUser);
router.put('/unit/:id/settings', authorize('units.manage', 'admin.all'), updateLocation);

module.exports = router;

const express = require('express');
const router = express.Router();
const { 
  getLocations, 
  getMyNetwork,
  createLocation, 
  updateLocation, 
  deleteLocation, 
  updateLocationStatus, 
  getLocation, 
  uploadFloorPlan 
} = require('../controllers/locationController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(protect);

router.get('/my-network', getMyNetwork);
router.get('/', getLocations); // Visualização básica permitida para todos logados
router.get('/:id', getLocation);
router.post('/', authorize('location.manage', 'units.manage', 'admin.all'), createLocation);
router.put('/:id', authorize('location.manage', 'units.manage', 'admin.all'), updateLocation);
router.put('/:id/floor-plan', authorize('hotel.layout.manage', 'admin.all'), upload.single('floorPlan'), uploadFloorPlan);
router.put('/:id/status', authorize('location.manage', 'admin.all'), updateLocationStatus);
router.delete('/:id', authorize('location.manage', 'admin.all'), deleteLocation);

module.exports = router;

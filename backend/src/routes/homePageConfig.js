const express = require('express');
const router = express.Router();
const { getHomeConfig, updateHomeConfig } = require('../controllers/homePageConfigController');
const { protect, authorize } = require('../middleware/authMiddleware');

// GET é público para renderizar a Landing Page
router.get('/', getHomeConfig);

// PUT é protegido apenas para gestores municipais
router.put('/', protect, authorize('admin.all'), updateHomeConfig);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getMenu } = require('../controllers/menuController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:name', protect, getMenu);

module.exports = router;

const express = require('express');
const router = express.Router();
const { login, logout, getMe, registerTutorPublic, registerUnit, updateProfile, changePassword, getProfileHistory } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', login);
router.post('/register-unit', registerUnit);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.get('/profile/history', protect, getProfileHistory);

module.exports = router;

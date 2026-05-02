const router = require('express').Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { getProfile, createOrUpdateProfile } = require('../controllers/userController');

router.get('/profile', verifyToken, getProfile);
router.post('/profile', verifyToken, createOrUpdateProfile);

module.exports = router;

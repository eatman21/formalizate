const router = require('express').Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { register, login } = require('../controllers/authController');

router.post('/register', verifyToken, register);
router.post('/login', verifyToken, login);

module.exports = router;

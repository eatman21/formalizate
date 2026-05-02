const router = require('express').Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { getSteps, getUserProgress, updateStepProgress } = require('../controllers/stepController');

router.get('/', getSteps);
router.get('/progress', verifyToken, getUserProgress);
router.put('/progress/:stepId', verifyToken, updateStepProgress);

module.exports = router;

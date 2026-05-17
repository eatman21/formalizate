const router = require('express').Router();
const { verifyToken } = require('../middleware/authMiddleware');
const requireRole = require('../middleware/requireRole');
const {
  getVacancies,
  getVacancy,
  getMyVacancies,
  createVacancy,
  updateVacancy,
  deleteVacancy,
} = require('../controllers/vacancyController');

router.get('/', getVacancies);
router.get('/mine', verifyToken, requireRole('employer', 'admin'), getMyVacancies);
router.get('/:id', getVacancy);
router.post('/', verifyToken, requireRole('employer', 'admin'), createVacancy);
router.put('/:id', verifyToken, requireRole('employer', 'admin'), updateVacancy);
router.delete('/:id', verifyToken, requireRole('employer', 'admin'), deleteVacancy);

module.exports = router;

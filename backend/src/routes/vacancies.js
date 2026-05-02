const router = require('express').Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
  getVacancies,
  getVacancy,
  getMyVacancies,
  createVacancy,
  updateVacancy,
  deleteVacancy,
} = require('../controllers/vacancyController');

router.get('/', getVacancies);
router.get('/mine', verifyToken, getMyVacancies);
router.get('/:id', getVacancy);
router.post('/', verifyToken, createVacancy);
router.put('/:id', verifyToken, updateVacancy);
router.delete('/:id', verifyToken, deleteVacancy);

module.exports = router;

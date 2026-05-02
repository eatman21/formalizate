const router = require('express').Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
  applyToVacancy,
  getMyApplications,
  getVacancyApplications,
  updateApplicationStatus,
} = require('../controllers/applicationController');

router.post('/', verifyToken, applyToVacancy);
router.get('/mine', verifyToken, getMyApplications);
router.get('/vacancy/:vacancyId', verifyToken, getVacancyApplications);
router.put('/:id/status', verifyToken, updateApplicationStatus);

module.exports = router;

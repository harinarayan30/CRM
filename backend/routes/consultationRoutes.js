const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../config/multer');
const {
  getConsultations,
  getConsultation,
  createConsultation,
  updateConsultation,
  deleteConsultation,
  getAnalytics,
} = require('../controllers/consultationController');

// Analytics must be before /:id
router.get('/analytics/summary', protect, getAnalytics);

router
  .route('/')
  .get(protect, getConsultations)
  .post(protect, upload.single('recording'), createConsultation);

router
  .route('/:id')
  .get(protect, getConsultation)
  .put(protect, upload.single('recording'), updateConsultation)
  .delete(protect, deleteConsultation);

module.exports = router;

const express = require('express');

const {
  getDentists,
  getDentist,
  createDentist,
  updateDentist,
  deleteDentist,
} = require('../controllers/dentists');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Logged-in users can view dentists
router.get('/', protect, getDentists);
router.get('/:id', protect, getDentist);

// Admin can manage dentists
router.post('/', protect, authorize('admin'), createDentist);
router.put('/:id', protect, authorize('admin'), updateDentist);
router.delete('/:id', protect, authorize('admin'), deleteDentist);

module.exports = router;

const express = require('express');

const {
  getBookings,
  getMyBooking,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
} = require('../controllers/bookings');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// User
router.post('/', protect, createBooking);
router.get('/me', protect, getMyBooking);
router.get('/:id', protect, getBooking);
router.put('/:id', protect, updateBooking);
router.delete('/:id', protect, deleteBooking);

// Admin
router.get('/', protect, authorize('admin'), getBookings);

module.exports = router;

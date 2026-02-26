const express = require('express');
const router = express.Router();

const Booking = require('../models/Booking');
const { protect, authorize } = require('../middleware/auth');

const {
  getBookings,     // admin GET /
  getMyBooking,    // user GET /me
  getBooking,      // (optional) GET /:id owner/admin
  createBooking,   // user POST /
  updateBooking,   // owner/admin PUT /:id
  deleteBooking,   // owner/admin DELETE /:id
} = require('../controllers/bookings');

// helper: โหลด booking ของ user แล้ว set req.params.id
const setMyBookingId = async (req, res, next) => {
  try {
    const booking = await Booking.findOne({ user: req.user.id });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'No booking found for this user' });
    }
    req.params.id = booking._id.toString();
    next();
  } catch (err) {
    console.log(err.stack);
    return res.status(500).json({ success: false, message: 'Cannot fetch booking' });
  }
};

// ✅ USER
router.post('/', protect, createBooking);

router.get('/me', protect, getMyBooking);

// ทำให้ /me PUT/DELETE ใช้ controller เดิมได้
router.put('/me', protect, setMyBookingId, updateBooking);
router.delete('/me', protect, setMyBookingId, deleteBooking);

// ✅ ADMIN
router.get('/', protect, authorize('admin'), getBookings);

// (optional) owner/admin ดูรายตัว
router.get('/:id', protect, getBooking);

// owner/admin แก้/ลบรายตัว
router.put('/:id', protect, updateBooking);
router.delete('/:id', protect, deleteBooking);

module.exports = router;
const Booking = require('../models/Booking');
const Dentist = require('../models/Dentist');

//@desc Get all bookings (admin)
//@route GET /api/v1/bookings
//@access Private (admin)
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate({ path: 'dentist', select: 'name yearsOfExperience areaOfExpertise' })
      .populate({ path: 'user', select: 'name email telephone role' })
      .sort('-createdAt');

    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ success: false, message: 'Cannot fetch bookings' });
  }
};

//@desc Get my booking (user)
//@route GET /api/v1/bookings/me
//@access Private
exports.getMyBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ user: req.user.id }).populate({
      path: 'dentist',
      select: 'name yearsOfExperience areaOfExpertise',
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'No booking found for this user' });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ success: false, message: 'Cannot fetch booking' });
  }
};

//@desc Get single booking by id (owner or admin)
//@route GET /api/v1/bookings/:id
//@access Private
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate({
      path: 'dentist',
      select: 'name yearsOfExperience areaOfExpertise',
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: `No booking with id ${req.params.id}` });
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ success: false, message: `User ${req.user.id} is not authorized to view this booking` });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ success: false, message: 'Cannot fetch booking' });
  }
};

//@desc Create booking (ONE session per user)
//@route POST /api/v1/bookings
//@access Private
exports.createBooking = async (req, res) => {
  try {
    const { dentist: dentistId, date } = req.body;

    if (!dentistId || !date) {
      return res.status(400).json({ success: false, message: 'Please provide dentist and date' });
    }

    const dentist = await Dentist.findById(dentistId);
    if (!dentist) {
      return res.status(404).json({ success: false, message: `No dentist with id ${dentistId}` });
    }

    // Non-admin users can have ONLY ONE booking
    if (req.user.role !== 'admin') {
      const existed = await Booking.findOne({ user: req.user.id });
      if (existed) {
        return res.status(409).json({
          success: false,
          message: `The user with ID ${req.user.id} already has a booking. Only one session is allowed.`,
        });
      }
    }

    const booking = await Booking.create({
      dentist: dentistId,
      date,
      user: req.user.id,
    });

    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    // Handle unique index violation (ONE booking per user)
    if (err && err.code === 11000) {
      return res.status(409).json({ success: false, message: 'Only one booking per user is allowed.' });
    }
    console.log(err.stack);
    res.status(500).json({ success: false, message: 'Cannot create booking' });
  }
};

//@desc Update booking (owner or admin)
//@route PUT /api/v1/bookings/:id
//@access Private
exports.updateBooking = async (req, res) => {
  try {
    let booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: `No booking with id ${req.params.id}` });
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ success: false, message: `User ${req.user.id} is not authorized to update this booking` });
    }

    // If changing dentist, ensure it exists
    if (req.body.dentist) {
      const dentist = await Dentist.findById(req.body.dentist);
      if (!dentist) {
        return res.status(404).json({ success: false, message: `No dentist with id ${req.body.dentist}` });
      }
    }

    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate({
      path: 'dentist',
      select: 'name yearsOfExperience areaOfExpertise',
    });

    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ success: false, message: 'Cannot update booking' });
  }
};

//@desc Delete booking (owner or admin)
//@route DELETE /api/v1/bookings/:id
//@access Private
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: `No booking with id ${req.params.id}` });
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ success: false, message: `User ${req.user.id} is not authorized to delete this booking` });
    }

    await booking.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ success: false, message: 'Cannot delete booking' });
  }
};

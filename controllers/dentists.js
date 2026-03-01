const Dentist = require('../models/Dentist');

//@desc Get all dentists
//@route GET /api/v1/dentists
//@access Private (logged-in users)
exports.getDentists = async (req, res) => {
  try {
    const dentists = await Dentist.find().sort('-createdAt');
    res.status(200).json({ success: true, count: dentists.length, data: dentists });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ success: false, message: 'Cannot fetch dentists' });
  }
};

//@desc Get single dentist
//@route GET /api/v1/dentists/:id
//@access Private (logged-in users)
exports.getDentist = async (req, res) => {
  try {
    const dentist = await Dentist.findById(req.params.id);
    if (!dentist) {
      return res.status(404).json({ success: false, message: `No dentist with id ${req.params.id}` });
    }
    res.status(200).json({ success: true, data: dentist });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ success: false, message: 'Cannot fetch dentist' });
  }
};

//@desc Create dentist
//@route POST /api/v1/dentists
//@access Private (admin)
exports.createDentist = async (req, res) => {
  try {
    const dentist = await Dentist.create(req.body);
    res.status(201).json({ success: true, data: dentist });
  } catch (err) {
    console.log(err.stack);
    res.status(400).json({ success: false, message: 'Cannot create dentist' });
  }
};

//@desc Update dentist
//@route PUT /api/v1/dentists/:id
//@access Private (admin)
exports.updateDentist = async (req, res) => {
  try {
    const dentist = await Dentist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!dentist) {
      return res.status(404).json({ success: false, message: `No dentist with id ${req.params.id}` });
    }
    res.status(200).json({ success: true, data: dentist });
  } catch (err) {
    console.log(err.stack);
    res.status(400).json({ success: false, message: 'Cannot update dentist' });
  }
};

//@desc Delete dentist
//@route DELETE /api/v1/dentists/:id
//@access Private (admin)
exports.deleteDentist = async (req, res) => {
  try {
    const dentist = await Dentist.findById(req.params.id);
    if (!dentist) {
      return res.status(404).json({ success: false, message: `No dentist with id ${req.params.id}` });
    }
    await dentist.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({ success: false, message: 'Cannot delete dentist' });
  }
};

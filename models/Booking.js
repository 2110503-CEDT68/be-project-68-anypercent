//เปลี่ยนจากhospitalเป็นdentist
//เปลี่ยนAppointmentเป็นBooking

const mongoose = require('mongoose');

const Dentist = require('./Dentist');
const { create } = require('./User');

const BookingSchema=new mongoose.Schema({
    bookingDate: {
        type: Date,
        required:[true,'Please add a booking date']
    },
    user:{
        type: mongoose.Schema.ObjectId,
        ref:'User',
        required:[true, 'Booking must belong to a user']
    },
    dentist:{
        type:mongoose.Schema.ObjectId,
        ref: 'Dentist',
        required:[true, 'Booking must have a dentist']
    },
    createAt: {
        type: Date,
        default: Date.now
    } 
});

module.exports=mongoose.model('Booking',BookingSchema);
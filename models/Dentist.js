//เพิ่ม areaOfExpertise,yearsOfExperience
//เปลี่ยนจาก Hospital เป็น Dentist

const mongoose = require('mongoose');

const DentistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        trim:true,
        maxlength:[50,'Name can not be more than 50 character']
    },
    //หมอนี้ทำไรบ้าง จัดฟัน อุดฟัน บลาๆๆๆ
    areaOfExpertise:{
        type: String,
        required: [true,'Please add an areaOfExpertise'],
        enum: [
            'อุดฟัน', 
            'ถอนฟัน', 
            'จัดฟัน', 
            'ขูดหินปูน', 
            'ศัลยกรรมช่องปาก'
        ]
    },
    //จำนวนปีที่ทำงาน
    yearsOfExperience:{
        type: Number,
        required: [true,'Please add an yearsOfExperience'],
    }
},{
    toJSON: {virtuals:true},
    toObject:{virtuals:true}
});

//Reverse populate with virtuals
//เปลี่ยนเป็น Dentist 
DentistSchema.virtual('bookings',{
    ref: 'Booking',
    localField: '_id',
    foreignField:'dentist',
    justOne:false
});

module.exports=mongoose.model('Dentist',DentistSchema);
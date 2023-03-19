
const mongoose = require('mongoose');
const validator = require('validator');


const otpSchema = new mongoose.Schema({
    mobile: {
        type: String,
        required: [true, 'Please enter Mobile Number']
    },
    code: {
        type: Number
    }


})



let model = mongoose.model('Otp', otpSchema);

module.exports = model;
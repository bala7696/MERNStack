const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter name']
    },
    email: {
        type: String,
        required: [true, 'Please enter email'],
        unique: true, //  it will allow only the unique email in table otherwise it will return error
        validate: [validator.isEmail, 'Please enter valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please enter password'],
        maxlength: [6, 'Password cannot exceed 6 characters'],
        select: false  /*if select is false then always password parameter will not be sent to the response
        whenever we try to fetch in find method that time we need to pass select('+password')
        for reference refer login API in authController */
    },
    avatar: {
        type: String,
    },
    role: {
        type: String,
        default: 'user'
    },
    resetPasswordToken: String,
    resetPasswordTokenExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
})

/* To encrypt pass and store into data base we should use 'npm i bcrypt' lib.
as getting error for this lib due to github restriction, commented the below code
*/
// userSchema.pre('save', function (next) {
// if (!this.isModified('password')) {
//     next();
// }
//   this.password = await bcrypt.hash(this.password,10)
// })

userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET, { /* 
    this is random key. we can put any static key in our project.
     (here we took from https://randomkeygen.com/)   */

        expiresIn: process.env.JWT_EXPIRES_TIME
    })
}

userSchema.methods.isValidPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)

}

userSchema.methods.getResetToken = function () {
    // Generate Token

    const token = crypto.randomBytes(20).toString('hex'); /* the crypto lib is used to generate the random token.
    20 is the size(length) of buffer data. after that we are converting the 
    generated buffer data into string in hexa decimal encoding format.   */

    // Generate hash and set to resetPasswordToken 
    this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');/* 
    we are generating the hash format in sha256 algorithm for more secure.
     and passing our created hex token and using digest method for hex encoding type.
     and setting to the value of created token to resetPasswordToken in user collection
     */

    // Set token expire time 
    this.resetPasswordTokenExpire = Date.now() + 30 * 60 * 1000; // 30mins 
    return token
}


let model = mongoose.model('User', userSchema);

module.exports = model;
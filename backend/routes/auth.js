const express = require('express');
const multer = require('multer');
const path = require('path')

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, path.join(__dirname, '..', 'uploads/user'))
        },
        filename: function (req, file, callback) {
            callback(null, file.originalname)
        }
    })
})

const {
    registerUser,
    loginuser,
    logoutUser,
    forgotPassword,
    resetPassword,
    getUserProfile,
    changePassword,
    updateProfile,
    getAllUser,
    getUser,
    updateUser,
    deleteUser,
    otpVerification
} = require('../controllers/authController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate');
const router = express.Router();

router.route('/register').post(upload.single('avatar'), registerUser); // in register api we will send binary data of avatar.so we use the multer package to store that avatar into uploads folder 
router.route('/login').post(loginuser);
router.route('/logout').get(logoutUser);
router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').post(resetPassword);
router.route('/otpverify').post(otpVerification);
router.route('/password/change').put(isAuthenticatedUser, changePassword);
router.route('/myprofile').get(isAuthenticatedUser, getUserProfile);
router.route('/update').put(isAuthenticatedUser, upload.single('avatar'), updateProfile);

// Admin Routes

router.route('/admin/users').get(isAuthenticatedUser, authorizeRoles('admin'), getAllUser);
router.route('/admin/user/:id')
    .get(isAuthenticatedUser, authorizeRoles('admin'), getUser)
    .put(isAuthenticatedUser, authorizeRoles('admin'), updateUser)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUser)


module.exports = router;
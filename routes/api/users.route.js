// Define routes for user APIs.
const express = require('express');
const router = express.Router();
const userMiddleware = require('../../middleware/user.middleware');
const authMiddleware = require('../../middleware/auth.middleware');

// Get user controller instance.
const userController = require('../../controllers/user.controller');

// Middlewares are used.
router.post('/signup', userMiddleware.validateSignupData, userController.signup);

router.post('/signin', userController.signin);

router.get('/verify-email/:token', userController.verifyemail);

router.get('/verify-link/:token', userController.verifylink);

router.post('/forgotPwd', userController.forgotpwd);

router.post('/reset-password', authMiddleware.verifyToken, userController.resetpassword);

// Export the router.
module.exports = router;
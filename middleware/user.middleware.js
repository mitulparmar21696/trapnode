// Load user model.
const User = require('../models/user.model');
const sendResponse = require('../modules/response.helper');

// A middleware to check if posted signup data is valid or not.
exports.validateSignupData = function (req, res, next) {
    User.findOne({'email': req.body.email, 'status': 1}, function (err, user) {
        if (err) {
            return sendResponse.sendJsonResponse(req, res, 201, err, "1", "error");
        } else {
            console.log(user);
            // Send an error response if a user with this email already exists.
            if (user) {
                return sendResponse.sendJsonResponse(req, res, 201, "", "1", "User already exists.");
            } else {
                // All ok. Move forward.
                next();
            }
        }
    });
};

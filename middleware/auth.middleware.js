// Load user model.
const User = require('../models/user.model');
const sendResponse = require('../modules/response.helper');

exports.verifyToken = function (req, res, next) {
    User.findOne({'_id': req.body.id, 'accessToken': req.headers.accessToken, 'status': 1}, function (err, user) {
        // Handle internal server error.
        if (err) {
            return sendResponse.sendJsonResponse(req, res, 201, err, "1", "error");
        } else {
            if (user.length > 0) {
                // move to next
                next();
            } else {
                return sendResponse.sendJsonResponse(req, res, 201, "", "1", "You are not authorized user.");
            }
        }
    });
};
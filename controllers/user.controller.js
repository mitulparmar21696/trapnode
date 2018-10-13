// Access user service.
const userService = require('../services/user.service');
var mailer = require('../modules/mailer.helper');
var constants = require('../modules/constants');
const sendResponse = require('../modules/response.helper');

var async = require('async');
// Load the full build.
var _ = require('lodash');

exports.signup = async function (req, res, callback) {

    // Get posted request data for the user sign up.    
    var user = {
        firstName: req.body.firstName,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        type: req.body.type
    };

    try {
        var token = "";
        // Create a new user account using user service object.
        var createdUser = await userService.signup(user);
//        if (createdUser != null) {
//            token = createdUser.verificationToken;
//        }
//        /******* mail code *******/
//
//        var templateVariable = {
//            templateURL: "mail_template/registration",
//            fullName: req.body.fullname,
//            token: token,
//            BASE_URL: req.session.baseUrl,
//            layout: 'email'
//        };
//
//        var mailParamsObject = {
//            templateVariable: templateVariable,
//            to: req.body.email,
//            subject: "Registration Successful."
//        };
//        mailer.sendMail(req, res, mailParamsObject, function (err) {
//            if (err) {
//                return sendResponse.sendJsonResponse(req, res, 201, err, "1", "error");
//            } else {
//                return sendResponse.sendJsonResponse(req, res, 200, createdUser, "0", "success");
//            }
//        });
        return sendResponse.sendJsonResponse(req, res, 200, createdUser, "0", "success");
        /******** mail code *******/

    } catch (exception) {
        return sendResponse.sendJsonResponse(req, res, 201, exception, "1", "error");
    }
};


exports.signin = async function (req, res, next) {

    // Get posted request data for the user sign in.
    var user = {
        email: req.body.email.toLowerCase()        
    };
       
    try {
        // Create a new user account using user service object.
        var userSignInChk = await userService.signinData(user);        
        if (userSignInChk !== null) {
            var userData = await userService.chkSignIn(userSignInChk, req.body.password , req.body.deviceToken);
            if (userData.error == 0) {
                return sendResponse.sendJsonResponse(req, res, 200, userData, "0", "User signed in successfully.");
            } else {
                return sendResponse.sendJsonResponse(req, res, 201, "", "1", userData.msg);
            }
        } else {
            return sendResponse.sendJsonResponse(req, res, 201, "", "1", "User not found.");
        }
    } catch (exception) {
        console.log(exception);
        return sendResponse.sendJsonResponse(req, res, 201, exception, "1", "error");
    }
};

exports.verifyemail = async function (req, res, callback) {

    var token = req.params.token;
    try {
        // Create a new user account using user service object.
        var checkToken = await userService.checkToken(token);
        //var updateToken = await userService.updateToken(checkToken);

        if (checkToken != null) {
            if (checkToken.emailVerified == true) {
                res.redirect('/get-started?msg=This Email is already verified');
//                return res.status(201)
//                        .json({
//                            status: 201,
//                            data: "already",
//                            message: "This Email is already verified.",
//                            error: 0
//                        });
            } else {

                var updateToken = await userService.updateToken(checkToken);
                if (updateToken.n == 1) {
                    req.flash('messages', 'Email verification successful');
                    res.redirect('/reset-password/' + token);
//                    return res.status(201)
//                            .json({
//                                status: 201,
//                                data: "success",
//                                message: "Email verification successful.",
//                                error: 0
//                            });
                } else {
                    res.redirect('/get-started?msg=Email verification failed');
//                    return res.status(201)
//                            .json({
//                                status: 201,
//                                data: "failed",
//                                message: "Email verification failed.",
//                                error: 0
//                            });
                }
            }
        } else {
            res.redirect('/get-started?msg=Invalid email verification token');
//            return res.status(201)
//                    .json({
//                        status: 201,
//                        data: "failed",
//                        message: "Invalid email verification token.",
//                        error: 0
//                    });
        }
    } catch (exception) {
        res.redirect('/get-started?msg=Email verification failed. Something went wrong');
        // Return an error response with code and message.
//        return res.status(500)
//                .json({
//                    status: 500,
//                    message: "Email verification failed. Something went wrong."
//                });
    }
};

exports.forgotpwd = async function (req, res, next) {

    // Get posted request data for the user sign in.        
    var email = req.body.email;

    try {
        // Create a new user account using user service object.
        var emailChk = await userService.forgotpwd(email);

        if (emailChk != null) {
            if (emailChk.emailVerified == true) {
                if (emailChk.isActive == true) {

                    var updateTokenPwd = await userService.updateTokenPwd(emailChk.id);
                    if (updateTokenPwd.response == 1) {
                        var userData = await userService.userData(emailChk.id);
                        /******* mail code *******/

                        var templateVariable = {
                            templateURL: "mail_template/forgot_password",
                            token: updateTokenPwd.token,
                            reset_url: req.protocol + '://' + (req.subdomains[0] === undefined ? '' : req.subdomains[0] + '.') + constants.DYNAMIC_URL,
                            BASE_URL: constants.BASE_URL,
                            fullname: userData.fullName,
                            layout: 'email'
                        };

                        var mailParamsObject = {
                            templateVariable: templateVariable,
                            to: req.body.email,
                            subject: "Reset Password"
                        };
                        mailer.sendMail(req, res, mailParamsObject, function (err) {
                            if (err) {
                                return res.status(201)
                                        .json({
                                            status: 201,
                                            data: "failed",
                                            message: "Mail not sent.",
                                            error: 1
                                        });
                            } else {
                                return res.status(200)
                                        .json({
                                            status: 200,
                                            data: "success",
                                            message: "Mail sent successfully.",
                                            error: 0
                                        });
                            }
                        });

                        /******** mail code *******/
                    } else {
                        return res.status(201)
                                .json({
                                    status: 201,
                                    data: "failed",
                                    message: "Something went wrong , try again!!!",
                                    error: 1
                                });
                    }
                } else {
                    return res.status(201)
                            .json({
                                status: 201,
                                data: "failed",
                                message: "You are current not active user.",
                                error: 1
                            });
                }
            } else {
                return res.status(201)
                        .json({
                            status: 201,
                            data: "failed",
                            message: "Please first verify your email.",
                            error: 1
                        });
            }
        } else {
            return res.status(201)
                    .json({
                        status: 201,
                        data: "failed",
                        message: "This user doesn't exist, please enter existing user.",
                        error: 1
                    });
        }
    } catch (exception) {
        // Return an error response with code and message.
        return res.status(500)
                .json({
                    status: 500,
                    message: "User sign in failed. Something went wrong."
                });
    }
}

exports.verifylink = async function (req, res, next) {

    var token = req.params.token;

    try {
        // Create a new user account using user service object.
        var checkLink = await userService.checkLink(token);

        if (checkLink != null) {
            return res.status(200)
                    .json({
                        status: 200,
                        data: "success",
                        message: "Link Valid",
                        error: 0
                    });
        } else {
            return res.status(201)
                    .json({
                        status: 201,
                        data: "failed",
                        message: "Link Invalid",
                        error: 0
                    });
        }
    } catch (exception) {
        // Return an error response with code and message.
        return res.status(500)
                .json({
                    status: 500,
                    message: "Link Invalid"
                });
    }
}

exports.resetpassword = async function (req, res, next) {

    var token = req.body.token;
    var password = req.body.password;

    try {
        // Create a new user account using user service object.            
        var updatePassword = await userService.updatePassword(token, password);

        if (updatePassword.n == 1) {
            return res.status(200)
                    .json({
                        status: 200,
                        data: "success",
                        message: "Password updated successfully.",
                        error: 0
                    });
        } else {
            return res.status(201)
                    .json({
                        status: 201,
                        data: "failed",
                        message: "Password not updated.",
                        error: 1
                    });
        }

    } catch (exception) {
        // Return an error response with code and message.
        return res.status(500)
                .json({
                    status: 500,
                    message: "Password not updated. Something went wrong."
                });
    }
}
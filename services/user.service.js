// Get User model.
const user = require('../models/user.model');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

exports.signup = async function (users) {

    var newUser = new user({
        firstName: users.firstName,
        phone: users.phone,
        email: users.email.toLowerCase(),
        password: await genPassHash(users.password),
        type: users.type,
        emailVerified: false,
        verificationToken: await genRandomString(5),
        status: 1
    });

    try {
        // Save user.
        var savedUser = await newUser.save();
        return savedUser;
    } catch (exception) {        
        // return an error message describing the reason.
        return "error";
    }
}

// Generates a password hash.
async function genPassHash(plainTextPassword) {
    const saltRounds = 10;
    const passHash = await bcrypt.hash(plainTextPassword, saltRounds);
    return passHash;
}

// Generates a random string.
async function genRandomString(length) {

    var text = "";
    var characterSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for (var i = 0; i < length; i++) {
        text += await characterSet.charAt(Math.floor(Math.random() * characterSet.length));
    }

    return Date.now() + text;
}
;

exports.signinData = async function (userData) {

    try {
        // check user.
        var checkedUser = await user.findOne({'email': userData.email}, 'firstName phone type email emailVerified password status');
        return checkedUser;
    } catch (exception) {
        // return an error message describing the reason.
        throw Error("Error while getting data");
    }
}

exports.chkSignIn = async function (result, password, deviceToken) {
    try {
        var accessToken = await genRandomString(5);
        var obj = {};
        if (result.status != 1) {
            obj.error = 1;
            obj.msg = "Your account is inactive. Please contact administrator.";
            return obj;
        }

        if (result != null) {
            if (result.emailVerified != false) {
                if (result.status != 0) {

                    /* compare the password */
                    if (bcrypt.compareSync(password, result.password) === true) {
                        var addDToken = await user.update({_id: result.id}, {$set: {deviceToken: deviceToken}});
                        if (addDToken.nModified == 1) {
                            var addAToken = await user.update({_id: result.id}, {$set: {accessToken: accessToken}});
                            if (addAToken.nModified == 1) {
                                obj.error = 0;
                                obj.id = result.id;
                                obj.email = result.email;
                                obj.firstName = result.firstName;
                                obj.phone = result.phone;
                                obj.emailVerified = result.emailVerified;
                                obj.status = result.status;
                                obj.type = result.type;
                                obj.accessToken = accessToken;
                                return obj;
                            } else {
                                obj.error = 1;
                                obj.msg = "Access token not updated.";
                                return obj;
                            }
                        } else {
                            obj.error = 1;
                            obj.msg = "Device token not updated.";
                            return obj;
                        }
                    } else {
                        obj.error = 1;
                        obj.msg = "Invalid Password";
                        return obj;
                    }
                } else {
                    obj.error = 1;
                    obj.msg = "User in not activated";
                    return obj;
                }
            } else {
                obj.error = 1;
                obj.msg = "Email not verified";
                return obj;
            }
        } else {
            obj.error = 1;
            obj.msg = "User doesn't exist";
            return obj;
        }

    } catch (exception) {
        console.log(exception)
        // return an error message describing the reason.
        throw Error("Error while creating user");
    }
}

exports.checkToken = async function (token) {

    try {
        // check user.
        var checkToken = await User.findOne({'verificationToken': token, isDeleted: false});
        return checkToken;
    } catch (exception) {
        // return an error message describing the reason.
        throw Error("Error while checking token");
    }
};

exports.updateToken = async function (id) {

    try {

        var obj = {};
        var checkToken = await User.update({_id: id, }, {$set: {emailVerified: true}});
        return checkToken;
    } catch (exception) {
        // return an error message describing the reason.
        throw Error("Error while updating email");
    }
}

exports.forgotpwd = async function (email) {

    try {
        // check user.
        var checkEmail = await User.findOne({'email': email}, 'id emailVerified isActive');
        return checkEmail;
    } catch (exception) {
        // return an error message describing the reason.
        throw Error("Error while checking email");
    }
}

exports.updateTokenPwd = async function (id) {

    try {
        var newToken = await genRandomString(5);
        var obj = {};
        var updateToken = await User.update({_id: id, }, {$set: {verificationToken: newToken}});
        if (updateToken != null) {
            obj.token = newToken;
            obj.response = updateToken.n;
            return obj;
        } else {
            return obj;
        }
    } catch (exception) {
        // return an error message describing the reason.
        throw Error("Error while updating email");
    }
}

exports.checkLink = async function (token) {

    try {
        // check user.
        var checkToken = await User.findOne({'verificationToken': token}, 'id');
        return checkToken;
    } catch (exception) {
        // return an error message describing the reason.
        throw Error("Error while checking token");
    }
}

exports.updatePassword = async function (token, password) {

    try {

        var password = await genPassHash(password);
        var newToken = await genRandomString(5);
        var updatePassword = await User.update({verificationToken: token, }, {$set: {password: password}});
        var updateToken = await User.update({verificationToken: token, }, {$set: {verificationToken: newToken}});
        return updateToken;
    } catch (exception) {
        // return an error message describing the reason.
        throw Error("Error while updating email");
    }
}
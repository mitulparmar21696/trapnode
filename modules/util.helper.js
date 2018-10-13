var exports = module.exports = {};

exports.genRandomString = function (length) {

    var text = "";
    var characterSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    for (var i = 0; i < length; i++) {
        text += characterSet.charAt(Math.floor(Math.random() * characterSet.length));
    }

    return Date.now() + text;
}
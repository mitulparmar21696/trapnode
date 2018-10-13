var sendMail = function (req, res, mailParamsObject, callback) {

    if (mailParamsObject.attachments) {
        var mailerOptions = {
            to: mailParamsObject.to,
            subject: mailParamsObject.subject,
            attachments: mailParamsObject.attachments
        };
    } else {
        var mailerOptions = {
            to: mailParamsObject.to,
            subject: mailParamsObject.subject
        };
    }

    var templateVariable = mailParamsObject.templateVariable;

    var finalMailerOptions = JSON.parse((JSON.stringify(mailerOptions) + JSON.stringify(templateVariable)).replace(/}{/g, ","))
    var template = mailParamsObject.templateVariable.templateURL;
    req.app.mailer.send(template, finalMailerOptions, function (err) {
        if (err) {
            callback(err);
        } else {
            callback(null);
        }
    });
}
exports.sendMail = sendMail;
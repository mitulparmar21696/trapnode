var sendJsonResponse = function (req, res, statusCode, data, error, flagMsg) {
    res.writeHead(statusCode, {'Content-Type': 'application/json'});
    res.write(JSON.stringify({
        status: statusCode,
        data: data,
        error: error,
        message: flagMsg
    }));
    res.end();
};

module.exports.sendJsonResponse = sendJsonResponse;
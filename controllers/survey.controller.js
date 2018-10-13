const surveyService = require('../services/survey.service');
/* controllers */
var async = require('async');
var mongoose = require('mongoose');
// Load the full build.
const Survey = require("../models/survey.model");
var _ = require('lodash');
var moment = require('moment');
// Gets all surveys in the system.
exports.getAll = async function (req, res, next) {
    try {
        var surveys = await surveyService.getAll();

        return res.status(200)
                .json({
                    surveys: surveys,
                });
    } catch (exception) {
        // In case of error/exception return error response with status code.
        return res.status(500)
                .json({
                    message: "Failed to get survey data."
                });
    }
}
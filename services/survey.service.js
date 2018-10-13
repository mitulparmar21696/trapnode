const Survey = require("../models/survey.model");
var mongoose = require('mongoose');
// Load the full build.
var _ = require('lodash');

// Load the core build.
// var _ = require('lodash/core');
exports.getAll = async function () {
    try {
        var surveys = await Survey.find({});
        return surveys;
    } catch (exception) {
        throw Error("Internal server error while getting survey data.");
    }
}
// Define routes for user APIs.
const express = require('express');
const router = express.Router();

// Get survey controller instance.
const surveyController = require('../../controllers/survey.controller');

// Gets all the surveys in the system.
router.get('/all', surveyController.getAll);

// Export the router.
module.exports = router;
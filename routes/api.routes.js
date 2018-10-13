const express = require('express');
const router = express.Router();

const users = require('./api/users.route');
const surveys = require('./api/surveys.route');

router.use('/users', users);
router.use('/surveys', surveys);

module.exports = router;
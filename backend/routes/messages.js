// routes/messages.js
const express = require('express');
const { getMessage } = require('../controllers/messageController');

const router = express.Router();

router.route('/').get(getMessage);

module.exports = router;
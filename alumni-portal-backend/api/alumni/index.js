const express = require('express');
const router = express.Router();
const controller = require('./alumni.controller');

// get list of alumni with optional filters
router.get('/', controller.list);

// get single alumni by user id
router.get('/:id', controller.getById);

module.exports = router;

const express = require('express');
const controller = require('../../controllers/admin/score.controller');
const router = express.Router();


router.get('/index', controller.index);

// router.post('/day', controller.day);

// router.post('/month', controller.month);

// router.post('/quarter', controller.quarter);

// router.post('/year', controller.year);
module.exports = router;
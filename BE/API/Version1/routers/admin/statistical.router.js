const express = require('express');
const controller = require('../../controllers/admin/statistical.controller');
const router = express.Router();


router.get('/index', controller.index);

router.post('/day', controller.day);

router.post('/month', controller.month);

router.post('/quarter', controller.quarter);

router.post('/year', controller.year);

router.get('/branch', controller.branch);

router.post('/dayBranchs', controller.dayBranchs)

router.post('/monthBranchs', controller.monthBranchs)

router.post('/quarterBranchs', controller.quarterBranchs)

router.post('/yearBranchs', controller.yearBranchs)

router.get('/dish', controller.dish);

router.post('/dish', controller.dish);

router.post('/dayDishs', controller.dayDishs)

router.post('/monthDishs', controller.monthDishs)

router.post('/quarterDishs', controller.quarterDishs)

router.post('/yearDishs', controller.yearDishs)

module.exports = router;
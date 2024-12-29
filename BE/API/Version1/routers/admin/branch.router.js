const express = require('express');
const controller = require('../../controllers/admin/branch.controller');
const router = express.Router();


router.get('/index', controller.index)


module.exports = router;
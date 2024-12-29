// LIBRARY
const express = require('express')
const controller = require('../../controllers/admin/auth.controller');
const validate = require('../../validates/admin/login.validate');
const router = express.Router();

// CONTENT
router.get('/login', controller.login);

router.post('/login',
    validate.loginPost,
    controller.loginPost);

router.get('/logout', controller.logout);

module.exports = router;
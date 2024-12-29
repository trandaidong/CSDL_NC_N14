const express = require('express');
const controller = require('../../controllers/admin/dish.controller');
const router = express.Router();


router.get('/index', controller.index)

router.get('/update/:id', controller.update)

router.patch('/update/:id', controller.updatePatch)

router.post('/create', controller.create)

router.delete('/delete/:id', controller.delete)

module.exports = router;
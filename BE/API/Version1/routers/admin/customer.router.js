const express = require('express');
const router = express.Router();
const controller = require('../../controllers/admin/customer.controller');
const validate =require('../../validates/admin/employee.validate');


router.get('/index', controller.index)

router.post('/create',
        validate.createPost, 
        controller.create
    );
router.get('/update/:id', controller.update)

router.patch('/update/:id', controller.updatePatch)

router.delete('/delete/:id', controller.delete)
module.exports = router;
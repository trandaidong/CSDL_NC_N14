const express = require('express');
const router = express.Router();
const controller = require('../../controllers/admin/order-slip.controller');


router.get('/index', controller.index)

router.post('/create',
        // validate.createPost, 
        controller.create
    );
router.get('/update/:id', controller.update)

router.get('/createInvoice/:id',controller.createInvoice)

router.patch('/update/:id', controller.updatePatch)

router.delete('/delete/:id', controller.delete)

router.get('/detail/:id', controller.detail);

router.post('/detail/create', controller.detailCreate);

router.get('/detail/update/:id', controller.detailUpdate);

router.patch('/detail/update/:id', controller.detailUpdatePatch);

router.delete('/detail/delete/:id', controller.detailDelete);

module.exports = router;
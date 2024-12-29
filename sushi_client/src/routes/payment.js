const express=require('express');
const router=express.Router();
const PaymentController=require('../app/controllers/PaymentControllers.js')
//api
router.post('/api/confirm',PaymentController.handlePayment)
router.get('/api',PaymentController.rendePayment)

//render
router.get('/',PaymentController.index)

module.exports=router;
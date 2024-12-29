const express=require('express');
const router=express.Router();
const ReserveControllers=require('../app/controllers/ReserveControllers.js')
//api
router.post('/api/reserve',ReserveControllers.handleReserve)
router.get('/api',ReserveControllers.renderReserve)

//render
router.get('/',ReserveControllers.index)

module.exports=router;
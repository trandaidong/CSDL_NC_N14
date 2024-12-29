const express=require('express');
const router=express.Router();
const HomeController=require('..\\app\\controllers\\HomeControllers')

router.get('/',HomeController.index)
module.exports=router;


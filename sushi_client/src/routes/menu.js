const express=require('express');
const router=express.Router();
const MenuController=require('..\\app\\controllers\\MenuControllers')
router.post('/api_cart',MenuController.addCart)
router.get('/api_search',MenuController.searchDish)

router.get('/',MenuController.index)
module.exports=router;
  
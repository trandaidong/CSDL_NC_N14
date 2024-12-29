const express=require('express');
const router=express.Router();
const AlbumController=require('..\\app\\controllers\\AlbumControllers')

router.use('/',AlbumController.index)
module.exports=router;


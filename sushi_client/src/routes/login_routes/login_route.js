const express=require('express');
const router=express.Router();
const loginController=require('..\\..\\app\\controllers\\login_controllers\\login_controller')

// Định tuyến trong login
router.get("/login", loginController.renderLogin);

// Xác thực đăng nhập
router.post("/api/login", loginController.authLogin);

module.exports=router;






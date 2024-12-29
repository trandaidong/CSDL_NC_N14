const express = require('express');
const router = express.Router();
const ShoppingCartController = require('..\\app\\controllers\\ShoppingCartControllers');

// Định tuyến cho giỏ hàng

router.get('/api', ShoppingCartController.rendeCartDish); // Hiển thị giỏ hàng


router.delete('/api/remove', ShoppingCartController.removeCartDish);

router.post('/api/update', ShoppingCartController.updateCartDish);

router.get('/', ShoppingCartController.index); // Hiển thị giỏ hàng


module.exports = router;

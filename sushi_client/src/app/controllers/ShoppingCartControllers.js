const ShoppingCartModel = require('..\\models\\ShoppingCartModel'); // Import model


class ShoppingCartController{
    index(req,res){
        res.render('shoppingCart',{layout:'main'});
    }

    async rendeCartDish(req, res) {
        const {email} = req.query;
        try {
            const CartDish = await ShoppingCartModel.getProductsCart(email);
            res.json(CartDish);
        } catch (err) {
            console.error('Lỗi khi lọc sản phẩm:', err);
            res.status(500).send('Lỗi server');
        }
    }

    async removeCartDish(req, res) {
        const { email,id } = req.query; 
        try {
            await ShoppingCartModel.removeProductFromCart(email, id); // Gọi hàm model để xóa món ăn
            res.status(200).send({ message: 'Món ăn đã được xóa khỏi giỏ hàng.' });
        } catch (err) {
            console.error('Lỗi khi xóa món ăn:', err);
            res.status(500).send('Lỗi khi xóa món ăn');
        }
    }

    async updateCartDish(req, res) {
        const { email, id, quantity } = req.body; 
    
        try {
            if (!email || !id || !quantity) {
                return res.status(400).send('Thiếu thông tin yêu cầu');
            }
    
            await ShoppingCartModel.updateQuantity(email, id, quantity); 
    
            const updatedCart = await ShoppingCartModel.getProductsCart(email);
            
            res.status(200).json(updatedCart);  // Trả về giỏ hàng đã được cập nhật
        } catch (err) {
            console.error('Lỗi khi cập nhật số lượng món ăn:', err);
            res.status(500).send('Lỗi khi cập nhật số lượng món ăn');
        }
    }
    
    
}


module.exports=new ShoppingCartController;
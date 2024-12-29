const db = require('../../config/db'); // Import kết nối MySQL
class ShoppingCartModel {
    static getProductsCart(email) {
        return new Promise((resolve, reject) => {
   
            const query = `CALL render_Cart(${db.escape(email)})`;
            db.query(query, (err, results) => {
                if (err) {
                    console.error('Lỗi SQL:', err);  // Log lỗi SQL
                    return reject(err);
                }

                const cartResults = results[0]; 
                resolve(cartResults);
            });
        });
    }


    static removeProductFromCart(email,id) {
        return new Promise((resolve, reject) => {
            const query = `CALL XOA_MON_AN_GIO_HANG(${db.escape(email)}, ${db.escape(id)})`;
            
            db.query(query, (err, results) => {
                if (err) {
                    console.error('Lỗi SQL khi xóa món ăn:', err);
                    return reject(err);
                }
                resolve(results);
            });
        });
    }

    static updateQuantity(email, id, quantity) {
        return new Promise((resolve, reject) => {
            const query = `CALL CapNhatSoLuongSanPham(${db.escape(email)}, ${db.escape(id)}, ${db.escape(quantity)})`;
            
            db.query(query, (err, results) => {
                if (err) {
                    console.error('Lỗi SQL khi cập nhật số lượng món ăn:', err);
                    return reject(err);
                }
                resolve(results);
            });
        });
    }
}
module.exports = ShoppingCartModel;

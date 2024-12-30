
const MenuModel = require('..\\models\\MenuModel'); // Import model

class loginController {
    index(req, res) {
        const productsPromise = new Promise((resolve, reject) => {
            MenuModel.getAllProducts((err, products) => {
                if (err) {
                    reject('Lỗi khi lấy sản phẩm: ' + err);  // Nếu có lỗi, Promise sẽ bị reject
                } else {
                    resolve(products); // Nếu thành công, Promise sẽ được resolve với kết quả
                }
            });
        });
        
        const branchPromise = new Promise((resolve, reject) => {
            MenuModel.getAllBranch((err, branch) => {
                if (err) {
                    reject('Lỗi khi lấy chi nhánh: ' + err);
                } else {
                    resolve(branch);
                }
            });
        });

        const typeOfDishPromise = new Promise((resolve, reject) => {
            MenuModel.getAllTypeOfDish((err, TypeOfDish) => {
                if (err) {
                    reject('Lỗi khi lấy loại món ăn: ' + err);
                } else {
                    resolve(TypeOfDish);
                }
            });
        });

        // Sử dụng Promise.all để chờ tất cả các truy vấn hoàn thành
        Promise.all([productsPromise,branchPromise, typeOfDishPromise])
            .then(([products,branch, TypeOfDish]) => {
                // Sau khi tất cả dữ liệu đã được lấy, render view với tất cả dữ liệu
                res.render('Menu', { 
                    //products,
                    branch, 
                    TypeOfDish,
                    layout: 'main'
                });
            })
            .catch((err) => {
                console.error(err);
                return res.status(500).send('Lỗi server');
            });
    }
    async searchDish(req, res) {
        const { branchId, dishTypeId, priceRange } = req.query;
        try {
            const filteredDish = await MenuModel.filterProducts(branchId, dishTypeId, priceRange);
            res.json(filteredDish);
        } catch (err) {
            console.error('Lỗi khi lọc sản phẩm:', err);
            res.status(500).send('Lỗi server');
        }
    }
    async addCart(req, res) {
        const { email, mamon } = req.body; 
    
        // Kiểm tra tham số
        if (!email || !mamon) {
            console.log(mamon);
            console.log(email);
            return res.status(400).json({ error: 'Thiếu thông tin cần thiết.' });
        }
    
        try {
            const addDish = await MenuModel.addCarts(email, mamon);
            console.log('addDish:' ,addDish);
    
            // Kiểm tra kết quả trả về từ model
            if (addDish && addDish.affectedRows > 0) {
                return res.json({ message: 'Thêm món vào giỏ hàng thành công.' });
            } else {
                return res.status(404).json({ error: 'Không thể thêm món vào giỏ hàng.' });
            }
        } catch (err) {
            console.error('Lỗi khi thêm sản phẩm:', err);
            return res.status(500).json({ error: 'Đã xảy ra lỗi khi thêm sản phẩm.' });
        }
    }
    
}

module.exports = new loginController();

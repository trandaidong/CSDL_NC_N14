const db = require('../../config/db'); // Import kết nối MySQL
class MenuModel{
    static getAllProducts(callback) {
        const query = 'SELECT * FROM MONAN'; // Truy vấn tất cả các món ăn
        db.query(query, (err, results) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, results);
        });
    }
    static getAllBranch(callback) {
        const query = 'SELECT * FROM CHINHANH'; // Lấy dữ liệu từ bảng
        db.query(query, (err, results) => {
            if (err) {
                console.error('Lỗi khi thực hiện truy vấn:', err);
                return callback(err, null);
            }
           // console.log('Kết quả từ database:', results); // Log kết quả từ database
            callback(null, results);
        });
    }
    static getAllTypeOfDish(callback) {
        const query = 'SELECT * FROM LOAIMON'; // Lấy dữ liệu từ bảng
        db.query(query, (err, results) => {
            if (err) {
                console.error('Lỗi khi thực hiện truy vấn:', err);
                return callback(err, null);
            }
           // console.log('Kết quả từ database:', results); // Log kết quả từ database
            callback(null, results);
        });
    }
    static filterProducts(branchId, dishTypeId, priceRange) {
        return new Promise((resolve, reject) => {
    
            let price1 = null;
            let price2 = null;
    
            // Xử lý giá trị priceRange
            if (priceRange === '1') {
                price1 = 0;
                price2 = 50000;
            } else if (priceRange === '2') {
                price1 = 50000;
                price2 = 100000;
            } else if (priceRange === '3') {
                price1 = 100000;
                price2 = 10000000;
            }
    
            // Kiểm tra giá trị của các tham số
            if (!dishTypeId || !branchId || price1 === null || price2 === null) {
                return reject(new Error('Thiếu tham số hợp lệ.'));
            }
    
            // Cấu trúc lại query và truyền các tham số vào stored procedure
            const query = `CALL food_filter(${db.escape(dishTypeId)}, ${db.escape(branchId)}, ${db.escape(price1)}, ${db.escape(price2)})`;
    
            db.query(query, (err, results) => {
                if (err) {
                    console.error('Lỗi khi thực hiện truy vấn:', err);
                    reject(err);
                } else {
                    // Nếu kết quả có nhiều mảng, lấy mảng đầu tiên (dữ liệu món ăn)
                    const filteredResults = results[0]; // Giả sử kết quả trả về là mảng ở index 0
    
                   // console.log(query);
                   // console.log(filteredResults);
    
                    // Trả về chỉ dữ liệu món ăn, không cần thông tin khác
                    resolve(filteredResults);
                }
            });
        });
    }
    

    static addCarts(email,mamon){
        return new Promise((resolve, reject) => {
            const query = `CALL insert_Cart(${db.escape(email)},${db.escape(mamon)})`;
            db.query(query, (err, results) => {
                if (err) {
                    console.error('Lỗi khi thực hiện truy vấn:', err);
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }


}
module.exports = MenuModel;
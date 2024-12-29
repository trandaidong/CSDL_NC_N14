const db = require('../../config/db'); // Import kết nối MySQL

class HomeModel {
    static getAllProducts(callback) {
        const query = 'SELECT * FROM MONAN LIMIT 3'; // Lấy dữ liệu từ bảng
        db.query(query, (err, results) => {
            if (err) {
                console.error('Lỗi khi thực hiện truy vấn:', err);
                return callback(err, null);
            }
            callback(null, results);
        });
    }
    
}

module.exports = HomeModel;

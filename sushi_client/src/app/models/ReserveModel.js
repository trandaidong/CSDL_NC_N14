const db = require('../../config/db'); // Import kết nối MySQL

class ReserveModel {
    static getPayment(email) {
        return new Promise((resolve, reject) => {
            const query = `CALL Tinh_Hoa_Don(${db.escape(email)})`;
            db.query(query, (err, results) => {
                if (err) {
                    console.error('Lỗi SQL khi cập nhật số lượng món ăn:', err);
                    return reject(err);
                }
                resolve(results);
            });
        }
    )
    };
    static ReserveOnline(email,branchID,note,table,day,hours) {
        return new Promise((resolve, reject) => {
            const query = `CALL xuli_online_taicho(${db.escape(email)},${db.escape(branchID)},${db.escape(note)},${db.escape(table)},${db.escape(day)},${db.escape(hours)})`;
            console.log(query);
            db.query(query, (err, results) => {
                if (err) {
                    console.error('Lỗi SQL khi đặt bàn:', err);
                    return reject(err);
                }
                resolve(results);
            });
        }
    )
    };
}
module.exports = ReserveModel;
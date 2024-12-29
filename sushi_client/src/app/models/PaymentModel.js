const db = require('../../config/db'); // Import kết nối MySQL

class PaymentModel {
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

    static confirmPayment(note,email,address,branchID) {
        return new Promise((resolve, reject) => {
            const query = `CALL xuli_online_datve(${db.escape(email)},${db.escape(branchID)},${db.escape(note)},${db.escape(address)})`;
            
            db.query(query, (err, results) => {
                if (err) {
                    console.error('Lỗi SQL khi thanh toán:', err);
                    return reject(err);
                }
                resolve(results);
            });
        }
    )
};
}
module.exports = PaymentModel;
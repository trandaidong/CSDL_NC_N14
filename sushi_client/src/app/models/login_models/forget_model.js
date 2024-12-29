const db = require("../../../config/db"); // Import kết nối MySQL

const checkAccount = function (userName, callback) {
  const query = "SELECT * FROM KHACHHANG WHERE email = ?";

  db.execute(query, [userName], (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn cơ sở dữ liệu:", err.message);
      return callback(err, null); // Trả lỗi qua callback
    }

    // Kiểm tra kết quả
    if (results.length === 0) {
      return callback(null, null); // Không tìm thấy tài khoản
    }

    callback(null, results[0]); // Trả về thông tin tài khoản đầu tiên
  });
};

const commitSave = function (userName, password, callback) {
  const query = "UPDATE KHACHHANG SET MATKHAU = ? WHERE email = ?";

  db.execute(query, [password, userName], (err, results) => {
    if (err) {
      console.error("Lỗi khi cập nhật dữ liệu:", err.message);
      return callback(err, null); // Trả lỗi qua callback
    }

    callback(null, results); // Trả về kết quả cập nhật
  });
};

module.exports = { checkAccount, commitSave };

const db = require("../../../config/db");

const bcrypt = require("bcrypt");

const checkAccount = function (userName, password, callback) {
  const query = "SELECT * FROM KHACHHANG WHERE email = ?";

  db.execute(query, [userName], (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn cơ sở dữ liệu:", err.message);
      return callback(err, null);
    }

    console.log("Đã truy vấn");

    if (results.length === 0) return callback(null, null);

    const hashedPassword = results[0].MATKHAU;

    bcrypt.compare(password, hashedPassword, (err, isMatch) => {
      if (err) {
        console.error("Lỗi khi so sánh mật khẩu:", err.message);
        return callback(err, null);
      }

      if (isMatch) {
        return callback(null, results[0]);
      } else {
        return callback(null, null);
      }
    });
  });
};

module.exports = { checkAccount };

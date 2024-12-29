const db = require("../../../config/db");

const findByEmail = function (email, callback) {
  const query = "SELECT * FROM KHACHHANG WHERE email = ?";
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error("Lỗi khi truy vấn email:", err.message);
      return callback(err, null);
    }
    if (results.length === 0) {
      return callback(null, null);
    }
    callback(null, results[0]);
  });
};

const createUser = function (
  phone,
  name,
  email,
  citizenID,
  gender,
  password,
  callback
) {
  db.query("SELECT * FROM KHACHHANG", (err, rows) => {
    if (err) {
      console.error("Lỗi khi truy vấn danh sách khách hàng:", err.message);
      return callback(err, null);
    }

    const length = rows.length + 1;
    const idUser = "KH" + length.toString();

    // Insert vào bảng khách hàng
    const user =
      "INSERT INTO KHACHHANG (makhachhang, sdt, fullname, email, cccd, gioitinh, MATKHAU) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(
      user,
      [idUser, phone, name, email, citizenID, gender, password],
      (err, result) => {
        if (err) {
          console.error("Lỗi khi thêm dữ liệu:", err.message);
          return callback(err, null);
        }

        db.query("SELECT * FROM THEKHACHHANG", (err, rows2) => {
          if (err) {
            console.error(
              "Lỗi khi truy vấn danh sách thẻ khách hàng:",
              err.message
            );
            return callback(err, null);
          }

          const length = rows2.length + 1;
          const idCard = "KH" + length.toString();

          // Insert thẻ khách hàng
          const date = new Date();
          const day = date.getDate();
          const month = date.getMonth() + 1;
          const year = date.getFullYear();
          const today = `${year}-${month}-${day}`;
          const userCard =
            "INSERT INTO THEKHACHHANG (MATHE, MAKHACHHANG, LOAITHE, MANHANVIEN, NGAYLAP, DIEMTICHLUY) VALUES (?, ?, ?, ?, ?, ?)";
          db.query(
            userCard,
            [idCard, idUser, "Member", null, today, 0],
            (err) => {
              if (err) {
                console.error("Lỗi khi thêm dữ liệu:", err.message);
                return callback(err, null);
              }
              console.log("Thêm khách hàng thành công với ID:", idUser);
              callback(null, result);
            }
          );
        });
      }
    );
  });
};

module.exports = { findByEmail, createUser };

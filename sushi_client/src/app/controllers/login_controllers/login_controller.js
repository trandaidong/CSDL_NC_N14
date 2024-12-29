const loginModel = require("..\\..\\models\\login_models\\login_model"); // Import model

//render giao dien
const renderLogin = function (req, res) {
  res.render("authLogin", { layout: "login" });
};

const authLogin = function (req, res) {
  const userName = req.body.userName;
  const password = req.body.password;

  // Gọi hàm checkAccount sử dụng callback
  loginModel.checkAccount(userName, password, (err, existingAccount) => {
    if (err) {
      console.error("Lỗi khi kiểm tra tài khoản:", err);
      return res.status(500).json({ message: "Đã xảy ra lỗi khi đăng nhập" });
    }

    if (existingAccount) {
      const fullName = existingAccount.FULLNAME;
      return res.status(200).json({
        message: "Đăng nhập thành công",
        fullName: fullName,
      });
    } else {
      return res
        .status(401)
        .json({ message: "Sai tên đăng nhập hoặc mật khẩu" });
    }
  });
};

module.exports = { renderLogin, authLogin };

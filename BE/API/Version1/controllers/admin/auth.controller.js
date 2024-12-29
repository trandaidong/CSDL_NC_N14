const systemConfig = require("../../../../config/system");
var md5 = require('md5'); // thư viện mã hóa password
const database = require('../../../../config/database');

//[GET] /admin/auth/login
module.exports.login = (req, res) => {
    if (req.cookies.token) {
        res.redirect(`${systemConfig.prefixAdmin}/api/v1/dashboard`)
    }
    else {
        res.render("admin/pages/auth/login.pug", {
            pageTitle: "Đăng nhập"
        })
    }
}


//[POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
    const connection = database.getConnection();
    const { username, password } = req.body;
    try {
        const [user] = await new Promise((resolve, reject) => {
            connection.query(`
            SELECT *
            FROM NHANVIEN
            WHERE EMAIL=?
        `, [username], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        if (!user) {// nếu không có người dùng
            req.flash("error", "Email not exists!");
            res.redirect('back');
            return;
        }
        if (md5(password) != user.MATKHAU) {
            req.flash("error", "Invalid password!");
            res.redirect('back');
            return;
        }
        res.cookie('token', user.MANHANVIEN);
        res.redirect(`${systemConfig.prefixAdmin}/api/v1/dashboard`);
    } catch (error) {
        console.log(error);
        req.flash("error", `Login failed!`);
        res.redirect(`back`);
    } finally {
        process.on('SIGINT', () => {
            console.log('Đang tắt server...');
            database.disconnect(); // Đóng kết nối trước khi thoát
            process.exit(0);
        });
    }
}
//[GET] /admin/v1/auth/logout
module.exports.logout = (req, res) => {
    res.clearCookie('token');
    res.redirect(`${systemConfig.prefixAdmin}/api/v1/auth/login`);
}

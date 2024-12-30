const systemConfig = require('../../../../config/system');
const database = require('../../../../config/database');
const md5 = require('md5');
module.exports.requireAuth = async (req, res, next) => {
    if (!req.cookies.token) {
        const connection = database.getConnection();
        res.redirect(`${systemConfig.prefixAdmin}/api/v1/auth/login`);
    } else {
        try {
            const connection = database.getConnection();
            // Thực hiện truy vấn employees
            const user = await new Promise((resolve, reject) => {
                connection.query(
                    `
                    SELECT *
                    FROM NHANVIEN
                    WHERE MANHANVIEN = ?
                `,
                    [req.cookies.token],
                    (err, results) => {
                        if (err) reject(err);
                        else resolve(results);
                    }
                );
            });
            if (!user.length) {
                return res.redirect(`${systemConfig.prefixAdmin}/api/v1`);
            } else {
                res.locals.user = user;
                next();
            }
        } catch (error) {
            console.error('Lỗi truy vấn:', error);
            res.status(500).send('Lỗi lấy dữ liệu từ cơ sở dữ liệu.');
        } finally {
            process.on('SIGINT', () => {
                console.log('Đang tắt server...');
                database.disconnect(); // Đóng kết nối trước khi thoát
                process.exit(0);
            });
        }
    }
};

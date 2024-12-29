const systemConfig = require('../../../../config/system');
const database = require('../../../../config/database');

module.exports.requireAuth = async (req, res, next) => {
    if (!req.cookies.token) {
        res.redirect(`${systemConfig.prefixAdmin}/api/v1/auth/login`);
    } else {
        const connection = database.getConnection();

        try {
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
        }
    }
};

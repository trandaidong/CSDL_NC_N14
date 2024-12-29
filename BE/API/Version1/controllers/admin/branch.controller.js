const database = require('../../../../config/database');


//[GET] /admin/api/v1/branch
module.exports.index = async (req, res) => {
    const connection = database.getConnection();
        const user = res.locals.user[0];

        console.log(req.query);
        var keyword = null;
        if (req.query.keyword) {
            keyword = req.query.keyword;
        }
        try {
            const employees = await new Promise((resolve, reject) => {
                connection.query(`
                    SELECT MANHANVIEN, FULLNAME
                    FROM NHANVIEN
                `, (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
            });

            const branchs = await new Promise((resolve, reject) => {
                connection.query(`
                    SELECT CN.MACHINHANH, CN.TENCHINHANH, CN.SDT, NV.FULLNAME AS QUANLY
                    FROM CHINHANH CN
                    JOIN NHANVIEN NV ON CN.MAQUANLY=NV.MANHANVIEN 
                    WHERE
                        (CN.TENCHINHANH LIKE ? OR CN.MACHINHANH = ?) OR (? IS NULL)
                    ORDER BY CN.MACHINHANH ASC;
                `, ['%' + keyword + '%', keyword, keyword], (err, results) => {
                    if (err) reject(err);
                    else resolve(results);
                });
            });
            if (!branchs) {
                return res.status(404).json({ message: 'Dữ liệu không tồn tại!' });
            }


            res.render('admin/pages/branchs/index.pug', {
                pageTitle: "Quản lý chi nhánh",
                branchs: branchs,
                employees: employees,
                search: []
            });
        } catch (error) {
            console.error('Lỗi khi lấy thông tin:', error);
            res.status(500).json({ message: 'Lỗi server!' });
        } finally {
            process.on('SIGINT', () => {
                console.log('Đang tắt server...');
                database.disconnect(); // Đóng kết nối trước khi thoát
                process.exit(0);
            });
        }
}
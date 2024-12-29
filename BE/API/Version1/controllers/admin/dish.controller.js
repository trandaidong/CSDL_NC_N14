const database = require('../../../../config/database');


//[GET] /admin/api/v1/dish
module.exports.index = async (req, res) => {
    const connection = database.getConnection();
    const user = res.locals.user[0];

    var keyword = null;
    var branch = null;
    if (req.query.keyword) {
        keyword = req.query.keyword;
    }
    if (req.query.branchId) {
        branch = req.query.branchId;
    }
    try {
        const dishs = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT DISTINCT MA.MAMON, MA.URL, MA.TENMON, MA.GIA, MA.SOLUONG
                FROM MONAN MA
                LEFT JOIN THUCDONCHINHANH TDCN ON TDCN.MAMON=MA.MAMON
                LEFT JOIN CHINHANH CN ON CN.MACHINHANH=TDCN.MACHINHANH
                WHERE
                    (((MA.TENMON LIKE ? OR MA.MAMON = ?) OR (? IS NULL)) AND
                      (? IS NULL OR CN.MACHINHANH = ?))
                ORDER BY MA.TENMON DESC;
            `, ['%' + keyword + '%', keyword, keyword, branch, branch], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        // Thực hiện truy vấn branchs
        const [branchs] = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT MACHINHANH, TENCHINHANH
                FROM CHINHANH
                ORDER BY TENCHINHANH
            `, (err, results) => {
                if (err) reject(err);
                else resolve([results]);
            });
        });
        const [typesOfDish] = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT MALOAI, TENLOAI
                FROM LOAIMON
                ORDER BY TENLOAI
            `, (err, results) => {
                if (err) reject(err);
                else resolve([results]);
            });
        });
        if (!dishs) {
            return res.status(404).json({ message: 'Dữ liệu không tồn tại!' });
        }
        res.render('admin/pages/dishs/index.pug', {
            pageTitle: "Quản lý món ăn",
            branchs: branchs,
            dishs: dishs,
            typesOfDish: typesOfDish,
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

//[GET] /admin/api/v1/dish
module.exports.update = async (req, res) => {
    const connection = database.getConnection();
    const user = res.locals.user[0];
    const id = req.params.id;
    try {
        const [dish] = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT *
                FROM MONAN
                WHERE MAMON=?
            `, [id], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        if (!dish) {
            return res.status(404).json({ message: 'Dữ liệu không tồn tại!' });
        }
        res.json(dish); // Trả về thông tin khách hàng

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
//[POST] /admin/api/v1/dish/updatPatch
module.exports.updatePatch = async (req, res) => {
    const connection = database.getConnection();
    const id = req.params.id;
    const { TenMon, LoaiMon, Gia, SoLuong, URL } = req.body;
    try {
        await new Promise((resolve, reject) => {
            connection.query(`
            CALL UpdateDish(?,?,?,?,?,?)
        `, [id, TenMon, LoaiMon, Gia, SoLuong,URL], (err, results) => {
                    if (err) {
                        console.log(err);
                        reject(err)
                    }

                    else resolve([results]);
                });
        });
        req.flash("success", `Update successfully!`);
        res.redirect(`back`);
    } catch (error) {
        console.log(error);
        req.flash("error", `Update faild!`);
        res.redirect(`back`);
    }finally {
            process.on('SIGINT', () => {
                console.log('Đang tắt server...');
                database.disconnect(); // Đóng kết nối trước khi thoát
                process.exit(0);
            });
        }
};

//[POST] /admin/api/v1/dish/create
module.exports.create = async (req, res) => {
    const connection = database.getConnection();
    console.log(req.body)
    const { TenMon, LoaiMon, Gia, SoLuong, URL } = req.body;
    try {
        // Thực hiện truy vấn employee
        await new Promise((resolve, reject) => {
            connection.query(`
                CALL InsertDish(?,?,?,?,?)
            `, [TenMon, LoaiMon, Gia, URL, SoLuong], (err, results) => {
                if (err) {
                    console.log(err)
                    reject(err)
                }
                else resolve([results]);
            });
        });
        req.flash("success", `Create successfully!`);
        res.redirect(`back`);
    } catch (error) {
        req.flash("error", `Create faild!`);
        res.redirect(`back`);
    }finally {
            process.on('SIGINT', () => {
                console.log('Đang tắt server...');
                database.disconnect(); // Đóng kết nối trước khi thoát
                process.exit(0);
            });
        }
};
//[POST] /admin/api/v1/employee/delete:id
module.exports.delete = async (req, res) => {
    const connection = database.getConnection();
    const id = req.params.id;

    try {
        // Thực hiện truy vấn employee
        await new Promise((resolve, reject) => {
            connection.query(`
                DELETE FROM MONAN
                WHERE MAMON= ? ;
            `, [id], (err, results) => {
                if (err) reject(err);
                else resolve([results]);
            });
        });
        req.flash("success", `Delete successfully`)
        res.redirect("back");
    } catch (error) {
        console.log(error);
        req.flash("error", `Delete faild!`);
        res.redirect(`back`);
    }finally {
            process.on('SIGINT', () => {
                console.log('Đang tắt server...');
                database.disconnect(); // Đóng kết nối trước khi thoát
                process.exit(0);
            });
        }
};




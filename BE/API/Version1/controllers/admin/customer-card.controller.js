const database = require('../../../../config/database');


//[GET] /admin/api/v1/employee/index
module.exports.index = async (req, res) => {
    const connection = database.getConnection();
    var keyword = null;
    var branch = null;
    if (req.query.keyword) {
        keyword = req.query.keyword;
    }
    try {
        // Thực hiện truy vấn customer-cards
        const [cards] = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT TKH.MATHE, KH.FULLNAME AS HOTENKH, TKH.NGAYLAP, NV.FULLNAME AS HOTENNV, TKH.LOAITHE, TKH.DIEMTICHLUY
                FROM THEKHACHHANG TKH
                JOIN NHANVIEN NV ON NV.MANHANVIEN=TKH.MANHANVIEN
                JOIN KHACHHANG KH ON KH.MAKHACHHANG=TKH.MAKHACHHANG
                WHERE ((KH.FULLNAME LIKE ? OR KH.MAKHACHHANG = ? OR TKH.MATHE = ?) OR (? IS NULL))
                LIMIT 100;
            `, ['%' + keyword + '%', keyword, keyword, keyword], (err, results) => {
                if (err) reject(err);
                else resolve([results]);
            });
        });
        // Render dữ liệu ra giao diện
        res.render('admin/pages/customer-cards/index.pug', {
            pageTitle: "Quản lý thẻ khánh hàng",
            cards
        });
    } catch (error) {
        console.error('Lỗi truy vấn:', error);
        res.status(500).send("Lỗi lấy dữ liệu từ cơ sở dữ liệu.");
    } finally {
        process.on('SIGINT', () => {
            console.log('Đang tắt server...');
            database.disconnect(); // Đóng kết nối trước khi thoát
            process.exit(0);
        });
    }
};

//[POST] /admin/api/v1/customer-card/delete:id
module.exports.delete = async (req, res) => {
    const connection = database.getConnection();
    const id = req.params.id;

    try {
        // Thực hiện truy vấn employee
        await new Promise((resolve, reject) => {
            connection.query(`
                DELETE FROM THEKHACHHANG
                WHERE MATHE= ? ;
            `, [id], (err, results) => {
                if (err) reject(err);
                else resolve([results]);
            });
        });
        req.flash("success", `Delete successfully`)
        res.redirect("back");
    } catch (error) {
        req.flash("error", `Delete faild!`);
        res.redirect(`back`);
    } finally {
        process.on('SIGINT', () => {
            console.log('Đang tắt server...');
            database.disconnect(); // Đóng kết nối trước khi thoát
            process.exit(0);
        });
    }
};

//[GET] /admin/api/v1/customer-card/update:id
module.exports.update = async (req, res) => {
    const connection = database.getConnection();
    const id = req.params.id;
    try {
        const [customer] = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT *
                FROM THEKHACHHANG
                WHERE MATHE = ?
            `, [id], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        if (!customer) {
            return res.status(404).json({ message: 'Thẻ khách hàng không tồn tại!' });
        }

        res.json(customer); // Trả về thông tin khách hàng
    } catch (error) {
        console.error('Lỗi khi lấy thông tin nhân viên:', error);
        res.status(500).json({ message: 'Lỗi server!' });
    } finally {
        process.on('SIGINT', () => {
            console.log('Đang tắt server...');
            database.disconnect(); // Đóng kết nối trước khi thoát
            process.exit(0);
        });
    }
};
//[PATCH] /admin/api/v1/customer-card/update:id
module.exports.updatePatch = async (req, res) => {
    const connection = database.getConnection();
    const id = req.params.id;

    const { customerid, typeCard, point } = req.body;
    try {
        await new Promise((resolve, reject) => {
            connection.query(`
            CALL UpdateCustomerCard(?,?,?)
        `, [id, typeCard, point], (err, results) => {
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
        req.flash("error", `Update faild!`);
        res.redirect(`back`);
    } finally {
        process.on('SIGINT', () => {
            console.log('Đang tắt server...');
            database.disconnect(); // Đóng kết nối trước khi thoát
            process.exit(0);
        });
    }
};
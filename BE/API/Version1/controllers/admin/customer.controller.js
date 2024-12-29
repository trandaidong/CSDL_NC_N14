var md5 = require('md5'); // thư viện mã hóa password
const database = require('../../../../config/database');


//[GET] /admin/api/v1/employee/index
module.exports.index = async (req, res) => {
    const connection = database.getConnection();
    const user = res.locals.user[0];

    var keyword = null;
    var branch = null;
    if (req.query.keyword) {
        keyword = req.query.keyword;
    }
    try {
        // Thực hiện truy vấn customer
        const [customers] = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT *
                FROM KHACHHANG KH
                WHERE ((KH.FULLNAME LIKE ? OR KH.MAKHACHHANG = ?) OR (? IS NULL))
                ORDER BY KH.MAKHACHHANG DESC
                LIMIT 100;
            `, ['%' + keyword + '%', keyword, keyword], (err, results) => {
                if (err) reject(err);
                else resolve([results]);
            });
        });
        // Render dữ liệu ra giao diện
        res.render('admin/pages/customers/index.pug', {
            pageTitle: "Quản lý khánh hàng",
            customers: customers,
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

//[POST] /admin/api/v1/customer/create
module.exports.create = async (req, res) => {
    const connection = database.getConnection();
    const { fullname, phone, email, CCCD, gender, password } = req.body;
    try {
        // Thực hiện truy vấn employee
        const [emailExists] = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT *
                FROM KHACHHANG
                WHERE EMAIL= ?
            `, [email], (err, results) => {
                if (err) reject(err);
                else resolve([results]);
            });
        });
        if (!emailExists.length) {
            await new Promise((resolve, reject) => {
                connection.query(`
                CALL InsertCustomer(?,?,?,?,?,?)
            `, [phone, fullname, email, CCCD,
                    gender, md5(password)], (err, results) => {
                        if (err) {
                            console.log(err);
                            reject(err);
                        }
                        else resolve([results]);
                    });
            });
            req.flash("success", `Create successfully!`);
            res.redirect(`back`);
        }
        else {
            req.flash("error", `Email exists!`);
            res.redirect(`back`);
        }
    } catch (error) {
        req.flash("error", `Create faild!`);
        res.redirect(`back`);
    } finally {
        process.on('SIGINT', () => {
            console.log('Đang tắt server...');
            database.disconnect(); // Đóng kết nối trước khi thoát
            process.exit(0);
        });
    }
};

//[POST] /admin/api/v1/customer/delete:id
module.exports.delete = async (req, res) => {
    const connection = database.getConnection();
    const id = req.params.id;

    try {
        // Thực hiện truy vấn customer
        await new Promise((resolve, reject) => {
            connection.query(`
                DELETE FROM KHACHHANG
                WHERE MAKHACHHANG= ? ;
            `, [id], (err, results) => {
                if (err) reject(err);
                else resolve([results]);
            });
        });
        req.flash("success", `Delete successfully`)
        res.redirect("back");
    } catch (error) {
        console.log(error)
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

//[GET] /admin/api/v1/customer/update:id
module.exports.update = async (req, res) => {
    const connection = database.getConnection();
    const id = req.params.id;
    try {
        const [customer] = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT *
                FROM KHACHHANG
                WHERE MAKHACHHANG = ?
            `, [id], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        if (!customer) {
            return res.status(404).json({ message: 'Khách hàng không tồn tại!' });
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
    const { fullname, phone, email, CCCD, gender, password } = req.body;
    try {
        // Thực hiện truy vấn employee
        const [employeeExists] = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT *
                FROM KHACHHANG
                WHERE MAKHACHHANG= ?
            `, [id], (err, results) => {
                if (err) reject(err);
                else resolve([results]);
            });
        });
        if (employeeExists.length) {
            await new Promise((resolve, reject) => {
                connection.query(`
                CALL UpdateCustomer(?,?,?,?,?,?,?)
            `, [id, phone, fullname, email, CCCD,
                    gender, ''], (err, results) => {
                        if (err) {
                            console.log(err);
                            reject(err)
                        }

                        else resolve([results]);
                    });
            });
            req.flash("success", `Update successfully!`);
            res.redirect(`back`);
        }
        else {
            req.flash("error", `Employee not exists!`);
            res.redirect(`back`);
        }
    } catch (error) {
        console.log(error);
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
var md5 = require('md5'); // thư viện mã hóa password
const database = require('../../../../config/database');


//[GET] /admin/api/v1/employee/index
module.exports.index = async (req, res) => {
    const connection = database.getConnection();
    var keyword = null;
    var branch = null;
    if (req.query.keyword) {
        keyword = req.query.keyword;
    }
    if (req.query.branchId) {
        branch = req.query.branchId;
    }
    try {
        // Thực hiện truy vấn employees
        const [employees] = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT NV.MANHANVIEN, NV.FULLNAME, NV.SDT, NV.GIOITINH, BP.TENBOPHAN, CN.TENCHINHANH
                FROM NHANVIEN AS NV
                JOIN BOPHAN AS BP ON NV.MABOPHAN = BP.MABOPHAN
                JOIN CHINHANH AS CN ON NV.MACHINHANH = CN.MACHINHANH 
                WHERE         
                      (((NV.FULLNAME LIKE ? OR NV.MANHANVIEN = ?) OR (? IS NULL)) AND
                      (? IS NULL OR CN.MACHINHANH = ?))
                ORDER BY NV.MANHANVIEN DESC;
            `, ['%' + keyword + '%', keyword, keyword, branch, branch], (err, results) => {
                if (err) reject(err);
                else resolve([results]);
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
        // Thực hiện truy vấn branchs
        const [departments] = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT *
                FROM BOPHAN
                ORDER BY TENBOPHAN
            `, (err, results) => {
                if (err) reject(err);
                else resolve([results]);
            });
        });

        // Render dữ liệu ra giao diện
        res.render('admin/pages/employees/index.pug', {
            pageTitle: "Quản lý nhân viên",
            employees: employees,
            branchs: branchs,
            departments: departments,
            keyword,
            branch
        });
    } catch (error) {
        console.error('Lỗi truy vấn:', error);
        res.status(500).send("Lỗi lấy dữ liệu từ cơ sở dữ liệu.");
    } 
    // finally {
    //     process.on('SIGINT', () => {
    //         console.log('Đang tắt server...');
    //         database.disconnect(); // Đóng kết nối trước khi thoát
    //         process.exit(0);
    //     });
    // }
};
//[POST] /admin/api/v1/employee/create
module.exports.create = async (req, res) => {
    const connection = database.getConnection();
    const { fullname, department, branch, dateofbirth, gender, email, phone, address } = req.body;
    try {
        // Thực hiện truy vấn employee
        const [emailExists] = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT *
                FROM NHANVIEN
                WHERE EMAIL= ?
            `, [email], (err, results) => {
                if (err) reject(err);
                else resolve([results]);
            });
        });
        if (!emailExists.length) {
            await new Promise((resolve, reject) => {
                connection.query(`
                CALL INSERT_EMPLOYEE(?,?,?,?,?,?,?,?,?,?)
            `, [fullname, department, branch, email, dateofbirth.split('T')[0],
                    gender, 0, phone, address, md5(phone)], (err, results) => {
                        if (err) reject(err);
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
    }
     finally {
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
                DELETE FROM NHANVIEN
                WHERE MANHANVIEN= ? ;
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
    } 
    finally {
        process.on('SIGINT', () => {
            console.log('Đang tắt server...');
            database.disconnect(); // Đóng kết nối trước khi thoát
            process.exit(0);
        });
    }
};
//[GET] /admin/api/v1/employee/update:id
module.exports.update = async (req, res) => {
    const connection = database.getConnection();
    const employeeId = req.params.id; // Lấy id nhân viên từ URL
    try {
        const [employee] = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT *
                FROM NHANVIEN
                WHERE MANHANVIEN = ?
            `, [employeeId], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        if (!employee) {
            return res.status(404).json({ message: 'Nhân viên không tồn tại!' });
        }

        res.json(employee); // Trả về thông tin nhân viên
    } catch (error) {
        console.error('Lỗi khi lấy thông tin nhân viên:', error);
        res.status(500).json({ message: 'Lỗi server!' });
    } 
    finally {
        process.on('SIGINT', () => {
            console.log('Đang tắt server...');
            database.disconnect(); // Đóng kết nối trước khi thoát
            process.exit(0);
        });
    }
};
//[PATCH] /admin/api/v1/employee/update:id
module.exports.updatePatch = async (req, res) => {
    const connection = database.getConnection();
    const id = req.params.id;
    const { fullname, department, branch, dateofbirth, gender, email, phone, address } = req.body;
    try {
        // Thực hiện truy vấn employee
        const [emailExists] = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT *
                FROM NHANVIEN
                WHERE MANHANVIEN= ?
            `, [id], (err, results) => {
                if (err) reject(err);
                else resolve([results]);
            });
        });
        console.log(id);
        if (emailExists.length) {
            await new Promise((resolve, reject) => {
                connection.query(`
                CALL UPDATE_EMPLOYEE(?,?,?,?,?,?,?,?,?)
            `, [id, fullname, department, branch, email, dateofbirth.split('T')[0],
                    gender, phone, address], (err, results) => {
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
            req.flash("error", `Email not exists!`);
            res.redirect(`back`);
        }
    } catch (error) {
        req.flash("error", `Update faild!`);
        res.redirect(`back`);
    } 
    finally {
        process.on('SIGINT', () => {
            console.log('Đang tắt server...');
            database.disconnect(); // Đóng kết nối trước khi thoát
            process.exit(0);
        });
    }
};


//[GET] /admin/api/v1/employee/detail
module.exports.detail = async (req, res) => {
    const connection = database.getConnection();
    const id = req.params.id;
    try {
        // Thực hiện truy vấn employees
        const [employee] = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT NV.MANHANVIEN, NV.FULLNAME, BP.TENBOPHAN, CN.TENCHINHANH, NV.EMAIL,
                    NV.NGAYSINH, NV.LUONG, NV.LUONG, NV.SDT, NV.DIACHI
                FROM NHANVIEN NV 
                JOIN CHINHANH CN ON CN.MACHINHANH=NV.MACHINHANH
                JOIN BOPHAN BP ON BP.MABOPHAN = NV.MABOPHAN
                WHERE MANHANVIEN=?
            `, [id], (err, results) => {
                if (err) reject(err);
                else resolve([results]);
            });
        });
        res.render('admin/pages/employees/detail.pug', {
            pageTitle: employee.FULLNAME,
            employee: employee[0]
        });
    } catch (error) {
        console.error('Lỗi truy vấn:', error);
        res.status(500).send("Lỗi lấy dữ liệu từ cơ sở dữ liệu.");
    } 
    finally {
        process.on('SIGINT', () => {
            console.log('Đang tắt server...');
            database.disconnect(); // Đóng kết nối trước khi thoát
            process.exit(0);
        });
    }
};
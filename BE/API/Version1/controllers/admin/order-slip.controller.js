const database = require('../../../../config/database');


//[GET] /admin/api/v1/invoice/index
module.exports.index = async (req, res) => {
    const connection = database.getConnection();
    var keyword = null;
    var branch = null;
    if (req.query.keyword) {
        keyword = req.query.keyword;
    }
    try {
        //Thực hiện truy vấn hóa đơn offline
        const [OfflineInvoices] = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT PDOFF.MAPHIEUDATMON, KH.FULLNAME AS KHACHHANG, NV.FULLNAME AS NHANVIEN, PDOFF.HOADON, 
                FROM PHIEUDATOFFLINE PDOFF
                JOIN KHACHHANG KH ON PDOFF.MAKHACHHANG=KH.MAKHACHHANG
                JOIN NHANVIEN NV ON PDOFF.MANHANVIEN=NV.MANHANVIEN
                WHERE ((KH.FULLNAME LIKE ? OR PDOFF.MAPHIEUDATMON = ? OR KH.MAKHACHHANG = ?) OR (? IS NULL))
                ORDER BY PDOFF.HOADON DESC
                LIMIT 100;
            `, ['%' + keyword + '%', keyword, keyword, keyword], (err, results) => {
                if (err) reject(err);
                else resolve([results]);
            });
        });
        // Render dữ liệu ra giao diện
        res.render('admin/pages/order-slip/index.pug', {
            pageTitle: "Quản lý phiếu dặt món",
            invoices: OfflineInvoices
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
module.exports.create = async (req, res) => {
    const connection = database.getConnection();
    const user = res.locals.user[0];
    const { IDKhachHang, SoBan } = req.body;
    try {
        await new Promise((resolve, reject) => {
            connection.query(`
            CALL InsertPhieuDatOffline(?,?,?,?)
        `, [user.MANHANVIEN, user.MACHINHANH, IDKhachHang, SoBan], (err, results) => {
                if (err) reject(err);
                else resolve([results]);
            });
        });
        req.flash("success", `Create successfully!`);
        res.redirect(`back`);
    } catch (error) {
        console.log(error);
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
//[GET] /admin/api/v1/order-slip
module.exports.update = async (req, res) => {
    const connection = database.getConnection();
    const user = res.locals.user[0];
    const id = req.params.id;
    try {
        const [order] = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT *
                FROM PHIEUDATOFFLINE
                WHERE MAPHIEUDATMON=?
            `, [id], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        if (!order) {
            return res.status(404).json({ message: 'Dữ liệu không tồn tại!' });
        }
        res.json(order); // Trả về thông tin khách hàng

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
    const { IDKhachHang, SoBan } = req.body;
    try {
        await new Promise((resolve, reject) => {
            connection.query(`
            CALL UpdatePhieuDatOffline(?,?,?)
        `, [id, IDKhachHang, SoBan], (err, results) => {
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
    } finally {
        process.on('SIGINT', () => {
            console.log('Đang tắt server...');
            database.disconnect(); // Đóng kết nối trước khi thoát
            process.exit(0);
        });
    }
};
//[DELETE] /admin/api/v1/order-slip/delete:id
module.exports.delete = async (req, res) => {
    const connection = database.getConnection();
    const id = req.params.id;

    try {
        // Thực hiện truy vấn employee
        await new Promise((resolve, reject) => {
            connection.query(`
                DELETE FROM PHIEUDATOFFLINE
                WHERE MAPHIEUDATMON= ? ;
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
    } finally {
        process.on('SIGINT', () => {
            console.log('Đang tắt server...');
            database.disconnect(); // Đóng kết nối trước khi thoát
            process.exit(0);
        });
    }
};
//[GET] /admin/api/v1/order-slip/detail:id
module.exports.detail = async (req, res) => {
    const connection = database.getConnection();
    const slipId = req.params.id; // Lấy id nhân viên từ URL
    try {
        const slips = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT MA.MAMON,MA.TENMON, MA.URL, MA.GIA, CT.SOLUONG,(MA.GIA * CT.SOLUONG) AS TONGTIEN
                FROM CHITIETPHIEUDATOFFLINE CT
                JOIN MONAN MA ON MA.MAMON=CT.MAMON
                WHERE MAPHIEUDATMON = ?
            `, [slipId], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        const dishs = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT MAMON, TENMON
                FROM MONAN
            `, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        // Render dữ liệu ra giao diện
        res.render('admin/pages/order-slip/detail.pug', {
            pageTitle: "Quản lý phiếu dặt món",
            slips,
            dishs,
            slipId
        });
    } catch (error) {
        console.error('Lỗi khi lấy thông tin phiếu đặt:', error);
        res.status(500).json({ message: 'Lỗi server!' });
    } finally {
        process.on('SIGINT', () => {
            console.log('Đang tắt server...');
            database.disconnect(); // Đóng kết nối trước khi thoát
            process.exit(0);
        });
    }
};
//[POST] /admin/api/v1/order-slip/detail/create
module.exports.detailCreate = async (req, res) => {
    const connection = database.getConnection();
    console.log(req.body)
    var { dish, quantity, orderSlipId } = req.body;
    quantity = parseInt(quantity);
    try {
        await new Promise((resolve, reject) => {
            connection.query(`
              CALL AddDetailOrderSlipOffline(?,?,?)
            `, [orderSlipId, dish, quantity], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        req.flash("success", `Create successfully!`);
        res.redirect(`back`);
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
//[GET] /admin/api/v1/order-slip/detail/update
module.exports.detailUpdate = async (req, res) => {
    const connection = database.getConnection();
    const id = req.params.id.split('_');
    try {
        const [detailSlip] = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT *
                FROM CHITIETPHIEUDATOFFLINE
                WHERE MAPHIEUDATMON = ? AND MAMON = ?;
            `, [id[0], id[1]], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        if (!detailSlip) {
            return res.status(404).json({ message: 'Dữ liệu không tồn tại!' });
        }

        res.json(detailSlip); // Trả về thông tin nhân viên
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
};

//[PATCH] /admin/api/v1/order-slip/detail/update
module.exports.detailUpdatePatch = async (req, res) => {
    const connection = database.getConnection();
    var { dish, quantity, orderSlipId } = req.body;
    quantity = parseInt(quantity);
    try {
        await new Promise((resolve, reject) => {
            connection.query(`
              CALL AddDetailOrderSlipOffline(?,?,?)
            `, [orderSlipId, dish, quantity], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        req.flash("success", `Create successfully!`);
        res.redirect(`back`);
    } catch (error) {
        req.flash("error", `Create failed!`);
        res.redirect(`back`);
    } finally {
        process.on('SIGINT', () => {
            console.log('Đang tắt server...');
            database.disconnect(); // Đóng kết nối trước khi thoát
            process.exit(0);
        });
    }
};

//[DELETE] /admin/api/v1/order-slip/detail/delete:id
module.exports.detailDelete = async (req, res) => {
    const connection = database.getConnection();
    const id = req.params.id.split('_');
    try {
        // Thực hiện truy vấn employee
        await new Promise((resolve, reject) => {
            connection.query(`
                DELETE FROM CHITIETPHIEUDATOFFLINE
                WHERE MAPHIEUDATMON= ? AND MAMON =? ;
            `, [id[0], id[1]], (err, results) => {
                if (err) reject(err);
                else resolve([results]);
            });
        });
        req.flash("success", `Delete successfully`)
        res.redirect("back");
    } catch (error) {
        console.log(error);
        req.flash("error", `Delete failed!`);
        res.redirect(`back`);
    }
};

module.exports.createInvoice = async (req, res) => {
    const connection = database.getConnection();
    const user = res.locals.user[0];
    const id = req.params.id;
    try {
        await new Promise((resolve, reject) => {
            connection.query(`
            CALL TaoHoaDonPhieuDat(?,?)
        `, [id, 0], (err, results) => {
                if (err) reject(err);
                else resolve([results]);
            });
        });
        console.log("tạo thành công")
        req.flash("success", `Create successfully!`);
        res.redirect(`back`);
    } catch (error) {
        console.log(error);
        req.flash("error", `Create faild!`);
        res.redirect(`back`);
    }
};
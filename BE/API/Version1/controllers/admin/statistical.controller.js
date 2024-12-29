const database = require('../../../../config/database');
const moment = require('moment-timezone');

module.exports.index = async (req, res) => {
    res.render('admin/pages/statistical/index.pug', { data: null });
};
module.exports.branch = async (req, res) => {
    res.render('admin/pages/statistical/branch.pug', { data: null });
};

module.exports.dish = async (req, res) => {
    const connection = database.getConnection();
    try {
        const branchs = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT MACHINHANH, TENCHINHANH
                FROM CHINHANH 
                ORDER BY TENCHINHANH
            `, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        if (!branchs) {
            return res.status(404).json({ message: 'Nhân viên không tồn tại!' });
        }
        res.render('admin/pages/statistical/dish.pug', {
            pageTitle: "Doanh thu món ăn",
            branchs: branchs
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
};

module.exports.day = async (req, res) => {
    const connection = database.getConnection();
    const user = res.locals.user[0];
    const period = req.body.period;
    var startDates = req.body.start_date.filter(date => date.trim() !== '')[0]; // Loại bỏ giá trị rỗng hoặc chuỗi trống
    var endDates = req.body.end_date.filter(date => date.trim() !== '')[0];     // Loại bỏ giá trị rỗng hoặc chuỗi trống
    try {

        const statistic = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT HDOFF.NGAYTHANHTOAN AS NGAY, SUM(HDOFF.SOTIENTHANHTOAN) AS TONG_SOTIEN
                FROM PHIEUDATOFFLINE PDOFF 
                JOIN HOADONPHIEUDATOFFLINE HDOFF ON PDOFF.MAPHIEUDATMON = HDOFF.MAPHIEUDATMON
                WHERE PDOFF.MACHINHANH = ?
                AND HDOFF.NGAYTHANHTOAN BETWEEN ? AND ?
                GROUP BY HDOFF.NGAYTHANHTOAN
                ORDER BY HDOFF.NGAYTHANHTOAN ASC;
            `, [user.MACHINHANH, `${startDates}`, `${endDates}`], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        if (!statistic) {
            return res.status(404).json({ message: 'Nhân viên không tồn tại!' });
        }
        statistic.forEach(row => {
            row.NGAY = moment(row.NGAY).format('YYYY-MM-DD'); // Đảm bảo chỉ lấy phần ngày
        });
        res.render('admin/pages/statistical/index.pug', {
            pageTitle: "Quản lý doanh thu",
            data: statistic,
            search: [period, startDates, endDates]
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

module.exports.month = async (req, res) => {
    const connection = database.getConnection();
    const user = res.locals.user[0];
    const period = req.body.period;
    var startDates = req.body.start_date.filter(date => date.trim() !== '')[0]; // Loại bỏ giá trị rỗng hoặc chuỗi trống
    var endDates = req.body.end_date.filter(date => date.trim() !== '')[0];     // Loại bỏ giá trị rỗng hoặc chuỗi trống
    try {
        const statistic = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT 
                    DATE_FORMAT(HDOFF.NGAYTHANHTOAN, '%Y-%m') AS NGAY,
                    SUM(HDOFF.SOTIENTHANHTOAN) AS TONG_SOTIEN
                FROM PHIEUDATOFFLINE PDOFF 
                JOIN HOADONPHIEUDATOFFLINE HDOFF ON PDOFF.MAPHIEUDATMON = HDOFF.MAPHIEUDATMON
                WHERE PDOFF.MACHINHANH = ?
                AND DATE_FORMAT(HDOFF.NGAYTHANHTOAN, '%Y-%m') BETWEEN ? AND ?
                GROUP BY DATE_FORMAT(HDOFF.NGAYTHANHTOAN, '%Y-%m')
                ORDER BY NGAY ASC;

            `, [user.MACHINHANH, `${startDates}`, `${endDates}`], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        if (!statistic) {
            return res.status(404).json({ message: 'Nhân viên không tồn tại!' });
        }
        statistic.forEach(row => {
            row.NGAY = moment(row.NGAY).format('YYYY-MM'); // Đảm bảo chỉ lấy phần ngày
        });
        res.render('admin/pages/statistical/index.pug', {
            pageTitle: "Quản lý doanh thu",
            data: statistic,
            search: [period, startDates, endDates]
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


module.exports.quarter = async (req, res) => {
    const connection = database.getConnection();
    const user = res.locals.user[0];
    const period = req.body.period;

    var yearForQuarter = req.body.year_for_quarter
    try {
        const statistic = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT 
                    QUARTER(HDOFF.NGAYTHANHTOAN) AS NGAY,
                    SUM(HDOFF.SOTIENTHANHTOAN) AS TONG_SOTIEN
                FROM PHIEUDATOFFLINE PDOFF 
                JOIN HOADONPHIEUDATOFFLINE HDOFF ON PDOFF.MAPHIEUDATMON = HDOFF.MAPHIEUDATMON
                WHERE PDOFF.MACHINHANH = ?
                AND YEAR(HDOFF.NGAYTHANHTOAN) = ?
                GROUP BY QUARTER(HDOFF.NGAYTHANHTOAN)
                ORDER BY QUARTER(HDOFF.NGAYTHANHTOAN) ASC;

             `, [user.MACHINHANH, yearForQuarter], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        if (!statistic) {
            return res.status(404).json({ message: 'Nhân viên không tồn tại!' });
        }
        statistic.forEach(row => {
            row.NGAY = 'Quý ' + row.NGAY + " năm " + yearForQuarter;
        });
        res.render('admin/pages/statistical/index.pug', {
            pageTitle: "Quản lý doanh thu",
            data: statistic,
            search: [period, yearForQuarter]
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

module.exports.year = async (req, res) => {
    const connection = database.getConnection();
    const user = res.locals.user[0];
    const period = req.body.period;

    var startDates = req.body.start_date.filter(date => date.trim() !== '')[0]; // Loại bỏ giá trị rỗng hoặc chuỗi trống
    var endDates = req.body.end_date.filter(date => date.trim() !== '')[0];     // Loại bỏ giá trị rỗng hoặc chuỗi trống
    try {
        const statistic = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT 
                    YEAR(HDOFF.NGAYTHANHTOAN) AS NGAY,
                    SUM(HDOFF.SOTIENTHANHTOAN) AS TONG_SOTIEN
                FROM PHIEUDATOFFLINE PDOFF 
                JOIN HOADONPHIEUDATOFFLINE HDOFF ON PDOFF.MAPHIEUDATMON = HDOFF.MAPHIEUDATMON
                WHERE PDOFF.MACHINHANH = ?
                AND YEAR(HDOFF.NGAYTHANHTOAN) BETWEEN ? AND ?
                GROUP BY YEAR(HDOFF.NGAYTHANHTOAN)
                ORDER BY YEAR(HDOFF.NGAYTHANHTOAN) ASC;

             `, [user.MACHINHANH, startDates, endDates], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        if (!statistic) {
            return res.status(404).json({ message: 'Nhân viên không tồn tại!' });
        }
        res.render('admin/pages/statistical/index.pug', {
            pageTitle: "Quản lý doanh thu",
            data: statistic,
            search: [period]
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


module.exports.dayBranchs = async (req, res) => {
    const connection = database.getConnection();
    const user = res.locals.user[0];
    const period = req.body.period;
    console.log(req.body)
    var day = req.body.day
    try {
        const statistic = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT PDOFF.MACHINHANH,CN.TENCHINHANH AS NGAY, SUM(HDOFF.SOTIENTHANHTOAN) AS TONG_SOTIEN
                FROM PHIEUDATOFFLINE PDOFF
                JOIN HOADONPHIEUDATOFFLINE HDOFF ON PDOFF.MAPHIEUDATMON = HDOFF.MAPHIEUDATMON
                JOIN CHINHANH CN ON CN.MACHINHANH = PDOFF.MACHINHANH
                WHERE HDOFF.NGAYTHANHTOAN=?
                GROUP BY PDOFF.MACHINHANH, CN.TENCHINHANH
            `, [`${day}`], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        if (!statistic) {
            return res.status(404).json({ message: 'Dữ liệu không tồn tại!' });
        }
        const [_year, _month, _day] = day.split('-');
        res.render('admin/pages/statistical/branch.pug', {
            pageTitle: "Quản lý doanh thu",
            title: `Thống kê doanh thu ngày ${_day}-${_month}-${_year}`,
            data: statistic,
            search: [period, day]
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

module.exports.monthBranchs = async (req, res) => {
    const connection = database.getConnection();
    const user = res.locals.user[0];
    const period = req.body.period;
    var month = req.body.month
    try {
        const statistic = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT PDOFF.MACHINHANH,CN.TENCHINHANH AS NGAY, SUM(HDOFF.SOTIENTHANHTOAN) AS TONG_SOTIEN
                FROM PHIEUDATOFFLINE PDOFF
                JOIN HOADONPHIEUDATOFFLINE HDOFF ON PDOFF.MAPHIEUDATMON = HDOFF.MAPHIEUDATMON
                JOIN CHINHANH CN ON CN.MACHINHANH = PDOFF.MACHINHANH
                WHERE DATE_FORMAT(HDOFF.NGAYTHANHTOAN, '%Y-%m')=?
                GROUP BY PDOFF.MACHINHANH, CN.TENCHINHANH
            `, [`${month}`], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        if (!statistic) {
            return res.status(404).json({ message: 'Dữ liệu không tồn tại!' });
        }
        const [_year, _month] = month.split('-');
        res.render('admin/pages/statistical/branch.pug', {
            pageTitle: "Quản lý doanh thu",
            title: `Thống kê doanh thu tháng ${_month}-${_year}`,
            data: statistic,
            search: [period, month]
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

module.exports.quarterBranchs = async (req, res) => {
    const connection = database.getConnection();
    const user = res.locals.user[0];
    const period = req.body.period;
    var yearForQuarter = req.body.year_for_quarter;
    var quartar = req.body.quarter;
    try {
        const statistic = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT PDOFF.MACHINHANH,CN.TENCHINHANH AS NGAY, SUM(HDOFF.SOTIENTHANHTOAN) AS TONG_SOTIEN
                FROM PHIEUDATOFFLINE PDOFF
                JOIN HOADONPHIEUDATOFFLINE HDOFF ON PDOFF.MAPHIEUDATMON = HDOFF.MAPHIEUDATMON
                JOIN CHINHANH CN ON CN.MACHINHANH = PDOFF.MACHINHANH
                WHERE YEAR(HDOFF.NGAYTHANHTOAN)=? AND QUARTER(HDOFF.NGAYTHANHTOAN)=?
                GROUP BY PDOFF.MACHINHANH, CN.TENCHINHANH
            `, [yearForQuarter, quartar], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        if (!statistic) {
            return res.status(404).json({ message: 'Dữ liệu không tồn tại!' });
        }
        res.render('admin/pages/statistical/branch.pug', {
            pageTitle: "Quản lý doanh thu",
            title: `Thống kê doanh thu quý ${quartar} năm ${yearForQuarter}`,
            data: statistic,
            search: [period, yearForQuarter, quartar]
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

module.exports.yearBranchs = async (req, res) => {
    const connection = database.getConnection();
    const user = res.locals.user[0];
    const period = req.body.period;
    var year = req.body.year;
    try {
        const statistic = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT PDOFF.MACHINHANH,CN.TENCHINHANH AS NGAY, SUM(HDOFF.SOTIENTHANHTOAN) AS TONG_SOTIEN
                FROM PHIEUDATOFFLINE PDOFF
                JOIN HOADONPHIEUDATOFFLINE HDOFF ON PDOFF.MAPHIEUDATMON = HDOFF.MAPHIEUDATMON
                JOIN CHINHANH CN ON CN.MACHINHANH = PDOFF.MACHINHANH
                WHERE YEAR(HDOFF.NGAYTHANHTOAN)=?
                GROUP BY PDOFF.MACHINHANH, CN.TENCHINHANH
            `, [year], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        if (!statistic) {
            return res.status(404).json({ message: 'Dữ liệu không tồn tại!' });
        }
        res.render('admin/pages/statistical/branch.pug', {
            pageTitle: "Quản lý doanh thu",
            title: "Thống kê doanh thu năm " + year,
            data: statistic,
            search: [period, year]
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

module.exports.dayDishs = async (req, res) => {
    const connection = database.getConnection();
    const user = res.locals.user[0];
    const period = req.body.period;
    console.log(req.body)
    var branchId = req.body.branchId;
    var day = req.body.day;
    const [_year, _month, _day] = day.split('-');
    try {
        const [branch] = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT MACHINHANH, TENCHINHANH
                FROM CHINHANH 
                WHERE MACHINHANH =?
            `, [branchId], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        const branchs = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT MACHINHANH, TENCHINHANH
                FROM CHINHANH 
                ORDER BY TENCHINHANH
            `, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        const statistic = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT MA.MAMON, MA.TENMON AS NGAY,SUM(CTOFF.SOLUONG) AS SOLUONG, SUM(HDOFF.SOTIENTHANHTOAN) AS TONG_SOTIEN
                FROM PHIEUDATOFFLINE PDOFF
                JOIN HOADONPHIEUDATOFFLINE HDOFF ON PDOFF.MAPHIEUDATMON = HDOFF.MAPHIEUDATMON
                JOIN CHITIETPHIEUDATOFFLINE CTOFF ON CTOFF.MAPHIEUDATMON=PDOFF.MAPHIEUDATMON
                JOIN CHINHANH CN ON CN.MACHINHANH = PDOFF.MACHINHANH
                JOIN MONAN MA ON MA.MAMON=CTOFF.MAMON
                WHERE CN.MACHINHANH=? AND HDOFF.NGAYTHANHTOAN=?
                GROUP BY MA.MAMON, MA.TENMON
            `, [branchId, day], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        if (!statistic) {
            return res.status(404).json({ message: 'Dữ liệu không tồn tại!' });
        }
        res.render('admin/pages/statistical/dish.pug', {
            pageTitle: "Quản lý doanh thu",
            title1: `Thống kê doanh thu chi nhánh ${branch.TENCHINHANH} theo món ăn ngày ${_day}-${_month}-${_year}`,
            title2: `Thống kê số lượng món ăn đã bán của chi nhánh ${branch.TENCHINHANH} ngày ${_day}-${_month}-${_year}`,
            data: statistic,
            branchs,
            search: [period, day]
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

module.exports.monthDishs = async (req, res) => {
    const connection = database.getConnection();
    const user = res.locals.user[0];
    const period = req.body.period;
    console.log(req.body)
    var branchId = req.body.branchId;
    var month = req.body.month;
    const [_year, _month] = month.split('-');
    try {
        const [branch] = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT MACHINHANH, TENCHINHANH
                FROM CHINHANH 
                WHERE MACHINHANH =?
            `, [branchId], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        const branchs = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT MACHINHANH, TENCHINHANH
                FROM CHINHANH 
                ORDER BY TENCHINHANH
            `, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        const statistic = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT MA.MAMON, MA.TENMON AS NGAY,SUM(CTOFF.SOLUONG) AS SOLUONG, SUM(HDOFF.SOTIENTHANHTOAN) AS TONG_SOTIEN
                FROM PHIEUDATOFFLINE PDOFF
                JOIN HOADONPHIEUDATOFFLINE HDOFF ON PDOFF.MAPHIEUDATMON = HDOFF.MAPHIEUDATMON
                JOIN CHITIETPHIEUDATOFFLINE CTOFF ON CTOFF.MAPHIEUDATMON=PDOFF.MAPHIEUDATMON
                JOIN CHINHANH CN ON CN.MACHINHANH = PDOFF.MACHINHANH
                JOIN MONAN MA ON MA.MAMON=CTOFF.MAMON
                WHERE CN.MACHINHANH=? AND DATE_FORMAT(HDOFF.NGAYTHANHTOAN, '%Y-%m')=?
                GROUP BY MA.MAMON, MA.TENMON
            `, [branchId, month], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        if (!statistic) {
            return res.status(404).json({ message: 'Dữ liệu không tồn tại!' });
        }
        res.render('admin/pages/statistical/dish.pug', {
            pageTitle: "Quản lý doanh thu",
            title1: `Thống kê doanh thu chi nhánh ${branch.TENCHINHANH} theo món ăn ngày ${_month}-${_year}`,
            title2: `Thống kê số lượng món ăn đã bán của chi nhánh ${branch.TENCHINHANH} ngày ${_month}-${_year}`,
            data: statistic,
            branchs,
            search: [period, month]
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
module.exports.quarterDishs = async (req, res) => {
    const connection = database.getConnection();
    const user = res.locals.user[0];
    const period = req.body.period;
    console.log(req.body)
    var branchId = req.body.branchId;
    var yearForQuarter = req.body.year_for_quarter;
    var quartar = req.body.quarter;
    try {
        const [branch] = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT MACHINHANH, TENCHINHANH
                FROM CHINHANH 
                WHERE MACHINHANH =?
            `, [branchId], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        const branchs = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT MACHINHANH, TENCHINHANH
                FROM CHINHANH 
                ORDER BY TENCHINHANH
            `, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        const statistic = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT MA.MAMON, MA.TENMON AS NGAY,SUM(CTOFF.SOLUONG) AS SOLUONG, SUM(HDOFF.SOTIENTHANHTOAN) AS TONG_SOTIEN
                FROM PHIEUDATOFFLINE PDOFF
                JOIN HOADONPHIEUDATOFFLINE HDOFF ON PDOFF.MAPHIEUDATMON = HDOFF.MAPHIEUDATMON
                JOIN CHITIETPHIEUDATOFFLINE CTOFF ON CTOFF.MAPHIEUDATMON=PDOFF.MAPHIEUDATMON
                JOIN CHINHANH CN ON CN.MACHINHANH = PDOFF.MACHINHANH
                JOIN MONAN MA ON MA.MAMON=CTOFF.MAMON
                WHERE CN.MACHINHANH=? AND YEAR(HDOFF.NGAYTHANHTOAN)=? AND QUARTER(HDOFF.NGAYTHANHTOAN)=?
                GROUP BY MA.MAMON, MA.TENMON
            `, [branchId, yearForQuarter, quartar], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        if (!statistic) {
            return res.status(404).json({ message: 'Dữ liệu không tồn tại!' });
        }
        res.render('admin/pages/statistical/dish.pug', {
            pageTitle: "Quản lý doanh thu",
            title1: `Thống kê doanh thu chi nhánh ${branch.TENCHINHANH} theo món ăn quý ${quartar}-${yearForQuarter}`,
            title2: `Thống kê số lượng món ăn đã bán của chi nhánh ${branch.TENCHINHANH} quý ${quartar}-${yearForQuarter}`,
            data: statistic,
            branchs,
            search: [period]
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

module.exports.yearDishs = async (req, res) => {
    const connection = database.getConnection();
    const user = res.locals.user[0];
    const period = req.body.period;
    var branchId = req.body.branchId;
    var year = req.body.year;
    try {
        const [branch] = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT MACHINHANH, TENCHINHANH
                FROM CHINHANH 
                WHERE MACHINHANH =?
            `, [branchId], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        const branchs = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT MACHINHANH, TENCHINHANH
                FROM CHINHANH 
                ORDER BY TENCHINHANH
            `, (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });
        const statistic = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT MA.MAMON, MA.TENMON AS NGAY,SUM(CTOFF.SOLUONG) AS SOLUONG, SUM(HDOFF.SOTIENTHANHTOAN) AS TONG_SOTIEN
                FROM PHIEUDATOFFLINE PDOFF
                JOIN HOADONPHIEUDATOFFLINE HDOFF ON PDOFF.MAPHIEUDATMON = HDOFF.MAPHIEUDATMON
                JOIN CHITIETPHIEUDATOFFLINE CTOFF ON CTOFF.MAPHIEUDATMON=PDOFF.MAPHIEUDATMON
                JOIN CHINHANH CN ON CN.MACHINHANH = PDOFF.MACHINHANH
                JOIN MONAN MA ON MA.MAMON=CTOFF.MAMON
                WHERE CN.MACHINHANH=? AND YEAR(HDOFF.NGAYTHANHTOAN)=?
                GROUP BY MA.MAMON, MA.TENMON
            `, [branchId, year], (err, results) => {
                if (err) reject(err);
                else resolve(results);
            });
        });

        if (!statistic) {
            return res.status(404).json({ message: 'Dữ liệu không tồn tại!' });
        }
        res.render('admin/pages/statistical/dish.pug', {
            pageTitle: "Quản lý doanh thu",
            title1: `Thống kê doanh thu chi nhánh ${branch.TENCHINHANH} theo món ăn năm ${year}`,
            title2: `Thống kê số lượng món ăn đã bán của chi nhánh ${branch.TENCHINHANH} năm ${year}`,
            data: statistic,
            branchs,
            search: [period]
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
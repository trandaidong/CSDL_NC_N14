const database = require('../../../../config/database');
const moment = require('moment-timezone');

module.exports.index = async (req, res) => {
    res.render('admin/pages/scores/index.pug', { data: null});
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
                SELECT *
                FROM NHANVIEN NV 
                JOIN DANHGIA DG ON NV.MANHANVIEN=
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
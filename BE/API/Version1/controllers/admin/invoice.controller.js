const database = require('../../../../config/database');


//[GET] /admin/api/v1/invoice/index
module.exports.index = async (req, res) => {
    const connection = database.getConnection();
    var customer_id = null;
    var start_date = null;
    var end_date = null;
    if (req.query.customer_id) {
        customer_id = req.query.customer_id;
    }
    if (req.query.start_date) {
        start_date = req.query.start_date;
    }
    if (req.query.end_date) {
        end_date = req.query.end_date;
    }
    try {
        // Thực hiện truy vấn hóa đơn offline
        const [OfflineInvoices] = await new Promise((resolve, reject) => {
            connection.query(`
                SELECT HDOFF.MAHOADON, KH.FULLNAME, HDOFF.NGAYTHANHTOAN, HDOFF.TONGTIEN, HDOFF.SOTIENGIAM, HDOFF.SOTIENTHANHTOAN
                FROM HOADONPHIEUDATOFFLINE HDOFF
                JOIN PHIEUDATOFFLINE PDOFF ON HDOFF.MAPHIEUDATMON=PDOFF.MAPHIEUDATMON
                JOIN KHACHHANG KH ON PDOFF.MAKHACHHANG=KH.MAKHACHHANG
                WHERE
                    ((KH.FULLNAME LIKE ? OR KH.MAKHACHHANG = ?) OR (? IS NULL)) AND
                    ((? IS NULL AND ? IS NULL) OR HDOFF.NGAYTHANHTOAN BETWEEN ? AND ?)
                ORDER BY HDOFF.MAHOADON DESC
                LIMIT 100;
                `, ['%' + customer_id + '%', customer_id, customer_id, start_date, end_date, start_date,end_date], (err, results) => {
                if (err) reject(err);
                else resolve([results]);
            });
        });


        // Render dữ liệu ra giao diện
        res.render('admin/pages/invoices/index.pug', {
            pageTitle: "Quản lý hóa đơn",
            invoices: OfflineInvoices,
            searchs: req.query
        });
    } catch (error) {
        console.error('Lỗi truy vấn:', error);
        res.status(500).send("Lỗi lấy dữ liệu từ cơ sở dữ liệu.");
    }finally {
            process.on('SIGINT', () => {
                console.log('Đang tắt server...');
                database.disconnect(); // Đóng kết nối trước khi thoát
                process.exit(0);
            });
        }
};
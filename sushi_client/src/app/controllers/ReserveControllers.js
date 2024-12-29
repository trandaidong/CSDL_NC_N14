const ReserveModel = require('..\\models\\ReserveModel'); // Import model

class ReserveControllers {
    async index(req, res) {
        res.render('reserveOnline',{layout:'main'});
    }
    async renderReserve(req, res) {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ error: 'Email không hợp lệ.' });
        }
    
        try {
            const reserveResult = await ReserveModel.getPayment(email);
       
           
            if (Array.isArray(reserveResult) && Array.isArray(reserveResult[0])) {
                const reserveData = reserveResult[0][0]; // Lấy phần tử đầu tiên
                console.log('Dữ liệu gửi đến frontend:', reserveResult);
    
                return res.json(reserveData || { error: 'Không có dữ liệu thanh toán.' });
            } else {
                return res.status(500).json({ error: 'Dữ liệu trả về không hợp lệ.' });
            }
        } catch (err) {
            console.error('Lỗi khi xử lý thanh toán:', err);
            res.status(500).json({ error: 'Lỗi server.' });
        }
    }
    async handleReserve(req, res) {
        const {email,branchID,note,table,day,hours} = req.body; 
    
        // Kiểm tra tham số
        if (!email || !note  ||!branchID || !table||!day||!hours) {
            console.log(note);
            console.log(table);
            console.log(branchID);
            console.log(day);
            console.log(hours);
            console.log(email);
            return res.status(400).json({ error: 'Thiếu thông tin cần thiết.' });
        }

        console.log(note);
            console.log(table);
            console.log(branchID);
            console.log(day);
            console.log(hours);
            console.log(email);
    
        try {
            const handleReserve = await ReserveModel.ReserveOnline(email,branchID,note,table,day,hours);    
            // Kiểm tra kết quả trả về từ model
            if (handleReserve) {
                return res.json({ message: 'đặt bàn oke' });
            } else {
                return res.status(404).json({ error: 'Không thể đặt bàn nhá' });
            }
        } catch (err) {
            console.error('Lỗi khi đặt bàn nha:', err);
            return res.status(500).json({ error: 'Đã xảy ra lỗi khi đặt bàn nhá' });
        }
    }
    
}

module.exports = new ReserveControllers();
const PaymentModel = require('..\\models\\PaymentModel'); // Import model

class PaymentControllers {
    async index(req, res) {
        res.render('payment',{layout:'main'});
    }

    async rendePayment(req, res) {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ error: 'Email không hợp lệ.' });
        }
    
        try {
            const paymentResult = await PaymentModel.getPayment(email);
       
           
            if (Array.isArray(paymentResult) && Array.isArray(paymentResult[0])) {
                const paymentData = paymentResult[0][0]; // Lấy phần tử đầu tiên
              //  console.log('Dữ liệu gửi đến frontend:', paymentData);
    
                // Trả dữ liệu JSON
                return res.json(paymentData || { error: 'Không có dữ liệu thanh toán.' });
            } else {
                return res.status(500).json({ error: 'Dữ liệu trả về không hợp lệ.' });
            }
        } catch (err) {
            console.error('Lỗi khi xử lý thanh toán:', err);
            res.status(500).json({ error: 'Lỗi server.' });
        }
    }

    async handlePayment(req, res) {
        const {note,email,address,branchID} = req.body; 
    
        // Kiểm tra tham số
        if (!email || !note || !address ||!branchID) {
            console.log(note);
            console.log(address);
            console.log(branchID);
            console.log(email);
            return res.status(400).json({ error: 'Thiếu thông tin cần thiết.' });
        }
    
        try {
            const handleConfirm = await PaymentModel.confirmPayment(note,email,address,branchID);

            
            console.log(branchID);
            console.log(email);
    
            // Kiểm tra kết quả trả về từ model
            if (handleConfirm ) {
                return res.json({ message: 'Thanh toán oke' });
            } else {
                return res.status(404).json({ error: 'Không thể thanh toán nhá' });
            }
        } catch (err) {
            console.error('Lỗi khi thanh toán nha:', err);
            return res.status(500).json({ error: 'Đã xảy ra lỗi khi thanh toán nhá.' });
        }
    }
    
}

module.exports = new PaymentControllers();
const HomeModel = require('..\\models\\HomeModel'); // Import model

class HomeController {
    index(req,res) {
        HomeModel.getAllProducts((err, products_outstanding) => {
            if (err) {
                console.error('Lỗi khi lấy dữ liệu:', err);
                return res.status(500).send('Lỗi server');
            }
          //  console.log('Dữ liệu gửi tới view:', products_outstanding); // Log dữ liệu
            res.render('home', { 
                products_outstanding,
                layout: 'main'
             });
        });
    }
}


module.exports = new HomeController();

// Library
const express = require("express");
const bodyParser = require('body-parser')// thư viện chuyển đổi data trong req.body có thể usable
const cookieParser = require('cookie-parser')
const methodOverride = require('method-override')// thư viện ghi đè method các phương thức PATH..
const flash = require('express-flash')
const session = require('express-session')
const moment = require('moment'); // thư viện chuyển đổi time timestamp-> time

const database = require('./config/database');
const routerAdminV1 =require("./API/Version1/routers/admin/index.router");
const systemConfig = require("./config/system");


require('dotenv').config()

const app = express();
const port = 3002;
try {
    database.connect();
} catch (err) {
    console.error('Lỗi kết nối cơ sở dữ liệu:', err.message);
    process.exit(1); // Thoát ứng dụng nếu không thể kết nối
}

process.on('SIGINT', () => {
    console.log('Đang tắt server...');
    database.disconnect(); // Đóng kết nối trước khi thoát
    process.exit(0);
});

app.use(methodOverride('_method')) // override
app.use(bodyParser.urlencoded({ extended: false }))// encode chuyển đổi res.body => dữ liệu

// __dirname có tác dụng khi deploy code lên server nó có tác dụng như cái folder tổng 
// để tìm đến các folder khác nếu chạy ở local thì nố vẫn có tác dụng như vậy
//app.set('views', `${__dirname}/public`);
app.set('views', `views`);
app.set("view engine", 'pug');

app.use(express.static(`public`));

app.use(cookieParser('123456789_ABC'));

// Flash
app.use(cookieParser('123456789_ABC'));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
// End flash

// tạo biến prefĩAdmin có thể gọi ở tất cả các file pug của chương trình
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

routerAdminV1(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})

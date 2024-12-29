// database.js
const mysql = require('mysql2');

// Tạo kết nối đến MySQL
let connection = null;

function connect() {
    connection = mysql.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'sushi_data',
    });

    connection.connect((err) => {
        if (err) {
            console.error('Lỗi kết nối MySQL:', err);
            return;
        }
        console.log('Kết nối thành công đến MySQL!');
    });
}

// Hàm trả về kết nối hiện tại
function getConnection() {
    if (!connection) {
        throw new Error('Chưa kết nối đến cơ sở dữ liệu. Gọi hàm connect() trước.');
    }
    return connection;
}
// Hàm đóng kết nối
function disconnect() {
    if (connection) {
        connection.end((err) => {
            if (err) {
                console.error('Lỗi khi đóng kết nối MySQL:', err);
                return;
            }
            console.log('Kết nối MySQL đã được đóng!');
        });
        connection = null; // Reset connection về null
    }
}
module.exports = { connect, getConnection ,disconnect};

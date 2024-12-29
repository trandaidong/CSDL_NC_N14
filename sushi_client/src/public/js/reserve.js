var reserveApi = "http://localhost:3000/reserveOnline/api"

var payreserveApi="http://localhost:3000/reserveOnline/api/reserve"
function handleGetReserve(callback) {
    document.addEventListener("DOMContentLoaded", function () {
        const email = sessionStorage.getItem("email");
        if(!email)
            return;
        console.log(reserveApi+sessionStorage.getItem("email"));
        fetch(`${reserveApi}?email=${sessionStorage.getItem("email")}`)
            .then(function (response) {
                return response.json();  
            })
            .then(callback)
            .catch(function(error) {
                console.error('Lỗi khi gọi API: ', error);
               
            });
    });
    
}
    
function renderReserve(result) {
    var listPayment = document.querySelector('.add-render');
    if (!listPayment) return;

    // Định dạng tiền tệ
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    // Tính tổng tiền bao gồm phí giao hàng
    const shippingFee = 0;
    const totalWithShipping = parseFloat(result.TongTienSauKhuyenMai) + shippingFee;

    // Nội dung HTML
    var htmls = `
        <div>
            <p>Tổng số tiền</p>
            <span>${formatCurrency(result.TongTienTruocKhuyenMai)}</span>
        </div>
        <div>
            <p>Khuyến Mãi</p>
            <span>${result.PhanTramKhuyenMai}% (${result.Hang})</span>
        </div>
        <div>
            <p>Số tiền thanh toán</p>
            <span>${formatCurrency(totalWithShipping)}</span>
        </div>
    `;

    listPayment.innerHTML = htmls;
    handleReserve();
}

function handleReserve() {
    var btn = document.querySelector('.reserve-btn'); // Chọn button Đặt bàn ngay
    if (!btn) return;

    btn.onclick = function() {
        // Lấy các giá trị từ các input
        var table = document.getElementById('tableSelect').value; // Lấy giá trị bàn đã chọn
        var date = document.getElementById('dateSelect').value; // Lấy giá trị ngày đã chọn
        var time = document.getElementById('timeSelect').value+':00'; // Lấy giá trị giờ đã chọn
        var note = document.querySelector('.note-input').value; // Lấy giá trị ghi chú
        console.log(time);
        console.log(date);

        // Kiểm tra các trường bắt buộc có được chọn hay không
        if (!table || !date || !time) {
            alert('Vui lòng điền đầy đủ thông tin: Bàn, Ngày và Giờ.');
            return;
        }

        // Tạo dữ liệu gửi đi (có thể cần điều chỉnh tùy vào API yêu cầu)
        var requestData = {
            note: note,
            email: sessionStorage.getItem("email"),
            branchID:sessionStorage.getItem("branchID"),
            table: table,
            day: date,
            hours: time
        };

        // Gửi yêu cầu POST tới API
        fetch(payreserveApi, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            alert('Đặt bàn thành công.');
            window.location.href = 'http://localhost:3000/';
        })
        .catch((error) => {
            alert('Đặt bàn không thành công. Vui lòng thử lại.');
        });
    }
}

handleGetReserve( renderReserve);
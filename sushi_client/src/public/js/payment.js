var paymentApi = "http://localhost:3000/paymentonline/api"

var payConfirmApi="http://localhost:3000/paymentonline/api/confirm"
function handleGetPayment(callback) {
    document.addEventListener("DOMContentLoaded", function () {
        const email = sessionStorage.getItem("email");
        if(!email)
            return;
        fetch(`${paymentApi}?email=${sessionStorage.getItem("email")}`)
            .then(function (response) {
                return response.json();  
            })
            .then(callback)
            .catch(function(error) {
                console.error('Lỗi khi gọi API: ', error);
               
            });
    });
    
}
    
function renderPayment(result) {
    var listPayment = document.querySelector('.payment-container');
    if (!listPayment) return;

    // Định dạng tiền tệ
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    // Tính tổng tiền bao gồm phí giao hàng
    const shippingFee = 30000;
    const totalWithShipping = parseFloat(result.TongTienSauKhuyenMai) + shippingFee;

    // Nội dung HTML
    var htmls = `
        <div class="voucher">
            <i class="ti-gift"></i>
            <select>
                <option value="" disabled selected>Chọn hình thức thanh toán</option>
                <option>Thanh toán khi nhận hàng</option>
                <option>Thanh toán bằng VNPAY</option>
                <option>Thanh toán bằng Ngân hàng</option>
                <option>Thanh toán bằng Ví MOMO</option>
            </select>
        </div>
        <div>
            <p>Tổng số tiền</p>
            <span>${formatCurrency(result.TongTienTruocKhuyenMai)}</span>
        </div>
        <div>
            <p>Khuyến Mãi</p>
            <span>${result.PhanTramKhuyenMai}% (${result.Hang})</span>
        </div>
        <div>
            <p>Phí giao hàng</p>
            <span>${formatCurrency(shippingFee)}</span>
        </div>
        <div>
            <p>Số tiền thanh toán</p>
            <span>${formatCurrency(totalWithShipping)}</span>
        </div>
        <input name="note_payment" type="text" placeholder="Thêm ghi chú" />
        <button id="payment">Xác nhận thanh toán</button>
    `;

    listPayment.innerHTML = htmls;
    handleConfirm();
}

function handleConfirm(){
    var btnPay=document.querySelector('#payment');
    if(!btnPay) return;
    btnPay.onclick=function(){
        var note=document.querySelector('input[name="note_payment"]').value;
        var address=document.querySelector('input[name="address-payment"]').value;
        console.log(note);
            console.log(address);
        fetch(payConfirmApi,{
            method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    note: note,
                    email:sessionStorage.getItem("email"),
                    address:address,
                    branchID:sessionStorage.getItem("branchID")
                })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            alert('thanh toán oke.')  
            window.location.href = 'http://localhost:3000/';
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('thanh toán không oke');
        });

    }
}

handleGetPayment(renderPayment);



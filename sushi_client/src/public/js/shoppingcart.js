
var CartApi = "http://localhost:3000/shopping_cart/api"; 
var CartApiRemove = "http://localhost:3000/shopping_cart/api/remove";
var CartApiUpdate = "http://localhost:3000/shopping_cart/api/update";
var payment = "http://localhost:3000/paymentonline/checkout"



function handleGetCart(callback) {
    document.addEventListener("DOMContentLoaded", function () {
        fetch(`${CartApi}?email=${sessionStorage.getItem("email")}`)
            .then(function (response) {
                return response.json();  
            })
            .then(callback)
            .catch(function(error) {
                console.error('Lỗi khi gọi API: ', error);
               
            });
    });
    
}
    
function renderCart(carts) {
    var listDish = document.querySelector('.shopping-cartContainer');
    if(!listDish)
        return;
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    var htmls = carts.map(function (dish) {
        return `
            <li class="cart-item" data-mamon="${dish.mamon}">
                <div class="description">
                    <div class="cart-item_img">
                        <img src="${dish.url}" alt="${dish.tenmon}">  
                    </div>
                    <div class="cart-item_des">
                        <p>${dish.tenmon}</p>
                    </div>
                </div>

                <div class="cart-item_kind">
                    <span>${dish.tenloai}</span>
                </div>

                <div class="cart-item_price">
                    <p>${formatCurrency(dish.gia)}</p>
                </div>
                <div class="cart-item_quantity">
                    <button class="quantity-btn decrease">-</button>
                    <input type="text" class="quantity-input" value="${dish.soluong}" readonly>
                    <button class="quantity-btn increase">+</button>
                </div>

                <div class="cart-item_remove">
                    <i class="ti-close"></i>
                </div>
            </li>
        `;
    });
    listDish.innerHTML = htmls.join('');

    // Sau khi render xong, gắn sự kiện tăng/giảm số lượng
    attachQuantityEvents();
    attachRemoveEvents();

    
}

function attachQuantityEvents() {
    const quantityContainers = document.querySelectorAll(".cart-item_quantity");

    quantityContainers.forEach(container => {
        const decreaseBtn = container.querySelector(".decrease");
        const increaseBtn = container.querySelector(".increase");
        const quantityInput = container.querySelector(".quantity-input");
        const cartItem = container.closest('.cart-item'); // Lấy cart-item chứa container
        const dishId = cartItem.getAttribute('data-mamon'); // Lấy dishId từ data-mamon

        // Xử lý nút giảm
        decreaseBtn.addEventListener("click", () => {
            let currentValue = parseInt(quantityInput.value);
        
            if (currentValue > 1) {
                const newQuantity = currentValue - 1;
                quantityInput.value = newQuantity; // Cập nhật giao diện
                handleUpdateQuantity(dishId, newQuantity); // Gửi request update
            }
        });

        // Xử lý nút tăng
        increaseBtn.addEventListener("click", () => {
            let currentValue = parseInt(quantityInput.value);
            quantityInput.value = currentValue + 1;
            handleUpdateQuantity(dishId, currentValue + 1); // Gửi request update
        });
    });
}

function handleUpdateQuantity(dishId, newQuantity) {
    const email = sessionStorage.getItem("email");
    // Gửi yêu cầu cập nhật đến backend
    fetch(CartApiUpdate, {
        method: 'POST', // Sử dụng POST để gửi dữ liệu
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            id: dishId,
            quantity: newQuantity
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Lỗi khi cập nhật số lượng');
        }
        return response.json();
    })
    .then(updatedCart => {
        console.log("Giỏ hàng đã được cập nhật:", updatedCart);
    
        // Kiểm tra và render lại giỏ hàng
        if (Array.isArray(updatedCart)) {
            renderCart(updatedCart);
        } else {
            console.error("Dữ liệu trả về không hợp lệ:", updatedCart);
        }
    })
    
    .catch(error => console.error('Lỗi khi gửi yêu cầu cập nhật số lượng:', error));
}


function handleRemoveItem(cartItem, dishId) {
    const email = sessionStorage.getItem("email");

    // Xóa món ăn khỏi giao diện
    cartItem.remove();
    
    fetch(`http://localhost:3000/shopping_cart/api/remove?email=${email}&id=${dishId}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Lỗi khi xóa món ăn');
        }

        return fetch(`${CartApi}?email=${email}`);
    })
    .then(response => response.json())
    .then(updatedCart => {
        // Cập nhật lại giao diện với giỏ hàng mới
        renderCart(updatedCart);
        console.log(`Món ăn ${dishId} đã được xóa thành công trong gio hang ${email}`);
    })
    .catch(error => console.error('Lỗi khi gửi yêu cầu xóa:', error));
}

// Hàm gắn sự kiện xóa món ăn
function attachRemoveEvents() {
    const removeButtons = document.querySelectorAll('.cart-item_remove i');
    removeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const cartItem = this.closest('.cart-item');
            const dishId = cartItem.getAttribute('data-mamon');
            handleRemoveItem(cartItem, dishId); // Gọi hàm xóa món ăn
        });
    });
}




handleGetCart(renderCart);
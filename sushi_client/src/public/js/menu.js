
var searchApi = "http://localhost:3000/menu/api_search"; 
var cartApi="http://localhost:3000/menu/api_cart"

function handleCart(){
    var btnCarts=document.querySelectorAll('.addCart');
    btnCarts.forEach(function(btnCart) {  
        btnCart.onclick = function(){
            var parentLi = btnCart.closest('li');  
            var mamon = parentLi.getAttribute('data-mamon');  
            fetch(cartApi, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    mamon: mamon,
                    email:sessionStorage.getItem("email")
                })
            })
            .then(response => response.json())  
            .then(data => {
                console.log('Success:', data);
                alert('thêm món vào giỏ hàng thành công.')  
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Đã xảy ra lỗi khi thêm món vào giỏ hàng.');
            });
        }
    });
    
}

function handleGetSearch(callback) {
    var btnSearch = document.querySelector('#button-menu');
    if (!btnSearch) return;
    btnSearch.onclick = function () {
        var branchId = document.querySelector('#type-of-branch').value;
        var dishTypeId = document.querySelector('#type-of-dish').value;
        var priceRange = document.querySelector('#type-of-price').value;
        sessionStorage.setItem('branchID',branchId);
        fetch(`${searchApi}?branchId=${branchId}&dishTypeId=${dishTypeId}&priceRange=${priceRange}`)
            .then(function (response) {
                return response.json();  
            })
            .then(callback)
            .catch(function(error) {
                console.error('Lỗi khi gọi API: ', error);
                alert('Đã xảy ra lỗi khi tải dữ liệu.');
            });
    }
}


function renderSearch(searchs) {
    var listDish = document.querySelector('.content-menu');
    // Render danh sách món ăn
    var htmls = searchs.map(function (dish) {
        console.log(dish.GIA);
        return `
            <li data-mamon="${dish.MAMON}">
                <div><button class="addCart">+</button></div>
                <div class="img-products-branch">
                    <img src="${dish.URL}" alt="${dish.TENMON}" class="img-branch">
                </div>
                <p>${dish.TENMON}</p>
                <p>${dish.MOTA}</p>
                <p>${dish.GIA}</p>    
            </li>
        `;
    });

    // Cập nhật nội dung danh sách
    listDish.innerHTML = htmls.join('');
    
    // Xử lý giỏ hàng sau khi render
    handleCart();
}




handleGetSearch(renderSearch);
handleCart();

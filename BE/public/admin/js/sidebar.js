$(document).ready(function(){
    $('.sub-btn').click(function(e){
        e.preventDefault(); // Ngăn chặn hành vi mặc định
        $(this).next('.sub-menu').slideToggle(); // Mở hoặc thu gọn menu con
        $(this).find('.dropdown').toggleClass('rotate'); // Xoay icon
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const openModalButton = document.getElementById('openModalButton');
    const modalOverlay = document.getElementById('modalOverlay');
    const addPlaneButton = document.getElementById('addPlaneButton');
    const closeModalButton = document.getElementById('closeModalButton'); // Nút đóng modal

    // Thiết lập sự kiện nhấn nút mở modal
    openModalButton.addEventListener('click', function() {
        modalOverlay.style.display = 'flex'; // Hiển thị modal với display: flex;
        document.body.style.overflow = 'hidden'; // Ngăn cuộn trang khi modal hiển thị
    });

    // Thiết lập sự kiện nhấn nút thêm máy bay
    addPlaneButton.addEventListener('click', function() {  
        modalOverlay.style.display = 'none'; // Đóng modal
        document.body.style.overflow = 'auto'; // Bật lại cuộn trang
    });

    // Sự kiện nhấn nút đóng modal (X)
    closeModalButton.addEventListener('click', function() {
       modalOverlay.style.display = 'none'; // Đóng modal
       document.body.style.overflow = 'auto'; // Bật lại cuộn trang
    });
});


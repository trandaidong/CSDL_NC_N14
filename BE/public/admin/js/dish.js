const clearForm = (form) => {
    if (!form) return;
    form.querySelectorAll("input, select, textarea").forEach(field => {
        field.value = ""; // Xóa giá trị của từng field
        if (field.type === "checkbox" || field.type === "radio") {
            field.checked = false; // Bỏ chọn checkbox và radio
        }
    });
};

document.addEventListener('DOMContentLoaded', function() {
    const openModalButton = document.getElementById('openModalButton');
    const modalOverlay = document.getElementById('modalOverlay');
    const addEmployeeButton = document.getElementById('addPlaneButton');
    const closeModalButton = document.getElementById('closeModalButton'); // Nút đóng modal
    const saveButton = document.querySelector('.save-button');
    const modalTitle=document.querySelector('.modalTitle');
    const formModal = document.querySelector('.modal');
    const buttonUpdateItem = document.querySelectorAll("[button-update-item]");
   

    // update
    if (buttonUpdateItem.length) {
        buttonUpdateItem.forEach(button => {
            button.removeEventListener('click', updateEmployeeModal); // Xóa sự kiện cũ (nếu có)
            button.addEventListener('click', updateEmployeeModal);
            async function updateEmployeeModal() {
                const id = button.getAttribute("button-id");
                try {
                    const response = await fetch(`/admin/api/v1/dishs/update/${id}`);
                    if (!response.ok) throw new Error('Failed to fetch dissh data');

                    let dish = await response.json(); // Dữ liệu nhân viên từ server

                    clearForm(document.querySelector("[form-create-update]"));

                    // Điền dữ liệu vào form
                    document.querySelector('#TenMon').value = dish.TENMON;
                    document.querySelector('#LoaiMon').value = dish.MALOAI;
                    document.querySelector('#Gia').value = dish.GIA;
                    document.querySelector('#SoLuong').value = dish.SOLUONG;
                    document.querySelector('#URL').value = dish.URL

                    modalOverlay.style.display = 'flex'; // Hiển thị modal với display: flex;
                    document.body.style.overflow = 'hidden'; // Ngăn cuộn trang khi modal hiển thị
                    modalTitle.textContent = 'Cập nhật món ăn';

                    // Hiển thị nút Thêm và ẩn nút Lưu
                    document.querySelector('.btn.btn-primary').style.display = 'none';
                    document.querySelector('.save-button').style.display = 'inline-block';

                     // update status
                    const buttonCreate = document.querySelectorAll("[button-update]");
                    if (buttonCreate) {
                        const formCreateUpdate = document.querySelector("[form-create-update]")
                        const path = formCreateUpdate.getAttribute("data-path");

                        // lọc qua từng nút bấm và bắt sự kiện onclic => thay đổi đường dẫn router trong form (action)
                        buttonCreate.forEach(button => {
                            button.addEventListener('click', () => {
                                const action = path + `/update/${dish.MAMON}?_method=PATCH`;
                                formCreateUpdate.action = action;
                                //console.log(formCreateUpdate)
                                formCreateUpdate.submit();
                                // hàm submit có được support bởi expressJS thay thế cho nút submit bên html để gửi form lên server
                            })
                        });
                    }
                    // end create  status
                } catch (error) {
                    console.log('Lỗi khi lấy thông tin nhân viên:', error);
                    alert('Không thể lấy thông tin nhân viên. Vui lòng thử lại!');
                    modalOverlay.style.display = 'none'; // Đóng modal nếu xảy ra lỗi
                }
            }

            closeModalButton.addEventListener('click', function() {
                modalOverlay.style.display = 'none'; // Đóng modal
                document.body.style.overflow = 'auto'; // Bật lại cuộn trang
                // Đặt lại giá trị của các ô nhập liệu
                clearForm(document.querySelector("[form-create-update]"));
                // Hiển thị nút Thêm và ẩn nút Lưu
                document.querySelector('#addPlaneButton').style.display = 'inline-block';
                document.querySelector('.save-button').style.display = 'none';
                // Đặt lại tiêu đề modal
                modalTitle.textContent = 'Thêm Nhân Viên';
                formModal.style.backgroundColor = ''; // Xóa lớp edit-mode
             });
        })
    }
});
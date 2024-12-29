// Clear form
// const clearForm = (form) => {
//     if (!form) return;
//     form.querySelectorAll("input, select, textarea").forEach(field => {
//         field.value = ""; // Xóa giá trị của từng field
//         if (field.type === "checkbox" || field.type === "radio") {
//             field.checked = false; // Bỏ chọn checkbox và radio
//         }
//     });
// };
// End clear form

// alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
    const time = parseInt(showAlert.getAttribute("data-time"));
    const closeAlert = document.querySelector("[close-alert]");
    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden");
    })
    setTimeout(() => {
        showAlert.classList.add("alert-hidden");
    }, time);
}
// end alert


// delete item
const buttonDeleteItem = document.querySelectorAll("[button-delete-item]");
if (buttonDeleteItem.length) {
    const formDeleteItem = document.querySelector("#form-delete-item");
    const path = formDeleteItem.getAttribute("data-path");

    buttonDeleteItem.forEach(button => {
        button.addEventListener('click', () => {
            const isConfirm = confirm("Delete?");
            if (isConfirm) {
                const id = button.getAttribute("button-id");
                const action = path + `/${id}?_method=DELETE`;
                formDeleteItem.action = action;

                formDeleteItem.submit();
            }
        })
    })
}
// end delete item



//  ----------- CODE CỦA CHIẾN -------------
document.addEventListener('DOMContentLoaded', function() {
    const openModalButton = document.getElementById('openModalButton');
    const modalOverlay = document.getElementById('modalOverlay');
    const closeModalButton = document.getElementById('closeModalButton'); // Nút đóng modal
    const saveButton = document.querySelector('.save-button');
    const modalTitle=document.querySelector('.modalTitle');
    const formModal = document.querySelector('.modal');
    const buttonUpdateItem = document.querySelectorAll("[button-update-item]");

    // Thiết lập sự kiện nhấn nút mở modal
    openModalButton.addEventListener('click', function() {
        // clearForm(document.querySelector("[form-create-update]"));
        modalOverlay.style.display = 'flex'; // Hiển thị modal với display: flex;
        document.body.style.overflow = 'hidden'; // Ngăn cuộn trang khi modal hiển thị
        modalTitle.textContent = 'Thêm mới';
    
    });
    closeModalButton.addEventListener('click', function() {
       modalOverlay.style.display = 'none'; // Đóng modal
       document.body.style.overflow = 'auto'; // Bật lại cuộn trang
        // Đặt lại giá trị của các ô nhập liệu
        // clearForm(document.querySelector("[form-create-update]"));
        // Hiển thị nút Thêm và ẩn nút Lưu
        document.querySelector('#addPlaneButton').style.display = 'inline-block';
        document.querySelector('.save-button').style.display = 'none';
        // Đặt lại tiêu đề modal
        modalTitle.textContent = 'Thêm Nhân Viên';
        formModal.style.backgroundColor = ''; // Xóa lớp edit-mode
    });

    // Sự kiện nhấn nút lưu thay đổi
    saveButton.addEventListener('click', async function() {
        //saveNhanVien();
        modalOverlay.style.display = 'none'; // Đóng modal
        document.body.style.overflow = 'auto'; // Bật lại cuộn trang
    });

    // create status
    const buttonCreate = document.querySelectorAll("[button-create]");
    if (buttonCreate) {
        const formCreateUpdate = document.querySelector("[form-create-update]")
        const path = formCreateUpdate.getAttribute("data-path");

        // lọc qua từng nút bấm và bắt sự kiện onclic => thay đổi đường dẫn router trong form (action)
        buttonCreate.forEach(button => {
            button.addEventListener('click', () => {
                const action = path + `/create`;
                formCreateUpdate.action = action;

                formCreateUpdate.submit();

                // hàm submit có được support bởi expressJS thay thế cho nút submit bên html để gửi form lên server
            })
        });
    }
    // end create  status
});
// ----------------------

//Form search
const formsearch = document.querySelector("#form-search");
if (formsearch) {
    let url = new URL(window.location.href);
    formsearch.addEventListener(("submit"), (e) => {
        console.log("chay vo day chưa");
        // e là event trả ra toàn bộ sự kiện ( value của input)

        e.preventDefault();// mặc định khi nhấn submit thì nó reload lại trang hoặc link sang trang khác 
        // khi đó ta cần có cú pháp này để duy trì param

        const customer_id = e.target.elements.customer_id.value;
        const start_date = e.target.elements.start_date.value;
        const end_date = e.target.elements.end_date.value;

        if (customer_id) {
            url.searchParams.set("customer_id", customer_id);
        } else {
            url.searchParams.delete("customer_id");
        }
        if (start_date) {
            url.searchParams.set("start_date", start_date);
        } else {
            url.searchParams.delete("start_date");
        }
        if (end_date) {
            url.searchParams.set("end_date", end_date);
        } else {
            url.searchParams.delete("end_date");
        }
        window.location.href = url.href;
    })
}

// End form search

//Form search
const signleFormsearch = document.querySelector("#single-form-search");
if (signleFormsearch) {
    let url = new URL(window.location.href);
    signleFormsearch.addEventListener(("submit"), (e) => {
        // e là event trả ra toàn bộ sự kiện ( value của input)

        e.preventDefault();// mặc định khi nhấn submit thì nó reload lại trang hoặc link sang trang khác 
        // khi đó ta cần có cú pháp này để duy trì param

        const keyword = e.target.elements.keyword.value;
        const branchId = e.target.elements.branchId.value;
        
        if (keyword) {
            url.searchParams.set("keyword", keyword);
        } else {
            url.searchParams.delete("keyword");
        }
        if (branchId) {
            url.searchParams.set("branchId", branchId);
        } else {
            url.searchParams.delete("branchId");
        }
        window.location.href = url.href;
    })
}

// End form search
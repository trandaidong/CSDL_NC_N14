// const systemConfig = require('../../../config/system');
// const PATH_ADMIN = systemConfig.prefixAdmin + `/api/v1`;
// console.log(PATH_ADMIN)
document.addEventListener('DOMContentLoaded', function() {
    const openModalButton = document.getElementById('openModalButton');
    const modalOverlay = document.getElementById('modalOverlay');
    const addEmployeeButton = document.getElementById('addPlaneButton');
    const closeModalButton = document.getElementById('closeModalButton'); // Nút đóng modal
    const saveButton = document.querySelector('.save-button');
    const modalTitle=document.querySelector('.modalTitle');
    const formModal = document.querySelector('.modal');
    const buttonUpdateItem = document.querySelectorAll("[button-update-item]");
   
    // Thiết lập sự kiện nhấn nút mở modal
    // openModalButton.addEventListener('click', function() {
    //     modalOverlay.style.display = 'flex'; // Hiển thị modal với display: flex;
    //     document.body.style.overflow = 'hidden'; // Ngăn cuộn trang khi modal hiển thị
    //     modalTitle.textContent = 'Thêm nhân viên';
    
    // });

    // Thiết lập sự kiện nhấn nút thêm nhân viên
    // addEmployeeButton.addEventListener('click', function() {  
    //     addNhanVien();
    //     modalOverlay.style.display = 'none'; // Đóng modal
    //     document.body.style.overflow = 'auto'; // Bật lại cuộn trang
    // });

    // Sự kiện nhấn nút đóng modal (X)
    // closeModalButton.addEventListener('click', function() {
    //    modalOverlay.style.display = 'none'; // Đóng modal
    //    document.body.style.overflow = 'auto'; // Bật lại cuộn trang
    //     // Đặt lại giá trị của các ô nhập liệu
    //     resetForm();
    //     // Hiển thị nút Thêm và ẩn nút Lưu
    //     document.querySelector('#addPlaneButton').style.display = 'inline-block';
    //     document.querySelector('.save-button').style.display = 'none';
    //     // Đặt lại tiêu đề modal
    //     modalTitle.textContent = 'Thêm Nhân Viên';
    //     formModal.style.backgroundColor = ''; // Xóa lớp edit-mode
    // });

    // Sự kiện nhấn nút lưu thay đổi
    // saveButton.addEventListener('click', async function() {
    //     //saveNhanVien();
    //     modalOverlay.style.display = 'none'; // Đóng modal
    //     document.body.style.overflow = 'auto'; // Bật lại cuộn trang
    // });

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


    // update
    if (buttonUpdateItem.length) {
        buttonUpdateItem.forEach(button => {
            button.removeEventListener('click', updateEmployeeModal); // Xóa sự kiện cũ (nếu có)
            button.addEventListener('click', updateEmployeeModal);
            async function updateEmployeeModal() {
                const id = button.getAttribute("button-id");
                try {
                    const response = await fetch(`/admin/api/v1/employees/update/${id}`);
                    if (!response.ok) throw new Error('Failed to fetch employee data');

                    let employee = await response.json(); // Dữ liệu nhân viên từ server

                    // Điền dữ liệu vào form
                    document.querySelector('#HoTen').value = employee.FULLNAME;
                    document.querySelector('#MaBoPhan').value = employee.MABOPHAN;
                    document.querySelector('#MaChiNhanh').value = employee.MACHINHANH;
                    document.querySelector('#Email').value = employee.EMAIL;
                    document.querySelector('#NgaySinh').value = employee.NGAYSINH.split('T')[0];;
                    document.querySelector('#GioiTinh').value = employee.GIOITINH;
                    document.querySelector('#SDT').value = employee.SDT;
                    document.querySelector('#DiaChi').value = employee.DIACHI;

                    modalOverlay.style.display = 'flex'; // Hiển thị modal với display: flex;
                    document.body.style.overflow = 'hidden'; // Ngăn cuộn trang khi modal hiển thị
                    modalTitle.textContent = 'Cập nhật nhân viên';

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
                                console.log(document.querySelector('#HoTen').value)
                                const action = path + `/update/${employee.MANHANVIEN}?_method=PATCH`;
                                formCreateUpdate.action = action;
                                //console.log(formCreateUpdate)
                                formCreateUpdate.submit();
                                // hàm submit có được support bởi expressJS thay thế cho nút submit bên html để gửi form lên server
                            })
                        });
                    }
                    // end create  status
                } catch (error) {
                    console.error('Lỗi khi lấy thông tin nhân viên:', error);
                    alert('Không thể lấy thông tin nhân viên. Vui lòng thử lại!');
                    modalOverlay.style.display = 'none'; // Đóng modal nếu xảy ra lỗi
                }
            }

            closeModalButton.addEventListener('click', function() {
                modalOverlay.style.display = 'none'; // Đóng modal
                document.body.style.overflow = 'auto'; // Bật lại cuộn trang
                // Đặt lại giá trị của các ô nhập liệu
                resetForm();
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

function resetForm() {
  
    document.querySelector('select[id="MaBoPhan"]').value = '';
    document.querySelector('select[id="MaChiNhanh"]').value = '';
    document.querySelector('input[id="HoTen"]').value = '';
    document.querySelector('input[id="NgaySinh"]').value = '';
    document.querySelector('select[id="GioiTinh"]').value = '';
    document.querySelector('input[id="Luong"]').value = '';
    document.querySelector('input[id="SDT"]').value = '';
    document.querySelector('input[id="DiaChi"]').value = '';
}

// 2. Hàm load dữ liệu vào select
async function fetchAllData() {
    try {
        // Gửi request đến các endpoint
        const chiNhanhResponse = fetch('http://localhost:3000/chinhanh');
        const boPhanResponse = fetch('http://localhost:3000/bophan');

        // Chờ tất cả các request hoàn thành
        const [chiNhanhData, boPhanData] = await Promise.all([
            chiNhanhResponse.then(res => res.json()),
            boPhanResponse.then(res => res.json())
        ]);

        return {
            chinhanh: chiNhanhData,
            bophan: boPhanData
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Quăng lỗi để xử lý phía trên (nếu cần)
    }
}

// Hàm hiển thị dữ liệu lên select
function populateSelect(selectId, data, labelKey, valueKey) {
    const selectElement = document.getElementById(selectId);

    // Xóa các tùy chọn cũ (nếu có)
    selectElement.innerHTML = '<option value="">-- Chọn --</option>';

    // Thêm dữ liệu mới vào select
    data.forEach(item => {
        const option = document.createElement('option');
        option.value = item[valueKey];
        option.textContent = item[labelKey];
        selectElement.appendChild(option);
    });
}

// Hàm chính: Lấy dữ liệu và hiển thị
async function init() {
    try {
        const { chinhanh, bophan } = await fetchAllData();

        // Hiển thị dữ liệu lên các select box
        populateSelect('MaChiNhanh', chinhanh, 'TenChiNhanh', 'id'); // Thay 'TenChiNhanh' và 'ID' theo cấu trúc dữ liệu của bạn
        populateSelect('MaBoPhan', bophan, 'TenBoPhan', 'id'); // Thay 'TenBoPhan' và 'ID' theo cấu trúc dữ liệu của bạn
    } catch (error) {
        console.error('Error initializing data:', error);
    }
}

init();

var nhanVienAPI = 'http://localhost:3000/nhanvien';

document.addEventListener('DOMContentLoaded', function () {
    start();
});

function start(){
    getNhanVien(renderNhanVien);
}

// Lấy danh sách nhân viên -> gửi API
function getNhanVien(callback){
    fetch(nhanVienAPI)
    .then(function(response) {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(callback)
    .catch(error => console.error('Error fetching nhanvien:', error));
}

// Tạo nhân viên mới -> gửi API
function createNhanVien(data, callback){
    var options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        }
    };

    fetch(nhanVienAPI, options)
        .then(function(response){
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(callback)
        .catch(error => console.error('Error creating nhanvien:', error));
}

// Xóa nhân viên -> gửi API
function deleteNhanVien(id, callback){
    var options = {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
        }
    };

    fetch(nhanVienAPI + '/' + id, options)
        .then(function(response){
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(function(){
            var nhanVienItem = document.querySelector('.nhanvien-item-' + id);
            if(nhanVienItem){
                nhanVienItem.remove();
            }
        })
        .catch(error => console.error('Error deleting nhanvien:', error));
}

// Sửa thông tin nhân viên -> gửi API
function updateNhanVien(id, data, callback) {
    var options = {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
        }
    };

    fetch(nhanVienAPI + '/' + id, options)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(callback)
        .catch(error => console.error('Error updating nhanvien:', error));
}

// Hiển thị danh sách nhân viên và giao diện
function renderNhanVien(list_nhanvien){
    var listNhanVien = document.querySelector('tbody');
    if (!listNhanVien) {
        console.error('No tbody element found');
        return;
    }

    var htmls = list_nhanvien.map(function(nhanvien, index) {
        return `<tr class="nhanvien-item-${nhanvien.id}">
                    <td>${index + 1}</td>
                    <td>${nhanvien.id}</td>
                    <td>${nhanvien.MaBoPhan}</td>
                    <td>${nhanvien.MaChiNhanh}</td>
                    <td>${nhanvien.HoTen}</td>
                    <td>${nhanvien.NgaySinh}</td>
                    <td>${nhanvien.GioiTinh}</td>
                    <td>${nhanvien.Luong}</td>
                    <td>${nhanvien.SDT}</td>
                    <td>${nhanvien.DiaChi}</td>
                    <td class="edit-icons">
                        <button onclick="editNhanVien('${nhanvien.id}')">✎</button>
                        <button onclick="deleteNhanVien('${nhanvien.id}', getNhanVien(renderNhanVien))">🗑️</button>
                    </td>
                </tr>`;
    }).join('');

    listNhanVien.innerHTML = htmls;
    console.log('Rendered HTML:', htmls);
}

// Hoạt động Thêm nhân viên vào API và cập nhật giao diện
function addNhanVien() {
  
    var MaBoPhanInput = document.querySelector('select[id="MaBoPhan"]');
    var MaChiNhanhInput = document.querySelector('select[id="MaChiNhanh"]');
    var HoTenInput = document.querySelector('input[id="HoTen"]');
    var NgaySinhInput = document.querySelector('input[id="NgaySinh"]');
    var GioiTinhInput = document.querySelector('input[id="GioiTinh"]');
    var LuongInput = document.querySelector('input[id="Luong"]');
    var SDTInput = document.querySelector('input[id="SDT"]');
    var DiaChiInput = document.querySelector('input[id="DiaChi"]');

    // Kiểm tra nếu tất cả các input tồn tại và không trống
    if ( MaBoPhanInput && MaChiNhanhInput && HoTenInput && NgaySinhInput && GioiTinhInput && LuongInput && SDTInput && DiaChiInput) {
        
        var MaBoPhan = MaBoPhanInput.value.trim();
        var MaChiNhanh = MaChiNhanhInput.value.trim();
        var HoTen = HoTenInput.value.trim();
        var NgaySinh = NgaySinhInput.value.trim();
        var GioiTinh = GioiTinhInput.value.trim();
        var Luong = LuongInput.value.trim();
        var SDT = SDTInput.value.trim();
        var DiaChi = DiaChiInput.value.trim();

        console.log("da chay vo day");
        if ( MaBoPhan === "" || MaChiNhanh === "" || HoTen === "" || NgaySinh === "" || GioiTinh === "" || Luong === "" || SDT === "" || DiaChi === "") {
            alert("Vui lòng điền đầy đủ thông tin vào tất cả các ô.");
            return; // Dừng thực hiện nếu có ô trống
        }
    
        var data = {
           
            MaBoPhan: MaBoPhan,
            MaChiNhanh: MaChiNhanh,
            HoTen: HoTen,
            NgaySinh: NgaySinh,
            GioiTinh: GioiTinh,
            Luong: Luong,
            SDT: SDT,
            DiaChi: DiaChi
        };
    
        // Gọi hàm tạo nhân viên và cập nhật danh sách sau khi thêm thành công
        createNhanVien(data, function() {
            getNhanVien(renderNhanVien);  // Cập nhật danh sách nhân viên
            resetForm();
        });
    }
}

// Hoạt động Sửa thông tin nhân viên
function editNhanVien(id) {
    fetch(nhanVienAPI)
        .then(function(response) {
            return response.json();
        })
        .then(function(nhanviens) {
            var nhanvien = nhanviens.find(function(nv) {
                return nv.id === id;
            });

            if (nhanvien) {
           
                var MaBoPhanInput = document.querySelector('select[id="MaBoPhan"]');
                var MaChiNhanhInput = document.querySelector('select[id="MaChiNhanh"]');
                var HoTenInput = document.querySelector('input[id="HoTen"]');
                var NgaySinhInput = document.querySelector('input[id="NgaySinh"]');
                var GioiTinhInput = document.querySelector('input[id="GioiTinh"]');
                var LuongInput = document.querySelector('input[id="Luong"]');
                var SDTInput = document.querySelector('input[id="SDT"]');
                var DiaChiInput = document.querySelector('input[id="DiaChi"]');
                
                var themBtn = document.querySelector('#addPlaneButton');
                var formContainer = document.querySelector('#modalOverlay'); // Updated to match the modal overlay
                var saveBtn = document.querySelector('.save-button');
                var modalTitle = document.querySelector('.modal h3'); // Tiêu đề của modal
                var formModal = document.querySelector('.modal');
                // Điền giá trị hiện tại vào các ô nhập liệu
            
                MaBoPhanInput.value = nhanvien.MaBoPhan;
                MaChiNhanhInput.value = nhanvien.MaChiNhanh;
                HoTenInput.value = nhanvien.HoTen;
                NgaySinhInput.value = nhanvien.NgaySinh;
                GioiTinhInput.value = nhanvien.GioiTinh;
                LuongInput.value = nhanvien.Luong;
                SDTInput.value = nhanvien.SDT;
                DiaChiInput.value = nhanvien.DiaChi;

                // Thay đổi tiêu đề modal
                modalTitle.textContent = 'Chỉnh sửa';
                formModal.style.backgroundColor = '#e8f5e9'; // Màu nền xanh nhạt

                // Hiển thị modal và ẩn nút Thêm
                formContainer.style.display = 'flex';
                document.body.style.overflow = 'hidden'; // Ngăn cuộn trang khi modal hiển thị
                themBtn.style.display = 'none';
                saveBtn.style.display = 'inline-block';

                // Thêm sự kiện cho nút lưu thay đổi
                saveBtn.onclick = function() {
                
                    var MaBoPhan = MaBoPhanInput.value.trim();
                    var MaChiNhanh = MaChiNhanhInput.value.trim();
                    var HoTen = HoTenInput.value.trim();
                    var NgaySinh = NgaySinhInput.value.trim();
                    var GioiTinh = GioiTinhInput.value.trim();
                    var Luong = LuongInput.value.trim();
                    var SDT = SDTInput.value.trim();
                    var DiaChi = DiaChiInput.value.trim();

                    if (MaBoPhan === "" || MaChiNhanh === "" || HoTen === "" || NgaySinh === "" || GioiTinh === "" || Luong === "" || SDT === "" || DiaChi === "") {
                        alert("Vui lòng điền đầy đủ thông tin vào tất cả các ô.");
                        return;
                    }

                    var updatedNhanVien = {
                      
                        MaBoPhan: MaBoPhan,
                        MaChiNhanh: MaChiNhanh,
                        HoTen: HoTen,
                        NgaySinh: NgaySinh,
                        GioiTinh: GioiTinh,
                        Luong: Luong,
                        SDT: SDT,
                        DiaChi: DiaChi
                    };

                    updateNhanVien(id, updatedNhanVien, function() {
                        getNhanVien(renderNhanVien);
                        resetForm();

                        // Đặt lại tiêu đề modal
                        modalTitle.textContent = 'Thêm Nhân Viên';
                        saveBtn.style.display = 'none'; 
                        themBtn.style.display = 'inline-block'; 
                        formContainer.style.display = 'none';
                        document.body.style.overflow = 'auto'; // Bật lại cuộn trang
                        
                        // Xóa lớp edit-mode
                        formModal.style.backgroundColor = '';
                    });
                };
            }
        })
        .catch(error => console.error('Error editing nhanvien:', error));
}


document.addEventListener('DOMContentLoaded', function() {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');

    searchButton.addEventListener('click', function() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (searchTerm) {
            searchNhanVien(searchTerm);
        } else {
            getNhanVien(renderNhanVien); // Hiển thị lại danh sách đầy đủ nếu ô tìm kiếm trống
        }
    });

    // Tìm kiếm ngay khi người dùng gõ (khi ô tìm kiếm trống sẽ hiện lại toàn bộ)
    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        if (!searchTerm) {
            getNhanVien(renderNhanVien); // Hiển thị lại danh sách đầy đủ nếu ô tìm kiếm trống
        }
    });
});
function searchNhanVien(searchTerm) {
    fetch(nhanVienAPI)
        .then(function(response) {
            return response.json();
        })
        .then(function(nhanviens) {
            const filteredNhanViens = nhanviens.filter(function(nhanvien) {
                const id = nhanvien.id; // Lấy id của nhân viên
                const hoTen = nhanvien.HoTen?.toLowerCase(); // Lấy họ tên và chuyển về chữ thường

                // Chuyển searchTerm sang chữ thường
                const lowerSearchTerm = searchTerm.trim().toLowerCase();

                // So sánh searchTerm với id hoặc HoTen
                if (typeof id === 'string' && id.toLowerCase() === lowerSearchTerm) {
                    return true;
                }

                if (typeof id === 'number' && id === Number(searchTerm)) {
                    return true;
                }

                if (hoTen && hoTen.includes(lowerSearchTerm)) {
                    return true;
                }

                return false;
            });
            renderNhanVien(filteredNhanViens);
        })
        .catch(error => console.error('Error searching nhanvien:', error));
}

function sendInfo() {
  const nameInput = document.querySelector(".fullname input");
  const phoneInput = document.querySelector(".phone-number input");
  const positionInput = document.querySelector(".applied-position select");
  const interviewInput = document.querySelector(".date-interview select");

  noNumber(nameInput);
  onlyNumber(phoneInput);

  const btnActive = document.querySelector(".send-info button");

  btnActive.addEventListener("click", (event) => {
    const name = nameInput.value;
    const phone = phoneInput.value;

    if (name == "") {
      alert("Vui lòng nhập họ và tên");
      return;
    }

    if (phone == "") {
      alert("Vui lòng nhập số điện thoại");
      return;
    }

    if (phone.length > 10) {
      alert("Vui lòng nhập số điện thoại ngắn hơn");
      return;
    }

    const positionValue = positionInput.value;
    if (positionValue == "") {
      alert("Vui lòng chọn vị trí muốn ứng tuyển");
      return;
    }
    let position = "";
    if (positionValue == 1) position = "phục vụ";
    if (positionValue == 2) position = "thu ngân";
    if (positionValue == 3) position = "đầu bếp";
    if (positionValue == 4) position = "quản lý";

    const dateValue = interviewInput.value;
    if (dateValue == "") {
      alert("Vui lòng chọn ngày phỏng vấn");
      return;
    }
    let date = "";
    if (dateValue == 1) date = "03/01/2025";
    if (dateValue == 2) date = "05/01/2025";
    if (dateValue == 3) date = "07/01/2025";
    if (dateValue == 4) date = "09/01/2025";
    if (dateValue == 5) date = "11/01/2025";
    if (dateValue == 6) date = "13/01/2025";
    if (dateValue == 7) date = "15/01/2025";

    alert(
      "Bạn đã ứng tuyển vị trí " +
        position +
        " thành công\nĐừng quên buổi phỏng vấn ngày " +
        date
    );

    location.reload();
  });
}

function onlyNumber(input) {
  input.addEventListener("keypress", (event) => {
    const key = event.key;

    if (!/[0-9]/.test(key)) {
      event.preventDefault();
    }
  });
}

function noNumber(input) {
  input.addEventListener("keypress", (event) => {
    const key = event.key;

    if (/[0-9]/.test(key)) {
      event.preventDefault();
    }
  });
}

sendInfo();

// Đăng nhập
function btnLogin() {
  let btnActive = document.querySelector(".btn-login");

  if (btnActive === null) {
    return;
  }

  let userNameInput = document.querySelector(".user-name input");
  let passwordInput = document.querySelector(".password input");

  onlyNumber(passwordInput);

  btnActive.addEventListener("click", async (e) => {
    e.preventDefault();
    const userName = userNameInput.value;
    const password = passwordInput.value;

    if (!userName || !password) {
      userNameInput.classList.add("error");
      passwordInput.classList.add("error");
      alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    fetch("api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userName, password }),
    })
      .then((response) => {
        if (response.status === 200) return response.json();
        else {
          userNameInput.classList.add("error");
          passwordInput.classList.add("error");
          return response.json().then((data) => {
            throw new Error(data.message || "Đã có lỗi xảy ra");
          });
        }
      })
      .then(function (data) {
        userNameInput.classList.remove("error");
        passwordInput.classList.remove("error");
        sessionStorage.setItem("FullName", data.fullName);
        sessionStorage.setItem("email", userName);

        window.location.href = "/";
      })
      .catch(function (error) {
        console.error(error);
        alert(error.message || "Đã xảy ra lỗi khi đăng ký");
      });
  });
}

// Khi gõ vào các ô input lỗi thì sẽ gỡ bỏ thông báo lỗi
function removeError() {
  let inputTags = document.querySelectorAll("input");
  inputTags.forEach(function (inputTag) {
    inputTag.addEventListener("keydown", function () {
      inputTag.classList.remove("error");
    });
  });
}

// Đăng ký tài khoản //
function btnRegister() {
  let btnActive = document.querySelector(".btn-register-account");

  if (btnActive === null) {
    return;
  }

  const phoneInput = document.querySelector(".phone-number input");
  const nameInput = document.querySelector(".customer-name input");
  const emailInput = document.querySelector(".email input");
  const citizenIDInput = document.querySelector(".citizen-id input");
  const genderInput = document.querySelector(".gender select");
  const passwordInput = document.querySelector(".password input");
  const confirmInput = document.querySelector(".confirm-password input");

  noNumber(nameInput);
  onlyNumber(citizenIDInput);
  onlyNumber(phoneInput);
  onlyNumber(passwordInput);
  onlyNumber(confirmInput);
  noSpace(emailInput);

  btnActive.addEventListener("click", function (event) {
    const phone = phoneInput.value;
    const name = nameInput.value;
    const email = emailInput.value;
    const citizenID = citizenIDInput.value;
    let gender = genderInput.value;
    const password = passwordInput.value;
    const confirm = confirmInput.value;

    switch (true) {
      case name === "":
        alert("Vui lòng nhập tên");
        nameInput.classList.add("error");
        return;
      case citizenID === "":
        alert("Vui lòng nhập số căn cước công dân");
        citizenIDInput.classList.add("error");
        return;
      case citizenID.length > 12:
        alert("Số căn cước công dân quá dài");
        citizenIDInput.classList.add("error");
        return;
      case phone === "":
        alert("Vui lòng nhập số điện thoại");
        phoneInput.classList.add("error");
        return;
      case phone.length > 10:
        alert("Số điện thoại quá dài");
        phoneInput.classList.add("error");
        return;
      case email === "":
        alert("Vui lòng nhập email");
        emailInput.classList.add("error");
        return;
      case !checkEmail(email):
        alert("Vui lòng nhập đúng định dạng email (VD: cuong999@gmail.com)");
        emailInput.classList.add("error");
        return;
      case password === "":
        alert("Vui lòng nhập mật khẩu");
        passwordInput.classList.add("error");
        return;
      case confirm === "":
        alert("Vui lòng xác nhận mật khẩu");
        confirmInput.classList.add("error");
        return;
      case password !== confirm:
        alert("Mật khẩu xác nhận không chính xác");
        passwordInput.classList.add("error");
        confirmInput.classList.add("error");
        return;
    }

    fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone,
        name,
        email,
        citizenID,
        gender,
        password,
      }),
    })
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } else {
          emailInput.classList.add("error");

          return response.json().then((data) => {
            throw new Error(data.message || "Đã có lỗi xảy ra");
          });
        }
      })
      .then(function (data) {
        nameInput.classList.remove("error");
        phoneInput.classList.remove("error");
        emailInput.classList.remove("error");
        passwordInput.classList.remove("error");
        confirmInput.classList.remove("error");

        alert(data.message + ", trở về trang đăng nhập");

        window.location.href = "/login";
      })
      .catch(function (error) {
        console.error(error);
        alert(error.message || "Đã xảy ra lỗi khi đăng ký");
      });
  });
}

// Tìm tài khoản để thay đổi mật khẩu
var nameAccountFind = "";
function btnFindAccount() {
  let btnActiveFind = document.querySelector(".btn-find-account");

  if (btnActiveFind === null) {
    return;
  }

  let userNameInput = document.querySelector(".user-name-find input");

  btnActiveFind.addEventListener("click", async (e) => {
    nameAccountFind = userNameInput.value;
    if (nameAccountFind === "") {
      alert("Vui lòng nhập tên tài khoản");
      userNameInput.classList.add("error");
      return;
    }

    fetch("/api/forget-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nameAccountFind }),
    })
      .then((response) => {
        if (response.status === 200) return response.json();
        else {
          userNameInput.classList.add("error");
          return response.json().then((data) => {
            throw new Error(data.message || "Đã có lỗi xảy ra");
          });
        }
      })
      .then(function (data) {
        btnActiveFind.classList.add("hidden");

        let newPasswordInput = document.querySelector(".new-password");
        let confirmPasswordInput = document.querySelector(
          ".confirm-new-password"
        );
        let saveButton = document.querySelector(".btn-save-password");
        newPasswordInput.classList.remove("hidden");
        confirmPasswordInput.classList.remove("hidden");
        saveButton.classList.remove("hidden");
        // Khóa ô nhập liệu
        userNameInput.disabled = true;
      })
      .catch(function (error) {
        console.error(error);
        alert(error.message || "Đã xảy ra lỗi khi tìm tài khoản");
      });
  });
}

// Lưu mật khẩu mới
function btnSaveNewPassword() {
  let btnActiveSave = document.querySelector(".btn-save-password");

  if (btnActiveSave === null) {
    return;
  }

  let newPasswordInput = document.querySelector(".new-password input");
  let confirmPasswordInput = document.querySelector(
    ".confirm-new-password  input"
  );

  btnActiveSave.addEventListener("click", async (e) => {
    const newPasswordValue = newPasswordInput.value;
    const confirmPasswordValue = confirmPasswordInput.value;

    if (newPasswordValue === "" || confirmPasswordValue === "") {
      newPasswordInput.classList.add("error");
      confirmPasswordInput.classList.add("error");
      alert("Vui lòng nhập đủ thông tin");
      return;
    }

    if (newPasswordValue !== confirmPasswordValue) {
      newPasswordInput.classList.add("error");
      confirmPasswordInput.classList.add("error");
      alert("Mật khẩu xác nhận không chính xác");
      return;
    }

    fetch("/api/save-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nameAccountFind, newPasswordValue }),
    })
      .then((response) => {
        if (response.status === 200) return response.json();
        else {
          newPasswordInput.classList.add("error");
          confirmPasswordInput.classList.add("error");
          return response.json();
        }
      })
      .then(function (data) {
        newPasswordInput.classList.remove("error");
        confirmPasswordInput.classList.remove("error");
        alert(data.message + ", trở về trang đăng nhập");

        window.location.href = "/login";
      })
      .catch(function (error) {
        console.error(error);
        alert(error.message || "Đã xảy ra lỗi khi lưu mật khẩu");
      });
  });
}

// Chỉ cho phép nhận số
function onlyNumber(input) {
  input.addEventListener("keypress", (event) => {
    const key = event.key;

    if (!/[0-9]/.test(key)) {
      event.preventDefault();
    }
  });
}

// Không cho phép nhận số
function noNumber(input) {
  input.addEventListener("keypress", (event) => {
    const key = event.key;

    if (/[0-9]/.test(key)) {
      event.preventDefault();
    }
  });
}

// Không cho phép nhận phím cách
function noSpace(input) {
  input.addEventListener("keypress", (event) => {
    const key = event.key;

    if (key === " ") {
      event.preventDefault();
    }
  });
}

// Định dạng email
function checkEmail(email) {
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  return gmailRegex.test(email);
}
// Main
removeError();
btnLogin();
btnRegister();
btnFindAccount();
btnSaveNewPassword();

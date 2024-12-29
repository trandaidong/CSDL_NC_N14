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

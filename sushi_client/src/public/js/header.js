document.addEventListener("DOMContentLoaded", function () {
  const sidebarItems = document.querySelectorAll(".sidebar-item");

  // Lấy URL hiện tại
  const currentPath = window.location.pathname;

  // Kiểm tra và thêm class "active" dựa trên URL
  sidebarItems.forEach((item) => {
    const link = item.querySelector("a");
    if (link && link.getAttribute("href") === currentPath) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
});

// Set lại tên tài khoản
const userName = sessionStorage.getItem("FullName");
//console.log(userName);
if (userName !== null) {
  let login = document.querySelector(".header-log-link");
  let logout = document.querySelector(".header-logout-link");
  login.classList.add("hidden");
  logout.classList.remove("hidden");
  let nameAccount = document.querySelector(".user-name");
  nameAccount.innerText = userName ;
}

document
  .querySelector(".header-logout-link")
  .addEventListener("click", function (event) {
    var result = confirm("Bạn có chắc muốn đăng xuất");
    if (result) {
      window.location.href = "/login";
      localStorage.removeItem("userName");
    }
  });

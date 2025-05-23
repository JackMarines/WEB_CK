const account = document.getElementById("account");

if (localStorage.getItem("currentUser")) {
  account.innerHTML = `
    <li><a href="#">Account</a></li>
    <li><a href="#">Settings</a></li>
    <li><a href="#">Help Center</a></li>
    <li><a href="#" id="logoutBtn">Log out</a></li>
  `;

  // Optional: logout logic
  document.getElementById("logoutBtn").addEventListener("click", function () {
    localStorage.removeItem("currentUser");
    alert("You have been logged out!");
    location.reload(); // or redirect: location.href = "Sliding Login Form.html";
  });
} else {
  account.innerHTML = `
    <li><a href="#">Account</a></li>
    <li><a href="#">Settings</a></li>
    <li><a href="#">Help Center</a></li>
    <li><a href="Sliding Login Form.html">Sign In</a></li>
  `;
}

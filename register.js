const registerForm = document.getElementById("register-form");

registerForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent page reload

  const username = document.getElementById("signup-username").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value.trim();

  // Updated regular expression for password validation
  var regularExpression  = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,20}$/;

  // Validation checks
  if (!regularExpression.test(password)) {
    alert("Password must be 8-20 characters long, include at least one uppercase letter, one lowercase letter, and one number.");
  } else {
    // Check if user data already exists
    let users = JSON.parse(localStorage.getItem("user")) || [];

    // Check for existing email or username
    const emailExists = users.some(user => user.email === email);
    const usernameExists = users.some(user => user.username === username);

    if (emailExists) {
      alert("Email is already registered.");
    } else if (usernameExists) {
      alert("Username is already taken.");
    } else {
      // If no existing email or username, add new user
      users.push({
        username: username,
        email: email,
        password: password
      });
// thêm dữ liệu từ push đổ lại dữ liệu lên localStorage
      localStorage.setItem("user", JSON.stringify(users));
      alert("Registration successful!");
    }
  }
});

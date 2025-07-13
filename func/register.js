const registerForm = document.getElementById("register-form");

registerForm.addEventListener("submit", handleRegister); // Use named function

function handleRegister(event) {
  event.preventDefault(); // Prevent page reload

  // Input elements
  const inpUsername = document.getElementById("signup-username");
  const inpEmail = document.getElementById("signup-email");
  const inpPwd = document.getElementById("signup-password");
  const inpConfirmPwd = document.getElementById("signup-confirm-password"); // Optional

  const username = inpUsername.value.trim();
  const email = inpEmail.value.trim();
  const password = inpPwd.value.trim();
  const confirmPassword = inpConfirmPwd?.value.trim();

  const role_id = 2;

  const regularExpression = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,20}$/;

  if (!regularExpression.test(password)) {
    alert("Password must be 8-20 characters long, include at least one uppercase letter, one lowercase letter, and one number.");
    return;
  }

  if (confirmPassword && password !== confirmPassword) {
    alert("Password and confirm password do not match.");
    return;
  }

  let users = JSON.parse(localStorage.getItem("user")) || [];

  const emailExists = users.some(user => user.email === email);
  const usernameExists = users.some(user => user.username === username);

  if (emailExists) {
    alert("Email is already registered.");
    return;
  }

  if (usernameExists) {
    alert("Username is already taken.");
    return;
  }

  users.push({ username, email, password });
  localStorage.setItem("user", JSON.stringify(users));
  alert("Registration successful!");

  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      const userData = {
        username,
        email,
        password,
        role_id,
        balance: 0,
      };

      db.collection("users").add(userData)
        .then((docRef) => {
          alert("Đăng ký thành công");
          window.location.href = "/login.html";
          console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
          alert("Đăng ký thất bại");
          console.error("Error adding document: ", error);
        });
    })
    .catch((error) => {
      alert(`Lỗi: ${error.message}`);
      console.error(error);
    });
}

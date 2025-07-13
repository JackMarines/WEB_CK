const registerForm = document.getElementById("register-form");

registerForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent page reload

  const username = document.getElementById("signup-username").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value.trim();



    
  var regularExpression  = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,20}$/;

  if (!regularExpression.test(password)) {
    alert("Password must be 8-20 characters long, include at least one uppercase letter, one lowercase letter, and one number.");
  } else {
    let users = JSON.parse(localStorage.getItem("user")) || [];

    const emailExists = users.some(user => user.email === email);
    const usernameExists = users.some(user => user.username === username);

    if (emailExists) {
      alert("Email is already registered.");
    } else if (usernameExists) {
      alert("Username is already taken.");
    } else {
      users.push({
        username: username,
        email: email,
        password: password
      });

      localStorage.setItem("user", JSON.stringify(users));
      alert("Registration successful!");
    }
  }

  // Firebase Auth
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      var user = userCredential.user;

      // Dummy role_id variable (should be declared or retrieved from context)
      let role_id = "default"; // Replace or define this properly

      let userData = {
        username,
        email,
        password,
        role_id: role_id,
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
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(`Lỗi: ${errorMessage}`);
      console.log(errorMessage);
    });

}); 

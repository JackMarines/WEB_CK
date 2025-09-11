let form = document.getElementById("login-form");

form.addEventListener("submit", async function(e) {
    e.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    // Kiểm tra các trường có trống không
    if (!email || !password) {
        alert("Please type in your information!");
        return;
    }

    // Đăng nhập với Firebase Auth
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            alert("Logged in successfully");

            // Thiết lập phiên hoặc lưu thông tin đăng nhập
            // Tạo đối tượng user session
            // const userSession = {
            //     user: user,
            //     expiry: new Date().getTime() + 2 * 60 * 60 * 1000 // 2 tiếng
            // };

            // Lưu vào localStorage
            // localStorage.setItem('user_session', JSON.stringify(userSession));
``           
            db.collection("users").where("email", "==", email).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        const user = doc.data();
                        console.log(user)

                        const userSession = {
                            user: user,
                            expiry: new Date().getTime() + 2 * 60 * 60 * 1000 // 2 tiếng
                        };

                        localStorage.setItem('user_session', JSON.stringify(userSession));


                        // Nếu quyền khác 1 thì chuyển về trang index.html
                        if (user.role_id != 1) {
                            console.log("Permission denied!");
                            window.location.href = "./index.html";
                        }
                        if (user.role_id == 1) {
                            console.log("Permission denied!");
                            window.location.href = "./Admin/index.html";
                        }
                    });
                })
                .catch((error) => {
                    console.error("Error: ", error);
                });
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert("Wrong password!");
        });
}); 

let form = document.getElementById("login-form");

form.addEventListener("submit", async function(e) {
    e.preventDefault();

    if (!localStorage.getItem("user")) {
        alert("Không có tài khoản!");
    } else {
        let user = JSON.parse(localStorage.getItem("user"));
        console.log(user);

        let email = document.getElementById("login-email");
        let password = document.getElementById("login-password");

        try {
            let existingUser = await new Promise((resolve, reject) => {
                setTimeout(() => {
                    let userFound = user.find((index) => {
                        return (
                            index.email == email.value.trim() &&
                            index.password == password.value.trim()
                        );
                    });
                    resolve(userFound);
                }, 1000);
            });

            console.log(existingUser);

            if (existingUser) {
                localStorage.setItem("currentUser", JSON.stringify(existingUser));
                alert("Đăng nhập thành công!");
                location.href = "./index.html";
            } else {
                alert("Email hoặc mật khẩu sai!");
            }
        } catch (error) {
            console.error("Lỗi khi tìm kiếm người dùng:", error);
            alert("Có lỗi xảy ra, vui lòng thử lại!");
        }

        // Firebase Auth
         firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            alert("Đăng nhập thành công");

            // Thiết lập phiên hoặc lưu thông tin đăng nhập
            // Tạo đối tượng user session
            const userSession = {
                user: user,
                expiry: new Date().getTime() + 2 * 60 * 60 * 1000 // 2 tiếng
            };

            // Lưu vào localStorage
            localStorage.setItem('user_session', JSON.stringify(userSession));

            // Chuyển hướng tới trang chủ
            window.location.href = "/index.html";
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            alert("Mật khẩu không đúng");
        });
    } 
}); 

let form = document.getElementById("login-form");

form.addEventListener("submit", async function(e) {
    // Không hành động trạng thái của thẻ form
    e.preventDefault();

    // Kiểm tra tài khoản có tồn tại trong localStorage không
    if (!localStorage.getItem("user")) {
        alert("Không có tài khoản!");
    } 
    else {
        // Lấy dữ liệu người dùng từ localStorage
        let user = JSON.parse(localStorage.getItem("user"));
        console.log(user);

        // Lấy giá trị email và password từ DOM
        let email = document.getElementById("login-email");
        let password = document.getElementById("login-password");

        try {
            // Giả lập tác vụ bất đồng bộ, ví dụ: tìm kiếm người dùng trong dữ liệu
            let existingUser = await new Promise((resolve, reject) => {
                setTimeout(() => {
                    let userFound = user.find((index) => {
                        return (
                            index.email == email.value.trim() &&
                            index.password == password.value.trim()
                        );
                    });
                    resolve(userFound); // Trả về kết quả tìm thấy
                }, 1000); // Giả lập thời gian trễ (1 giây)
            });

            console.log(existingUser);

            // Kiểm tra xem có tìm thấy người dùng không
            if (existingUser) {
                localStorage.setItem("currentUser", JSON.stringify(existingUser));
                alert("Đăng nhập thành công!");
                location.href = "./index.html";
            } 
            else {
                alert("Email hoặc mật khẩu sai!");
            }
        } catch (error) {
            console.error("Lỗi khi tìm kiếm người dùng:", error);
            alert("Có lỗi xảy ra, vui lòng thử lại!");
        }
    }
});

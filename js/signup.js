document.getElementById('signupForm').addEventListener('submit', function(e) {
    // Ngăn form submit theo cách mặc định (không reload trang)
    e.preventDefault();
    
    // Lấy giá trị từ input mật khẩu
    const password = document.getElementById('password').value;
    // Lấy giá trị từ input xác nhận mật khẩu
    const confirmPassword = document.getElementById('confirmPassword').value;
    // Lấy element thông báo lỗi
    const errorMsg = document.getElementById('errorMsg');
    // Lấy element thông báo thành công
    const successMsg = document.getElementById('successMsg');

    // Kiểm tra 2 mật khẩu có khớp không
    if (password !== confirmPassword) {
        // Nếu không khớp: Hiện thông báo lỗi, ẩn thông báo thành công
        errorMsg.style.display = 'block';
        successMsg.style.display = 'none';
    } else {
        // Nếu khớp: Ẩn thông báo lỗi, hiện thông báo thành công
        errorMsg.style.display = 'none';
        successMsg.style.display = 'block';
        // Reset form (xóa hết dữ liệu đã nhập)
        document.getElementById('signupForm').reset();
        
    }
});

document.getElementById('confirmPassword').addEventListener('input', function() {
    // Ẩn thông báo lỗi
    document.getElementById('errorMsg').style.display = 'none';
    // Ẩn thông báo thành công
    document.getElementById('successMsg').style.display = 'none';
});
// ===== Admin helpers và điều hướng cơ bản =====

// Ẩn tất cả các phần và chỉ hiển thị phần được chọn
function showSection(sectionName, el) {
	const sections = document.querySelectorAll('.manager-section');
	for (let i = 0; i < sections.length; i++) {
		sections[i].style.display = 'none';
	}

	const target = document.getElementById(sectionName + '-manager');
	if (target) target.style.display = 'block';

	// trigger render for some sections
	if (sectionName === 'product' && typeof renderProductList === 'function') {
		renderProductList();
	}

	// ensure inventory table refreshes when switching into it
	if (sectionName === 'inventory' && typeof renderInventoryTable === 'function') {
		renderInventoryTable();
	}

	const menuItems = document.querySelectorAll('.sidebar li');
	for (let i = 0; i < menuItems.length; i++) {
		menuItems[i].classList.remove('active');
	}
	if (el && el.classList) el.classList.add('active');
}

// ===== Hàm thao tác LocalStorage =====
function _lsGet(key, def) {
	const data = localStorage.getItem(key);
	if (data === null || data === undefined) {
		return JSON.parse(def);
	}
	return JSON.parse(data);
}

function _lsSet(key, val) {
	localStorage.setItem(key, JSON.stringify(val));
}

function loadUsersLS() {
	return _lsGet('app_users', '[]');
}

// ===== Sự kiện khi trang quản lý load =====
window.addEventListener('load', function () {
	// Ẩn tất cả section
	const sections = document.querySelectorAll('.manager-section');
	for (let i = 0; i < sections.length; i++) {
		sections[i].style.display = 'none';
	}

	// Hiện phần quản lý khách hàng mặc định
	const cm = document.getElementById('customer-manager');
	if (cm) cm.style.display = 'block';

	// Đánh dấu menu đầu tiên là active
	const menuItems = document.querySelectorAll('.sidebar li');
	if (menuItems.length > 0) {
		for (let i = 0; i < menuItems.length; i++) {
			menuItems[i].classList.remove('active');
		}
		menuItems[0].classList.add('active');
	}

	// Hiển thị danh sách khách hàng nếu hàm có tồn tại
	if (typeof renderCustomers === 'function') {
		renderCustomers();
	}

	const sideItems = document.querySelectorAll('.sidebar li[data-section]');
	for (let i = 0; i < sideItems.length; i++) {
		sideItems[i].addEventListener('click', function () {
			const section = sideItems[i].getAttribute('data-section');
			showSection(section, sideItems[i]);
		});
	}
});

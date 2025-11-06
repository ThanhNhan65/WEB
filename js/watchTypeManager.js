function anTatCaGiaoDien() {
    const sections = document.querySelectorAll('.content > div[id$="-manager"]');
    sections.forEach(sec => sec.style.display = "none");
}

function hienThiQuanLyLoaiSanPham() {
    const a = document.getElementById('watchtype-manager');
    if (a.style.display === "none" || a.style.display === "") {
        anTatCaGiaoDien(); // ẩn các phần khác trước
        a.style.display = "block";
    } else {
        a.style.display = "none";
    }
}

// Lấy dữ liệu loại sản phẩm từ LocalStorage
function layLoaiSanPham() {
    const data = localStorage.getItem("dsLoaiSanPham");
    return data ? JSON.parse(data) : [];
}

// Lưu dữ liệu vào LocalStorage
function luuLoaiSanPham(ds) {
    localStorage.setItem("dsLoaiSanPham", JSON.stringify(ds));
}

// Hiển thị danh sách loại ra bảng
function hienThiLoaiSanPham() {
    const dsLoai = layLoaiSanPham();
    const tbody = document.getElementById("watchtype-tbody");
    tbody.innerHTML = "";

    dsLoai.forEach((loai, i) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${i + 1}</td>
            <td>${loai}</td>
            <td>
                <button onclick="suaLoai(${i})">Sửa</button>
                <button onclick="xoaLoai(${i})">Xóa</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Thêm loại sản phẩm mới
function themLoai() {
    const tenLoai = prompt("Nhập tên loại đồng hồ mới:");
    if (!tenLoai) return;
    const ds = layLoaiSanPham();
    if (ds.includes(tenLoai)) {
        alert("Loại này đã tồn tại!");
        return;
    }
    ds.push(tenLoai);
    luuLoaiSanPham(ds);
    hienThiLoaiSanPham();
}

// Sửa loại sản phẩm
function suaLoai(index) {
    const ds = layLoaiSanPham();
    const loaiMoi = prompt("Sửa tên loại:", ds[index]);
    if (loaiMoi) {
        ds[index] = loaiMoi;
        luuLoaiSanPham(ds);
        hienThiLoaiSanPham();
    }
}

// Xóa loại sản phẩm
function xoaLoai(index) {
    if (!confirm("Bạn có chắc muốn xóa loại này?")) return;
    const ds = layLoaiSanPham();
    ds.splice(index, 1);
    luuLoaiSanPham(ds);
    hienThiLoaiSanPham();
}

// Lấy dữ liệu loại từ All-Products.json lần đầu tiên
fetch("data/All-Products.json")
    .then(res => res.json())
    .then(data => {
        const loaiTuJSON = [...new Set(data.products.map(p => p.type))];
        if (!localStorage.getItem("dsLoaiSanPham")) {
            localStorage.setItem("dsLoaiSanPham", JSON.stringify(loaiTuJSON));
        }
        hienThiLoaiSanPham();
    });
function anTatCaGiaoDien() {
    const sections = document.querySelectorAll('.content > div[id$="-manager"]');
    sections.forEach(sec => sec.style.display = "none");
}

function hienThiQuanLyLoaiSanPham() {
    anTatCaGiaoDien();
    document.getElementById('watchtype-manager').style.display = "block";
}

function hienthiquanlygiaban() {
    anTatCaGiaoDien();
    document.getElementById('pricing-manager').style.display = "block";
}
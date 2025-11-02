const product = {
    name: "Casio G-Shock GM-110-1A",
    image: "./image/GM-110-1A",
    info: [
        ["Kích thước vỏ (Dài × Rộng × Cao)", "45.9 × 40.4 × 11 mm"],
        ["Trọng lượng", "55 g"],
        ["Vật liệu vỏ và gờ", "Nhựa / Thép không gỉ"],
        ["Dây đeo", "Dây nhựa"],
        ["Cấu trúc", "Chống va đập"],
        ["Khả năng chống nước", "Chống nước ở độ sâu 200 mét"],
        ["Bộ nguồn và tuổi thọ pin", "Khoảng 3 năm với pin CR1025"]
    ],
    price: 999999999
};

function showProduct(product) {
    const nameEl = document.getElementById("product-name");
    if (nameEl) 
        nameEl.textContent = product.name;

    const imgEl = document.getElementById("product-image");
    if (imgEl) imgEl.innerHTML = `<img src="${product.image}" alt="${product.name}" class="img">`;
 
    const tableEl = document.getElementById("product-info");
    if (tableEl) {
        tableEl.innerHTML = ""; 
        product.info.forEach(row => {
            const tr = document.createElement("tr");
            tr.innerHTML = `<td>${row[0]}</td><td>${row[1]}</td>`;
            tableEl.appendChild(tr);
        });
    }

    const priceEl = document.getElementById("product-price");
    if (priceEl) priceEl.textContent = product.price.toLocaleString() + " VND";
}

window.onload = function() {
    showProduct(product);
};
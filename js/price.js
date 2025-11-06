function hienthiquanlygiaban() {
    let a = document.getElementById('pricing-manager');
    if (a.style.display === "none" || a.style.display === "")
        a.style.display = "block";
    else
        a.style.display = "none";
}

let brands = [
    { name: "Casio", margin: 15 },
    { name: "Citizen", margin: 18 },
];

let products = [
    { id: 1, name: "Casio MTP-1374D", brand: "Casio", cost: 1200000, margin: 20 },
    { id: 2, name: "Casio A168", brand: "Casio", cost: 900000, margin: 15 },
    { id: 3, name: "Casio Edifice EFR-539", brand: "Casio", cost: 2600000, margin: 25 },
    { id: 4, name: "Casio G-Shock GA-2100", brand: "Casio", cost: 3500000, margin: 30 },
    { id: 5, name: "Casio Vintage B640", brand: "Casio", cost: 950000, margin: 18 },
    { id: 6, name: "Casio Wave Ceptor WVA-M640", brand: "Casio", cost: 4800000, margin: 28 },

    { id: 7, name: "Citizen BM7100", brand: "Citizen", cost: 3500000, margin: 25 },
    { id: 8, name: "Citizen Eco-Drive AW1231", brand: "Citizen", cost: 4200000, margin: 28 },
    { id: 9, name: "Citizen Promaster Diver", brand: "Citizen", cost: 5200000, margin: 35 },
    { id: 10, name: "Citizen Chronograph AN8050", brand: "Citizen", cost: 3300000, margin: 22 },
    { id: 11, name: "Citizen Mechanical NJ0100", brand: "Citizen", cost: 4600000, margin: 27 },
    { id: 12, name: "Citizen Tsuyosa Automatic", brand: "Citizen", cost: 5600000, margin: 32 }
];

// --- Render bảng loại ---
function renderCategoryTable() {
    var tbody = document.getElementById("category-tbody");
    tbody.innerHTML = ""; 

    for (var i = 0; i < brands.length; i++) {
        var b = brands[i];
        var tr = document.createElement("tr");

        var tdName = document.createElement("td");
        tdName.textContent = b.name;

        var tdMargin = document.createElement("td");
        var input = document.createElement("input");
        input.type = "number";
        input.id = "margin-" + i;
        input.value = b.margin;
        input.min = 0;
        input.max = 100;
        tdMargin.appendChild(input);
        tdMargin.appendChild(document.createTextNode("%"));

        var tdButton = document.createElement("td");
        var btn = document.createElement("button");
        btn.textContent = "Lưu";
        btn.onclick = (function(index){ 
            return function() { saveBrandMargin(index); };
        })(i);
        tdButton.appendChild(btn);

        tr.appendChild(tdName);
        tr.appendChild(tdMargin);
        tr.appendChild(tdButton);

        tbody.appendChild(tr);
    }
}

// --- Lưu lợi nhuận cho Brand ---
function saveBrandMargin(index) {
    var input = document.getElementById("margin-" + index);
    var newMargin = parseFloat(input.value);

    if (isNaN(newMargin) || newMargin < 0) {
        alert("Tỷ lệ không hợp lệ!");
        return;
    }

    brands[index].margin = newMargin;

    for (var i = 0; i < products.length; i++) {
        if (products[i].brand.toLowerCase() === brands[index].name.toLowerCase()) {
            products[i].margin = newMargin;
        }
    }

    localStorage.setItem("brandMargins", JSON.stringify(brands));
    localStorage.setItem("productMargins", JSON.stringify(products));

    renderCategoryTable();
    renderProductList();
    alert("Đã cập nhật lợi nhuận cho thương hiệu " + brands[index].name);
}

// --- Render danh sách sản phẩm ---
function renderProductList(list) {
    if (!list) list = products;
    var container = document.getElementById("product-list");
    container.innerHTML = "";

    for (var i = 0; i < list.length; i++) {
        var p = list[i];
        var sell = p.cost + (p.cost * p.margin / 100);

        var div = document.createElement("div");
        div.className = "product-item";

        var colName = document.createElement("div");
        colName.className = "col name";
        colName.textContent = p.name;

        var colCost = document.createElement("div");
        colCost.className = "col cost";
        colCost.textContent = p.cost.toLocaleString() + " đ";

        var colMargin = document.createElement("div");
        colMargin.className = "col margin";
        var input = document.createElement("input");
        input.type = "number";
        input.id = "prod-" + i;
        input.value = p.margin;
        input.min = 0;
        input.max = 100;
        colMargin.appendChild(input);
        colMargin.appendChild(document.createTextNode("%"));

        var colSell = document.createElement("div");
        colSell.className = "col sell";
        colSell.textContent = sell.toLocaleString() + " đ";

        var colAction = document.createElement("div");
        colAction.className = "col action";
        var btn = document.createElement("button");
        btn.textContent = "Lưu";
        (function(index){ 
            btn.onclick = function() { saveProductMargin(index); };
        })(i);
        colAction.appendChild(btn);

        div.appendChild(colName);
        div.appendChild(colCost);
        div.appendChild(colMargin);
        div.appendChild(colSell);
        div.appendChild(colAction);

        container.appendChild(div);
    }
}

// --- Lưu lợi nhuận cho sản phẩm ---
function saveProductMargin(i) {
    var input = document.getElementById("prod-" + i);
    var newMargin = parseFloat(input.value);

    if (isNaN(newMargin) || newMargin < 0) {
        alert("Tỷ lệ không hợp lệ!");
        return;
    }

    products[i].margin = newMargin;
    localStorage.setItem("productMargins", JSON.stringify(products));
    renderProductList();
    alert("Đã cập nhật lợi nhuận cho sản phẩm " + products[i].name);
}

// --- Tra cứu ---
function tracuu() {
    var key = document.getElementById("lookup-input").value.trim().toLowerCase();
    var result = document.getElementById("lookup-result");
    result.innerHTML = "";

    if (key === "") {
        result.textContent = "Vui lòng nhập tên sản phẩm.";
        return;
    }

    var found = null;
    for (var i = 0; i < products.length; i++) {
        if (products[i].name.toLowerCase().indexOf(key) >= 0) {
            found = products[i];
            break;
        }
    }

    if (!found) {
        result.textContent = "Không tìm thấy sản phẩm.";
        return;
    }

    var sell = found.cost + found.cost * found.margin / 100;
    result.innerHTML = "<b>Tên:</b> " + found.name +
                       "<br><b>Giá vốn:</b> " + found.cost.toLocaleString() + " đ" +
                       "<br><b>% Lợi nhuận:</b> " + found.margin + "%" +
                       "<br><b>Giá bán:</b> " + sell.toLocaleString() + " đ";
}

// --- Lọc theo tên ---
function filterByName() {
    var keyword = document.getElementById("search-product").value.trim().toLowerCase();
    var container = document.getElementById("product-list");
    container.innerHTML = "";

    var filtered = [];
    for (var i = 0; i < products.length; i++) {
        if (products[i].name.toLowerCase().indexOf(keyword) >= 0) {
            filtered.push(products[i]);
        }
    }

    if (filtered.length === 0) {
        container.textContent = "Không tìm thấy sản phẩm.";
        return;
    }

    renderProductList(filtered);
}

// --- Lọc theo brand ---
function filterProducts() {
    var select = document.getElementById("filter-brand");
    var brand = select ? select.value : "";
    var filtered = [];

    for (var i = 0; i < products.length; i++) {
        if (!brand || products[i].brand.toLowerCase() === brand.toLowerCase()) {
            filtered.push(products[i]);
        }
    }

    renderProductList(filtered);
}

// --- Onload ---
window.onload = function () {
    var b = localStorage.getItem("brandMargins");
    var p = localStorage.getItem("productMargins");

    if (b) brands = JSON.parse(b);
    if (p) products = JSON.parse(p);

    renderCategoryTable();
    renderProductList();

    var select = document.getElementById("filter-brand");
    if (select) select.addEventListener("change", filterProducts);
};

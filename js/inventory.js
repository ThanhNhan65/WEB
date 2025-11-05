function hienthiquanlytonkho() {
    let a = document.getElementById('inventory-manager');
    if (a.style.display === "none" || a.style.display === "")
        a.style.display = "block";
    else
        a.style.display = "none";
}

let inventoryProducts = [
    { id: 1, name: "Casio MTP-1374D", brand: "Casio", sku: "CAS-MTP-1374D", stock: 25, minStock: 10, location: "Kho A-01" },
    { id: 2, name: "Casio A168", brand: "Casio", sku: "CAS-A168", stock: 8, minStock: 15, location: "Kho A-02" },
    { id: 3, name: "Casio Edifice EFR-539", brand: "Casio", sku: "CAS-EFR-539", stock: 15, minStock: 8, location: "Kho A-03" },
    { id: 4, name: "Casio G-Shock GA-2100", brand: "Casio", sku: "CAS-GA-2100", stock: 30, minStock: 12, location: "Kho A-04" },
    { id: 5, name: "Casio Vintage B640", brand: "Casio", sku: "CAS-B640", stock: 5, minStock: 10, location: "Kho A-05" },
    { id: 6, name: "Citizen BM7100", brand: "Citizen", sku: "CIT-BM7100", stock: 20, minStock: 10, location: "Kho B-01" },
    { id: 7, name: "Citizen Eco-Drive AW1231", brand: "Citizen", sku: "CIT-AW1231", stock: 12, minStock: 8, location: "Kho B-02" },
    { id: 8, name: "Citizen Promaster Diver", brand: "Citizen", sku: "CIT-PROMASTER", stock: 3, minStock: 5, location: "Kho B-03" },
    { id: 9, name: "Citizen Chronograph AN8050", brand: "Citizen", sku: "CIT-AN8050", stock: 18, minStock: 10, location: "Kho B-04" },
    { id: 10, name: "Citizen Tsuyosa Automatic", brand: "Citizen", sku: "CIT-TSUYOSA", stock: 7, minStock: 12, location: "Kho B-05" }
];

let inventoryHistory = [];

// --- Render danh sách tồn kho ---
function renderInventoryList() {
    var container = document.getElementById("inventory-list");
    container.innerHTML = "";

    var filterBrand = document.getElementById("filter-brand-inv").value;
    var filterStock = document.getElementById("filter-stock").value;
    var searchKey = document.getElementById("search-inventory").value.toLowerCase().trim();

    var filtered = inventoryProducts.filter(function(p) {
        var matchBrand = !filterBrand || p.brand.toLowerCase() === filterBrand.toLowerCase();
        var matchSearch = !searchKey || 
            p.name.toLowerCase().indexOf(searchKey) >= 0 || 
            p.sku.toLowerCase().indexOf(searchKey) >= 0;
        
        var matchStock = true;
        if (filterStock === "low") {
            matchStock = p.stock < p.minStock;
        } else if (filterStock === "normal") {
            matchStock = p.stock >= p.minStock;
        }

        return matchBrand && matchSearch && matchStock;
    });

    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-message">Không tìm thấy sản phẩm</div>';
        updateInventoryStats();
        return;
    }

    for (var i = 0; i < filtered.length; i++) {
        var p = filtered[i];
        var isLowStock = p.stock < p.minStock;

        var div = document.createElement("div");
        div.className = "inventory-item" + (isLowStock ? " low-stock" : "");
        div.setAttribute("data-id", p.id);

        var colName = document.createElement("div");
        colName.className = "col name";
        colName.innerHTML = '<div class="product-name">' + p.name + '</div>' +
                           '<div class="product-sku">SKU: ' + p.sku + '</div>';

        var colBrand = document.createElement("div");
        colBrand.className = "col brand";
        colBrand.textContent = p.brand;

        var colLocation = document.createElement("div");
        colLocation.className = "col location";
        colLocation.textContent = p.location;

        var colStock = document.createElement("div");
        colStock.className = "col stock";
        var stockDiv = document.createElement("div");
        stockDiv.className = "stock-info";
        stockDiv.innerHTML = '<div class="current-stock">' + p.stock + '</div>' +
                            '<div class="min-stock">Tối thiểu: ' + p.minStock + '</div>';
        colStock.appendChild(stockDiv);
        if (isLowStock) {
            var warning = document.createElement("div");
            warning.className = "warning-badge";
            warning.textContent = "⚠ Sắp hết";
            colStock.appendChild(warning);
        }

        var colAdjust = document.createElement("div");
        colAdjust.className = "col adjust";
        
        var adjustDiv = document.createElement("div");
        adjustDiv.className = "adjust-controls";

        var input = document.createElement("input");
        input.type = "number";
        input.className = "adjust-input";
        input.placeholder = "Số lượng";
        input.min = "0";
        input.setAttribute("data-id", p.id);

        var btnIn = document.createElement("button");
        btnIn.className = "btn-adjust in";
        btnIn.textContent = "Nhập";
        btnIn.onclick = (function(productId) {
            return function() { adjustInventory(productId, "in"); };
        })(p.id);

        var btnOut = document.createElement("button");
        btnOut.className = "btn-adjust out";
        btnOut.textContent = "Xuất";
        btnOut.onclick = (function(productId) {
            return function() { adjustInventory(productId, "out"); };
        })(p.id);

        var btnSet = document.createElement("button");
        btnSet.className = "btn-adjust set";
        btnSet.textContent = "Đặt";
        btnSet.onclick = (function(productId) {
            return function() { adjustInventory(productId, "set"); };
        })(p.id);

        adjustDiv.appendChild(input);
        adjustDiv.appendChild(btnIn);
        adjustDiv.appendChild(btnOut);
        adjustDiv.appendChild(btnSet);
        colAdjust.appendChild(adjustDiv);

        var colAction = document.createElement("div");
        colAction.className = "col action";
        
        var btnHistory = document.createElement("button");
        btnHistory.className = "btn-action history";
        btnHistory.textContent = "Lịch sử";
        btnHistory.onclick = (function(productId) {
            return function() { showHistory(productId); };
        })(p.id);

        var btnEdit = document.createElement("button");
        btnEdit.className = "btn-action edit";
        btnEdit.textContent = "Sửa";
        btnEdit.onclick = (function(productId) {
            return function() { editProduct(productId); };
        })(p.id);

        colAction.appendChild(btnHistory);
        colAction.appendChild(btnEdit);

        div.appendChild(colName);
        div.appendChild(colBrand);
        div.appendChild(colLocation);
        div.appendChild(colStock);
        div.appendChild(colAdjust);
        div.appendChild(colAction);

        container.appendChild(div);
    }

    updateInventoryStats();
}

// --- Điều chỉnh tồn kho ---
function adjustInventory(productId, type) {
    var input = document.querySelector('.adjust-input[data-id="' + productId + '"]');
    var quantity = parseInt(input.value);

    if (!quantity || quantity <= 0) {
        alert("Vui lòng nhập số lượng hợp lệ!");
        return;
    }

    var product = null;
    for (var i = 0; i < inventoryProducts.length; i++) {
        if (inventoryProducts[i].id === productId) {
            product = inventoryProducts[i];
            break;
        }
    }

    if (!product) return;

    var oldStock = product.stock;
    var newStock = oldStock;
    var actionText = "";

    if (type === "in") {
        newStock = oldStock + quantity;
        actionText = "Nhập kho";
    } else if (type === "out") {
        newStock = oldStock - quantity;
        if (newStock < 0) newStock = 0;
        actionText = "Xuất kho";
    } else if (type === "set") {
        newStock = quantity;
        actionText = "Đặt tồn kho";
    }

    product.stock = newStock;

    // Lưu lịch sử
    inventoryHistory.push({
        productId: productId,
        productName: product.name,
        action: actionText,
        quantity: quantity,
        oldStock: oldStock,
        newStock: newStock,
        timestamp: new Date().toLocaleString("vi-VN")
    });

    localStorage.setItem("inventoryProducts", JSON.stringify(inventoryProducts));
    localStorage.setItem("inventoryHistory", JSON.stringify(inventoryHistory));

    input.value = "";
    renderInventoryList();
    alert(actionText + " thành công!\n" + product.name + ": " + oldStock + " → " + newStock);
}

// --- Sửa thông tin sản phẩm ---
function editProduct(productId) {
    var product = null;
    for (var i = 0; i < inventoryProducts.length; i++) {
        if (inventoryProducts[i].id === productId) {
            product = inventoryProducts[i];
            break;
        }
    }

    if (!product) return;

    var newMinStock = prompt("Nhập số lượng tồn tối thiểu cho " + product.name + ":", product.minStock);
    if (newMinStock === null) return;

    newMinStock = parseInt(newMinStock);
    if (isNaN(newMinStock) || newMinStock < 0) {
        alert("Số lượng không hợp lệ!");
        return;
    }

    var newLocation = prompt("Nhập vị trí kho mới cho " + product.name + ":", product.location);
    if (newLocation === null || newLocation.trim() === "") {
        newLocation = product.location;
    }

    product.minStock = newMinStock;
    product.location = newLocation.trim();

    localStorage.setItem("inventoryProducts", JSON.stringify(inventoryProducts));
    renderInventoryList();
    alert("Đã cập nhật thông tin sản phẩm!");
}

// --- Hiển thị lịch sử ---
function showHistory(productId) {
    var product = null;
    for (var i = 0; i < inventoryProducts.length; i++) {
        if (inventoryProducts[i].id === productId) {
            product = inventoryProducts[i];
            break;
        }
    }

    if (!product) return;

    var history = inventoryHistory.filter(function(h) {
        return h.productId === productId;
    }).reverse();

    var modal = document.getElementById("history-modal");
    var title = document.getElementById("history-title");
    var content = document.getElementById("history-content");

    title.textContent = "Lịch sử: " + product.name;

    if (history.length === 0) {
        content.innerHTML = '<div class="empty-message">Chưa có lịch sử giao dịch</div>';
    } else {
        var html = '<table class="history-table">';
        html += '<thead><tr><th>Thời gian</th><th>Hành động</th><th>Số lượng</th><th>Tồn trước</th><th>Tồn sau</th></tr></thead>';
        html += '<tbody>';
        for (var i = 0; i < history.length; i++) {
            var h = history[i];
            html += '<tr>';
            html += '<td>' + h.timestamp + '</td>';
            html += '<td><span class="action-badge ' + h.action.toLowerCase().replace(" ", "-") + '">' + h.action + '</span></td>';
            html += '<td>' + h.quantity + '</td>';
            html += '<td>' + h.oldStock + '</td>';
            html += '<td>' + h.newStock + '</td>';
            html += '</tr>';
        }
        html += '</tbody></table>';
        content.innerHTML = html;
    }

    modal.style.display = "flex";
}

// --- Đóng modal ---
function closeHistoryModal() {
    document.getElementById("history-modal").style.display = "none";
}

// --- Cập nhật thống kê ---
function updateInventoryStats() {
    var totalProducts = inventoryProducts.length;
    var totalStock = 0;
    var lowStockCount = 0;

    for (var i = 0; i < inventoryProducts.length; i++) {
        totalStock += inventoryProducts[i].stock;
        if (inventoryProducts[i].stock < inventoryProducts[i].minStock) {
            lowStockCount++;
        }
    }

    document.getElementById("total-products").textContent = totalProducts;
    document.getElementById("total-stock").textContent = totalStock;
    document.getElementById("low-stock-count").textContent = lowStockCount;
}

// --- Lọc ---
function filterInventory() {
    renderInventoryList();
}

// --- Export báo cáo ---
function exportReport() {
    var csv = "STT,Tên sản phẩm,SKU,Thương hiệu,Vị trí,Tồn kho,Tồn tối thiểu,Trạng thái\n";
    
    for (var i = 0; i < inventoryProducts.length; i++) {
        var p = inventoryProducts[i];
        var status = p.stock < p.minStock ? "Sắp hết" : "Bình thường";
        csv += (i + 1) + ',"' + p.name + '","' + p.sku + '","' + p.brand + '","' + 
               p.location + '",' + p.stock + ',' + p.minStock + ',"' + status + '"\n';
    }

    var blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    var link = document.createElement("a");
    var url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "bao-cao-ton-kho-" + new Date().getTime() + ".csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert("Đã xuất báo cáo thành công!");
}

// --- Onload ---
window.onload = function() {
    var savedProducts = localStorage.getItem("inventoryProducts");
    var savedHistory = localStorage.getItem("inventoryHistory");

    if (savedProducts) {
        inventoryProducts = JSON.parse(savedProducts);
    }
    if (savedHistory) {
        inventoryHistory = JSON.parse(savedHistory);
    }

    renderInventoryList();

    document.getElementById("filter-brand-inv").addEventListener("change", filterInventory);
    document.getElementById("filter-stock").addEventListener("change", filterInventory);
    document.getElementById("search-inventory").addEventListener("input", filterInventory);

    // Đóng modal khi click bên ngoài
    window.onclick = function(event) {
        var modal = document.getElementById("history-modal");
        if (event.target === modal) {
            closeHistoryModal();
        }
    };
};

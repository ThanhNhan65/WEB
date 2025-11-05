function hienthiquanlydanhmuc() {
    let a = document.getElementById('category-manager');
    if (a.style.display === "none" || a.style.display === "")
        a.style.display = "block";
    else
        a.style.display = "none";
}

let categories = [
    { id: 1, name: "Đồng hồ Nam", description: "Dành cho nam giới", status: "active" },
    { id: 2, name: "Đồng hồ Nữ", description: "Dành cho nữ giới", status: "active" },
    { id: 3, name: "Đồng hồ Thể thao", description: "Phong cách thể thao", status: "active" },
    { id: 4, name: "Đồng hồ Sang trọng", description: "Cao cấp, sang trọng", status: "active" },
    { id: 5, name: "Đồng hồ Thông minh", description: "Smartwatch hiện đại", status: "inactive" }
];

let nextCategoryId = 6;

// --- Render bảng danh mục ---
function renderCategoryList() {
    var container = document.getElementById("category-list");
    container.innerHTML = "";

    var filterStatus = document.getElementById("filter-status").value;
    var searchKey = document.getElementById("search-category").value.toLowerCase().trim();

    var filtered = categories.filter(function(cat) {
        var matchStatus = !filterStatus || cat.status === filterStatus;
        var matchSearch = !searchKey || cat.name.toLowerCase().indexOf(searchKey) >= 0 || 
                         (cat.description && cat.description.toLowerCase().indexOf(searchKey) >= 0);
        return matchStatus && matchSearch;
    });

    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-message">Không tìm thấy danh mục nào</div>';
        return;
    }

    for (var i = 0; i < filtered.length; i++) {
        var cat = filtered[i];
        var div = document.createElement("div");
        div.className = "category-item";
        div.setAttribute("data-id", cat.id);

        var colId = document.createElement("div");
        colId.className = "col id";
        colId.textContent = cat.id;

        var colName = document.createElement("div");
        colName.className = "col name";
        colName.textContent = cat.name;

        var colDesc = document.createElement("div");
        colDesc.className = "col description";
        colDesc.textContent = cat.description || "—";

        var colStatus = document.createElement("div");
        colStatus.className = "col status";
        var statusBadge = document.createElement("span");
        statusBadge.className = "status-badge " + cat.status;
        statusBadge.textContent = cat.status === "active" ? "Hoạt động" : "Tạm ngưng";
        colStatus.appendChild(statusBadge);

        var colAction = document.createElement("div");
        colAction.className = "col action";
        
        var btnEdit = document.createElement("button");
        btnEdit.className = "btn-action edit";
        btnEdit.textContent = "Sửa";
        btnEdit.onclick = (function(categoryId) {
            return function() { editCategory(categoryId); };
        })(cat.id);

        var btnToggle = document.createElement("button");
        btnToggle.className = "btn-action toggle";
        btnToggle.textContent = cat.status === "active" ? "Tạm ngưng" : "Kích hoạt";
        btnToggle.onclick = (function(categoryId) {
            return function() { toggleCategoryStatus(categoryId); };
        })(cat.id);

        var btnDelete = document.createElement("button");
        btnDelete.className = "btn-action delete";
        btnDelete.textContent = "Xóa";
        btnDelete.onclick = (function(categoryId) {
            return function() { deleteCategory(categoryId); };
        })(cat.id);

        colAction.appendChild(btnEdit);
        colAction.appendChild(btnToggle);
        colAction.appendChild(btnDelete);

        div.appendChild(colId);
        div.appendChild(colName);
        div.appendChild(colDesc);
        div.appendChild(colStatus);
        div.appendChild(colAction);

        container.appendChild(div);
    }

    updateCategoryStats();
}

// --- Thêm/Cập nhật danh mục ---
function saveCategoryForm() {
    var id = document.getElementById("cat-id").value;
    var name = document.getElementById("cat-name").value.trim();
    var description = document.getElementById("cat-description").value.trim();

    if (!name) {
        alert("Vui lòng nhập tên danh mục!");
        return;
    }

    if (id) {
        // Cập nhật
        for (var i = 0; i < categories.length; i++) {
            if (categories[i].id == id) {
                categories[i].name = name;
                categories[i].description = description;
                break;
            }
        }
        alert("Đã cập nhật danh mục: " + name);
    } else {
        // Thêm mới
        categories.push({
            id: nextCategoryId++,
            name: name,
            description: description,
            status: "active"
        });
        alert("Đã thêm danh mục mới: " + name);
    }

    localStorage.setItem("categories", JSON.stringify(categories));
    localStorage.setItem("nextCategoryId", nextCategoryId);
    
    resetCategoryForm();
    renderCategoryList();
}

// --- Sửa danh mục ---
function editCategory(id) {
    var cat = null;
    for (var i = 0; i < categories.length; i++) {
        if (categories[i].id === id) {
            cat = categories[i];
            break;
        }
    }

    if (!cat) return;

    document.getElementById("cat-id").value = cat.id;
    document.getElementById("cat-name").value = cat.name;
    document.getElementById("cat-description").value = cat.description || "";
    document.getElementById("form-title").textContent = "Cập nhật danh mục";
    
    document.getElementById("cat-name").focus();
}

// --- Xóa danh mục ---
function deleteCategory(id) {
    var cat = null;
    for (var i = 0; i < categories.length; i++) {
        if (categories[i].id === id) {
            cat = categories[i];
            break;
        }
    }

    if (!cat) return;

    if (!confirm("Bạn có chắc muốn xóa danh mục '" + cat.name + "'?")) {
        return;
    }

    categories = categories.filter(function(c) {
        return c.id !== id;
    });

    localStorage.setItem("categories", JSON.stringify(categories));
    alert("Đã xóa danh mục: " + cat.name);
    renderCategoryList();
}

// --- Bật/tắt trạng thái ---
function toggleCategoryStatus(id) {
    for (var i = 0; i < categories.length; i++) {
        if (categories[i].id === id) {
            categories[i].status = categories[i].status === "active" ? "inactive" : "active";
            break;
        }
    }

    localStorage.setItem("categories", JSON.stringify(categories));
    renderCategoryList();
}

// --- Reset form ---
function resetCategoryForm() {
    document.getElementById("cat-id").value = "";
    document.getElementById("cat-name").value = "";
    document.getElementById("cat-description").value = "";
    document.getElementById("form-title").textContent = "Thêm danh mục mới";
}

// --- Cập nhật thống kê ---
function updateCategoryStats() {
    var total = categories.length;
    var active = categories.filter(function(c) { return c.status === "active"; }).length;
    var inactive = total - active;

    document.getElementById("total-categories").textContent = total;
    document.getElementById("active-categories").textContent = active;
    document.getElementById("inactive-categories").textContent = inactive;
}

// --- Lọc và tìm kiếm ---
function filterCategories() {
    renderCategoryList();
}

// --- Onload ---
window.onload = function() {
    var savedCategories = localStorage.getItem("categories");
    var savedNextId = localStorage.getItem("nextCategoryId");

    if (savedCategories) {
        categories = JSON.parse(savedCategories);
    }
    if (savedNextId) {
        nextCategoryId = parseInt(savedNextId);
    }

    renderCategoryList();

    document.getElementById("filter-status").addEventListener("change", filterCategories);
    document.getElementById("search-category").addEventListener("input", filterCategories);
};

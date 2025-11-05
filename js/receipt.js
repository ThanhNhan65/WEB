function hienThiQuanLyDonHang() {
    hideAllManagers();
    let a = document.getElementById('receipt-manager');
    if (a.style.display === "none" || a.style.display === "")
        a.style.display = "block";
    else
        a.style.display = "none";
}
function hideAllManagers() {
    let a = document.querySelectorAll(".content > [id$='-manager']");
    a.forEach(manager => manager.style.display = "none");
}

let receipts = [
    { 
        id: 1, 
        customerName: "Nguyen Van A", 
        date: "01-06-2025", 
        status: "Đã giao", 
        products: [
            { name: "CM-S110PG-1A", brand: "G-SHOCK", price: 329, quantity: 1, image: "./image/best-seller.png", link: "chitietsanpham.html" },
            { name: "DM-S110PG-1A", brand: "G-SHOCK", price: 359, quantity: 2, image: "./image/best-seller.png", link: "chitietsanpham.html" },
            { name: "EM-S110PG-1A", brand: "G-SHOCK", price: 399, quantity: 1, image: "./image/best-seller.png", link: "chitietsanpham.html" },
            { name: "FM-S110PG-1A", brand: "G-SHOCK", price: 429, quantity: 1, image: "./image/best-seller.png", link: "chitietsanpham.html" },
            { name: "GM-S110PG-1A", brand: "G-SHOCK", price: 499, quantity: 1, image: "./image/best-seller.png", link: "chitietsanpham.html" }
        ]
    },
    { 
        id: 2, 
        customerName: "Tran Thi B", 
        date: "04-07-2025", 
        status: "Đang xử lý", 
        products: [
            { name: "HM-S110PG-1A", brand: "G-SHOCK", price: 529, quantity: 1, image: "./image/best-seller.png", link: "chitietsanpham.html" },
            { name: "IM-S110PG-1A", brand: "G-SHOCK", price: 559, quantity: 1, image: "./image/best-seller.png", link: "chitietsanpham.html" },
            { name: "JM-S110PG-1A", brand: "G-SHOCK", price: 559, quantity: 2, image: "./image/best-seller.png", link: "chitietsanpham.html" },
            { name: "KM-S110PG-1A", brand: "G-SHOCK", price: 559, quantity: 1, image: "./image/best-seller.png", link: "chitietsanpham.html" }
        ]
    },
    { 
        id: 3, 
        customerName: "Le Van C", 
        date: "12-03-2025", 
        status: "Đã hủy", 
        products: [
            { name: "LM-S110PG-1A", brand: "G-SHOCK", price: 559, quantity: 1, image: "./image/best-seller.png", link: "chitietsanpham.html" },
            { name: "CM-S110PG-1A", brand: "G-SHOCK", price: 329, quantity: 2, image: "./image/best-seller.png", link: "chitietsanpham.html" },
            { name: "DM-S110PG-1A", brand: "G-SHOCK", price: 359, quantity: 1, image: "./image/best-seller.png", link: "chitietsanpham.html" }
        ]
    },
    { 
        id: 4, 
        customerName: "Pham Thi D", 
        date: "11-08-2025", 
        status: "Đã giao", 
        products: [
            { name: "EM-S110PG-1A", brand: "G-SHOCK", price: 399, quantity: 1, image: "./image/best-seller.png", link: "chitietsanpham.html" },
            { name: "FM-S110PG-1A", brand: "G-SHOCK", price: 429, quantity: 2, image: "./image/best-seller.png", link: "chitietsanpham.html" },
            { name: "GM-S110PG-1A", brand: "G-SHOCK", price: 499, quantity: 1, image: "./image/best-seller.png", link: "chitietsanpham.html" },
            { name: "HM-S110PG-1A", brand: "G-SHOCK", price: 529, quantity: 1, image: "./image/best-seller.png", link: "chitietsanpham.html" }
        ]
    },
    { 
        id: 5, 
        customerName: "Hoang Van E", 
        date: "26-05-2025", 
        status: "Đang xử lý", 
        products: [
            { name: "IM-S110PG-1A", brand: "G-SHOCK", price: 559, quantity: 1, image: "./image/best-seller.png", link: "chitietsanpham.html" },
            { name: "JM-S110PG-1A", brand: "G-SHOCK", price: 559, quantity: 2, image: "./image/best-seller.png", link: "chitietsanpham.html" },
            { name: "KM-S110PG-1A", brand: "G-SHOCK", price: 559, quantity: 1, image: "./image/best-seller.png", link: "chitietsanpham.html" },
            { name: "LM-S110PG-1A", brand: "G-SHOCK", price: 559, quantity: 1, image: "./image/best-seller.png", link: "chitietsanpham.html" }
        ]
    },
    { 
        id: 6, 
        customerName: "Tran Van B", 
        date: "05-11-2025", 
        status: "Mới đặt", 
        products: [
            { name: "CM-S110PG-1A", brand: "G-SHOCK", price: 329, quantity: 1, image: "./image/best-seller.png", link: "chitietsanpham.html" },
            { name: "DM-S110PG-1A", brand: "G-SHOCK", price: 359, quantity: 2, image: "./image/best-seller.png", link: "chitietsanpham.html" },
            { name: "EM-S110PG-1A", brand: "G-SHOCK", price: 399, quantity: 1, image: "./image/best-seller.png", link: "chitietsanpham.html" },
            { name: "FM-S110PG-1A", brand: "G-SHOCK", price: 429, quantity: 1, image: "./image/best-seller.png", link: "chitietsanpham.html" }
        ]
    }
];


function calculateTotalMoney(receipt){
    let total = 0;
    for (let i = 0; i < receipt.products.length; i++){
        total += receipt.products[i].price * receipt.products[i].quantity;
    }
    return total;
}
function formatMoney(money) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(money);
}

function convertDate(date){ //chuyển dữ liệu dd-mm-yyyy sang yyyy-mm-dd
    const parts = date.split("-");
    const [day, month, year] = parts;
    return `${year}-${month}-${day}`;
}
function renderReceiptTable(filteredReceipts) {
    var tbody = document.getElementById("receipt-tbody");
    tbody.innerHTML = "";

    filteredReceipts.forEach((receipt, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${receipt.id}</td>
            <td>${receipt.customerName}</td>
            <td>${receipt.date}</td>
            <td>${formatMoney(calculateTotalMoney(receipt))}</td>
            <td>${receipt.status}</td>
            <td><button id="view-btn-${index}">Xem</button></td>
        `;
        tbody.appendChild(row);


        document.getElementById(`view-btn-${index}`).addEventListener("click", () => {
            renderDetailedReceipts(receipt);
        });
    });
}

function filterReceipts() {
    const statusFilter = document.getElementById("filter-status").value.trim();
    const startDateInput = document.getElementById("startdate").value;
    const endDateInput = document.getElementById("enddate").value;

    const startDate = startDateInput ? new Date(convertDate(startDateInput)) : new Date("1970-01-01");
    const endDate = endDateInput ? new Date(convertDate(endDateInput)) : new Date();

    const filtered = [];

    for (let i = 0; i < receipts.length; i++) {
        const r = receipts[i];
        const receiptDate = new Date(convertDate(r.date));

        const matchStatus = !statusFilter || r.status === statusFilter;
        const matchDate = receiptDate >= startDate && receiptDate <= endDate;

        if (matchStatus && matchDate) {
            filtered.push(r);
        }
    }

    hideDetailedReceipt();
    renderReceiptTable(filtered);
}
document.addEventListener("DOMContentLoaded", () => {renderReceiptTable(receipts);});

var currentReceipt;
function renderDetailedReceipts(receipt){
    currentReceipt = receipt;
    var a = document.getElementById("detailed-receipt");
    var status = document.getElementById("receipt-status");

    if (a.style.display === "none" || a.style.display === "")
        a.style.display = "block";
    else
        a.style.display = "none";

    const statusColors = {
    "Đã giao": "rgb(79, 255, 73)",
    "Đã hủy": "rgb(255, 73, 73)",
    "Đang xử lý": "rgb(255, 160, 50)"
    };
    status.innerHTML = `<h3> Trạng thái: ${receipt.status}</h3>`;
    status.style.color = statusColors[receipt.status] || "white";
    


    var products = receipt.products;
    var tbody = document.getElementById("dr-table");
    tbody.innerHTML = "";
    products.forEach(p => {
        const row = document.createElement("tr");
        var subtotal = p.price * p.quantity;
        row.innerHTML = `
            <td><img src="${p.image}" alt="${p.name}"></td>
            <td>${p.name}</td>
            <td>${p.brand}</td>
            <td>${formatMoney(p.price)}</td>
            <td>${p.quantity}</td>
            <td>${formatMoney(subtotal)}</td>
        `;
        tbody.appendChild(row);
    })

    var customertbody = document.getElementById("dr-customer-table");
    customertbody.innerHTML = `
        <td>${receipt.id}</td>
        <td>${receipt.customerName}</td>
        <td>${receipt.date}</td>
        <td>${formatMoney(calculateTotalMoney(receipt))}</td>
    `;
    
}

document.getElementById("updatestatus").addEventListener("click",() => { updateReceiptStatus() });
function updateReceiptStatus() {
    const newStatus = document.getElementById("status-select").value;

    currentReceipt.status = newStatus;

    const status = document.getElementById("receipt-status");
    status.innerHTML = `<h3>Trạng thái: ${currentReceipt.status}</h3>`;

    const statusColors = {
        "Đã giao": "rgb(79, 255, 73)",
        "Đã hủy": "rgb(255, 73, 73)",
        "Đang xử lý": "orange",
        "Mới đặt": "blue"
    };
    status.style.color = statusColors[currentReceipt.status] || "white";
    renderReceiptTable(receipts);
}

function hideDetailedReceipt(){
    var d = document.getElementById("detailed-receipt");
    d.style.display = "none";
}



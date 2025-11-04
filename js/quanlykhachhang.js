
let customers = [
    {
        id: 1,
        name: "Nguyễn Văn A",
        email: "nguyenvana@email.com",
        phone: "0901234567"
    },
    {
        id: 2,
        name: "Trần Thị B",
        email: "tranthib@email.com",
        phone: "0912345678"
    },
    {
        id: 3,
        name: "Lê Văn C",
        email: "levanc@email.com",
        phone: "0923456789"
    }
];


let nextId = 4;


function displayCustomers(customerList = customers) {
    const tbody = document.getElementById('customerTableBody');
    
    if (customerList.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-state">
                    <p>Không có khách hàng nào</p>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = '';
    
    customerList.forEach(customer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${customer.id}</td>
            <td>${customer.name}</td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td>
                <a href="#" class="action-link" onclick="editCustomer(${customer.id}); return false;">Sửa</a>
                <a href="#" class="action-link delete" onclick="deleteCustomer(${customer.id}); return false;">Xóa</a>
            </td>
        `;
        tbody.appendChild(row);
    });
}


function openAddModal() {
    document.getElementById('modalTitle').textContent = 'Thêm Khách hàng';
    document.getElementById('customerForm').reset();
    document.getElementById('customerId').value = '';
    document.getElementById('customerModal').style.display = 'block';
}


function closeModal() {
    document.getElementById('customerModal').style.display = 'none';
}

function saveCustomer(event) {
    event.preventDefault();
    
    const id = document.getElementById('customerId').value;
    const name = document.getElementById('customerName').value;
    const email = document.getElementById('customerEmail').value;
    const phone = document.getElementById('customerPhone').value;
    
    if (id) {
    
        const index = customers.findIndex(c => c.id == id);
        if (index !== -1) {
            customers[index] = { id: parseInt(id), name, email, phone };
        }
    } else {
      
        customers.push({
            id: nextId++,
            name,
            email,
            phone
        });
    }
    
    displayCustomers();
    closeModal();
}


function editCustomer(id) {
    const customer = customers.find(c => c.id === id);
    
    if (customer) {
        document.getElementById('modalTitle').textContent = 'Sửa Khách hàng';
        document.getElementById('customerId').value = customer.id;
        document.getElementById('customerName').value = customer.name;
        document.getElementById('customerEmail').value = customer.email;
        document.getElementById('customerPhone').value = customer.phone;
        document.getElementById('customerModal').style.display = 'block';
    }
}


function deleteCustomer(id) {
    if (confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
        customers = customers.filter(c => c.id !== id);
        displayCustomers();
    }
}


function searchCustomers() {
    const searchTerm = document.getElementById('searchBox').value.toLowerCase();
    
    if (searchTerm === '') {
        displayCustomers();
        return;
    }
    
    const filtered = customers.filter(customer => 
        customer.name.toLowerCase().includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm) ||
        customer.phone.includes(searchTerm)
    );
    
    displayCustomers(filtered);
}


window.onclick = function(event) {
    const modal = document.getElementById('customerModal');
    if (event.target === modal) {
        closeModal();
    }
}


document.addEventListener('DOMContentLoaded', function() {
    displayCustomers();

    document.getElementById('searchBox').addEventListener('input', searchCustomers);
});

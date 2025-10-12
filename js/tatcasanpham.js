function toggleFilterMenu() {
  const menu = document.getElementById("filterMenu");
  menu.classList.toggle("active");
}

document.addEventListener("click", function (event) {
  const filterWrapper = document.querySelector(".filter-wrapper");
  const isClickInside = filterWrapper.contains(event.target);

  if (!isClickInside) {
    document.getElementById("filterMenu").classList.remove("active");
  }
});


function sortAZ() {
  sortProductsAZ();
  // Thêm logic sắp xếp sản phẩm tại đây
}

function sortZA() {
  sortProductsZA();
  // Thêm logic sắp xếp sản phẩm tại đây
}

function applyAnimation(items) {
  items.forEach((item, index) => {
    item.classList.add("animate"); // bắt đầu hiệu ứng ẩn

    setTimeout(() => {
      item.classList.remove("animate"); // hiện lại từng item
    }, index * 200); // delay từng sản phẩm
  });
}


function sortProductsAZ() {
  const list = document.querySelector(".product-list");
  const items = Array.from(list.querySelectorAll(".product-item"));

  const sorted = items.sort((a, b) => {
    const nameA = a.querySelector(".product-name").textContent.trim().toLowerCase();
    const nameB = b.querySelector(".product-name").textContent.trim().toLowerCase();
    return nameA.localeCompare(nameB);
  });

  list.innerHTML = ""; // Xóa danh sách cũ
  sorted.forEach(item => list.appendChild(item)); // Gắn lại theo thứ tự mới
  applyAnimation(sorted);

}

function sortProductsZA() {
  const list = document.querySelector(".product-list");
  const items = Array.from(list.querySelectorAll(".product-item"));

  const sorted = items.sort((a, b) => {
    const nameA = a.querySelector(".product-name").textContent.trim().toLowerCase();
    const nameB = b.querySelector(".product-name").textContent.trim().toLowerCase();
    return nameB.localeCompare(nameA);
  });

  list.innerHTML = "";
  sorted.forEach(item => list.appendChild(item));
  applyAnimation(sorted);

}



// Làm pagination
const pagination = document.querySelector('.pagination');
const prevBtn = pagination.querySelector('.prev');
const nextBtn = pagination.querySelector('.next');

let currentPage = 0;
const productsPerPage = 6;
let allProducts = [];

const productList = document.getElementById('product-list');

// Tải dữ liệu từ JSON
fetch('/json/products.json')
  .then(res => res.json())
  .then(data => {
    allProducts = data.products.map(product => {
      const item = document.createElement('a');
      item.className = 'product-item';
      item.href = product.link;
      item.innerHTML = `
        <div class="product-img">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-info">
          <p class="product-brand">${product.brand}</p>
          <p class="product-name">${product.name}</p>
          <p class="product-price">$${product.price} <span>$${product.old_price}</span></p>
        </div>
      `;
      return item;
    });

    createPagination(allProducts.length, productsPerPage);
    renderProducts(currentPage);
    updatePaginationUI();
  });

// Tạo nút phân trang động
function createPagination(totalItems, itemsPerPage) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const nextBtn = pagination.querySelector('.next');

  // Xóa nút cũ
  pagination.querySelectorAll('.index').forEach(el => el.remove());

  for (let i = 0; i < totalPages; i++) {
    const pageBtn = document.createElement('div');
    pageBtn.className = 'index';
    pageBtn.textContent = i + 1;
    if (i === currentPage) pageBtn.classList.add('active');

    pageBtn.addEventListener('click', () => {
      currentPage = i;
      renderProducts(currentPage);
      updatePaginationUI();
    });

    pagination.insertBefore(pageBtn, nextBtn);
  }
}

// Hiển thị sản phẩm theo trang
function renderProducts(page) {
  productList.innerHTML = '';
  const start = page * productsPerPage;
  const end = start + productsPerPage;
  const items = allProducts.slice(start, end);
  items.forEach(item => productList.appendChild(item));

  // Cuộn lên đầu vùng sản phẩm, trừ chiều cao header
  const wrapperTop = document.querySelector('.all-products-wrapper').offsetTop;
  window.scrollTo({
    top: wrapperTop - 180,
    behavior: 'smooth'
  });
}

// Cập nhật giao diện phân trang
function updatePaginationUI() {
  const pageNumbers = Array.from(pagination.querySelectorAll('.index'));
  pageNumbers.forEach((btn, i) => {
    btn.classList.toggle('active', i === currentPage);
  });

  prevBtn.style.opacity = currentPage === 0 ? '0.5' : '1';
  nextBtn.style.opacity = currentPage === pageNumbers.length - 1 ? '0.5' : '1';
}

// Xử lý nút prev/next
pagination.addEventListener('click', (e) => {
  const target = e.target;
  const totalPages = Math.ceil(allProducts.length / productsPerPage);

  if (target.classList.contains('prev') && currentPage > 0) {
    currentPage--;
  }

  if (target.classList.contains('next') && currentPage < totalPages - 1) {
    currentPage++;
  }

  renderProducts(currentPage);
  updatePaginationUI();
});
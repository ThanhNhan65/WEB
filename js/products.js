const PRODUCTS = 'app_products';

function seedProductsIfEmpty() {
  var existing = localStorage.getItem(PRODUCTS);
  if (existing) return;

  const products = [
  { id: 'p1', name: 'BABY-G BA-110AH-4A', brand: 'BABY-G', type: 'Dien tu', price: 3750000, image: 'image/BA-110AH-4A.avif', description: 'Thiết kế trẻ trung, năng động với tông hồng pastel.', specs: { caseMaterial: 'Nhựa', waterResistance: '100m', movement: 'Quartz', gender: 'Nữ' } },
  { id: 'p2', name: 'BABY-G BA-110AH-9A', brand: 'BABY-G', type: 'Dien tu', price: 3850000, image: 'image/BA110AH-9A.avif', description: 'Phiên bản vàng pastel trẻ trung, chống sốc.', specs: { caseMaterial: 'Nhựa', waterResistance: '100m', movement: 'Quartz', gender: 'Nữ' } },
  { id: 'p3', name: 'BABY-G BG169CH-4', brand: 'BABY-G', type: 'Dien tu', price: 3200000, image: 'image/BG169CH-4.avif', description: 'Vỏ trong suốt cá tính, chức năng thể thao.', specs: { caseMaterial: 'Nhựa', waterResistance: '200m', movement: 'Quartz', gender: 'Nữ' } },
  { id: 'p4', name: 'BABY-G BG169CH-9', brand: 'BABY-G', type: 'Dien tu', price: 3300000, image: 'image/BG169CH-9.avif', description: 'Vàng trong suốt ấn tượng, bền bỉ.', specs: { caseMaterial: 'Nhựa', waterResistance: '200m', movement: 'Quartz', gender: 'Nữ' } },
  { id: 'p5', name: 'BABY-G BGA10-3A', brand: 'BABY-G', type: 'Dien tu', price: 2950000, image: 'image/BGA10-3A.avif', description: 'Xanh mint nhẹ nhàng, nhỏ gọn.', specs: { caseMaterial: 'Nhựa', waterResistance: '100m', movement: 'Quartz', gender: 'Nữ' } },
  { id: 'p6', name: 'BABY-G BGA10-6A', brand: 'BABY-G', type: 'Dien tu', price: 2950000, image: 'image/BGA10-6A.avif', description: 'Tím pastel thời trang.', specs: { caseMaterial: 'Nhựa', waterResistance: '100m', movement: 'Quartz', gender: 'Nữ' } },
  { id: 'p7', name: 'BABY-G BGD565GC-2', brand: 'BABY-G', type: 'Dien tu', price: 3100000, image: 'image/BGD565GC-2.avif', description: 'Vuông cổ điển, xanh ngọc nổi bật.', specs: { caseMaterial: 'Nhựa', waterResistance: '200m', movement: 'Quartz', gender: 'Nữ' } },
  { id: 'p8', name: 'BABY-G BGD565GC-4', brand: 'BABY-G', type: 'Dien tu', price: 3100000, image: 'image/BGD565GC-4.avif', description: 'Hồng dễ thương, cứng cáp.', specs: { caseMaterial: 'Nhựa', waterResistance: '200m', movement: 'Quartz', gender: 'Nữ' } },
  { id: 'p9', name: 'CASIO MTP-V002D-7B3', brand: 'CASIO', type: 'Kim', price: 1500000, image: 'image/casio_mtp-v002d-7b3.png', description: 'Dây thép, tối giản, dễ phối.', specs: { caseMaterial: 'Thép không gỉ', waterResistance: '30m', movement: 'Quartz', gender: 'Nam' } },
  { id: 'p10', name: 'EDIFICE ECB-900DB-1A', brand: 'EDIFICE', type: 'Kim', price: 7800000, image: 'image/edifice_ecb-900db-1a.png', description: 'Thể thao lịch lãm, hiện đại.', specs: { caseMaterial: 'Thép không gỉ', waterResistance: '100m', movement: 'Quartz', gender: 'Nam' } },
  { id: 'p11', name: 'G-SHOCK DW-5600E-1V', brand: 'G-SHOCK', type: 'Dien tu', price: 4200000, image: 'image/gshock_dw-5600e-1v.png', description: 'Vuông cổ điển, chống sốc.', specs: { caseMaterial: 'Nhựa', waterResistance: '200m', movement: 'Quartz', gender: 'Nam' } },
  { id: 'p12', name: 'G-SHOCK GM-S110PG-1A', brand: 'G-SHOCK', type: 'Unisex', price: 9900000, image: 'image/gshock_gm-s110pg-1a.png', description: 'Khung kim loại rose gold.', specs: { caseMaterial: 'Thép + Nhựa', waterResistance: '200m', movement: 'Quartz', gender: 'Unisex' } },
  { id: 'p13', name: 'OCEANUS OCW-S5000', brand: 'OCEANUS', type: 'Kim', price: 32500000, image: 'image/oceanus_ocw-s5000.png', description: 'Titan, năng lượng mặt trời.', specs: { caseMaterial: 'Titan', waterResistance: '100m', movement: 'Tough Solar', gender: 'Nam' } },
  { id: 'p14', name: 'PROTREK PRG-600', brand: 'PROTREK', type: 'Dien tu', price: 11200000, image: 'image/protrek_prg-600.png', description: 'Dã ngoại, cảm biến 3.', specs: { caseMaterial: 'Nhựa', waterResistance: '100m', movement: 'Quartz', gender: 'Nam' } },
  { id: 'p15', name: 'SHEEN SHE-4057PG-4A', brand: 'SHEEN', type: 'Kim', price: 5200000, image: 'image/sheen_she-4057pg-4a.png', description: 'Nữ tính, mặt hồng, dây kim loại.', specs: { caseMaterial: 'Thép không gỉ', waterResistance: '50m', movement: 'Quartz', gender: 'Nữ' } }
];
  localStorage.setItem(PRODUCTS, JSON.stringify(products));
}

{
  var raw = localStorage.getItem(PRODUCTS);
  if (raw) {
    try {
      var arr = JSON.parse(raw);
      var changed = false;
      for (var i = 0; i < arr.length; i++) {
        if (!arr[i].code) { arr[i].code = arr[i].id || ('p' + (i+1)); changed = true; }
      }
      if (changed) localStorage.setItem(PRODUCTS, JSON.stringify(arr));
    } catch (e) {}
  }
}

function getAllProducts() {
  var text = localStorage.getItem(PRODUCTS);
  if (!text) return [];
  return JSON.parse(text);
}

function getWatchTypes() {
  var raw = localStorage.getItem('watchTypes');
  if (!raw) return [];
  return JSON.parse(raw);
}

function populateWatchTypeSelects() {
  var types = getWatchTypes().filter(function(t){ return !t.hidden; });
  if(!types || types.length === 0){
    var prods = getAllProducts();
    var map = {};
    for(var i=0;i<prods.length;i++){
      var p = prods[i];
      if(!p) continue;
      var key = (p.type) ? p.type : (p.brand ? p.brand : null);
      if(key) map[key] = true;
    }
    types = [];
    var keys = Object.keys(map);
    for(var k=0;k<keys.length;k++){
      types.push({ name: keys[k] });
    }
  }

  var selects = document.querySelectorAll('select[data-watch-type], select#type, select[name="type"], select#filter-type, select#prod-type-select, select#invTypeFilter, select#pointType, select#periodType');
  for(var s=0;s<selects.length;s++){
    var sel = selects[s];
    var prev = sel.value;
    sel.innerHTML = '';
    var optAll = document.createElement('option');
    optAll.value = '';
    optAll.textContent = '-- Chọn loại --';
    sel.appendChild(optAll);
    for(var tIndex=0;tIndex<types.length;tIndex++){
      var t = types[tIndex];
      var o = document.createElement('option');
      o.value = t.name; 
      o.textContent = t.name;
      sel.appendChild(o);
    }
    if (prev) sel.value = prev;
  }
}

document.addEventListener('watchTypesUpdated', function(e){
  populateWatchTypeSelects();
});

document.addEventListener('productsUpdated', function(e){
  populateWatchTypeSelects();
  renderProducts(currentProductPage || 1);
  renderProductDetail();
});

window.addEventListener('storage', function(e){
  if (e.key === 'watchTypes') populateWatchTypeSelects();
  if (e.key === PRODUCTS) {
    populateWatchTypeSelects();
    renderProducts(currentProductPage || 1);
    renderProductDetail();
  }
});


var PRODUCTS_PER_PAGE = 6;
var currentProductPage = 1;

function renderProducts(page) {
  var list = document.getElementById('product-list');
  if (!list) return;
  var products = getAllProducts();
  products = products.filter(function(p){ return !p.hidden; });
  if (typeof filterProductsByQuery === 'function') {
    products = filterProductsByQuery(products);
  }
  var total = products.length;
  var totalPages = Math.ceil(total / PRODUCTS_PER_PAGE);
  if (!page || page < 1) page = 1;
  if (page > totalPages) page = totalPages;
  currentProductPage = page;

  list.innerHTML = '';
  var start = (page - 1) * PRODUCTS_PER_PAGE;
  var end = Math.min(start + PRODUCTS_PER_PAGE, total);
  for (var i = start; i < end; i++) {
    var p = products[i];
    var div = document.createElement('div');
    div.className = 'product-item';
    div.setAttribute('data-id', p.id);
    var imgSrc = p.image || 'image/placeholder.png';
    div.innerHTML =
      '<img src="' + imgSrc + '" alt="' + (p.name||'') + '" class="img">' +
      '<div class="product-info">' +
        '<div class="product-brand">' + (p.type || p.brand || '') + '</div>' +
        '<div class="product-name">' + p.name + '</div>' +
        '<div class="product-price">' + (p.price ? Number(p.price).toLocaleString('vi-VN') + ' ₫' : '') + '</div>' +
        '<button class="btn-add-to-cart" data-id="' + p.id + '">Thêm vào giỏ</button>' +
      '</div>';
    div.addEventListener('click', function(e) {
      if (e.target.classList.contains('btn-add-to-cart')) return;
      var pid = this.getAttribute('data-id');
      if (pid) window.location.href = 'chitietsanpham.html?id=' + encodeURIComponent(pid);
    });
    list.appendChild(div);
  }

  var buttons = document.getElementsByClassName('btn-add-to-cart');
  for (var j = 0; j < buttons.length; j++) {
    buttons[j].addEventListener('click', function(e) {
      e.stopPropagation();
      var pid = this.getAttribute('data-id');
      var uid = (typeof getCurrentUserId === 'function') ? getCurrentUserId() : null;
      if (!uid) {
        alert('Vui lòng đăng nhập để thêm vào giỏ hàng.');
        window.location.href = 'login.html';
        return;
      }
      var key = 'app_cart' + uid;
      var cart = JSON.parse(localStorage.getItem(key) || '[]');
      var found = false;
      for (var i = 0; i < cart.length; i++) {
        if (cart[i].productId === pid) {
          cart[i].qty++;
          found = true;
          break;
        }
      }
      if (!found) {
        cart.push({ productId: pid, qty: 1 });
      }
      localStorage.setItem(key, JSON.stringify(cart));
      if (typeof updateCartCountBadge === 'function') updateCartCountBadge();
      alert('Đã thêm vào giỏ hàng!');
    });
  }
  if (typeof updateCartCountBadge === 'function') updateCartCountBadge();

  renderPagination(totalPages, page);
}

function renderPagination(totalPages, currentPage) {
  var pag = document.getElementById('pagination');
  if (!pag) return;
  pag.innerHTML = '';

  var prev = document.createElement('button');
  prev.className = 'page-btn prev';
  prev.innerHTML = '&larr; prev';
  prev.disabled = currentPage <= 1;
  prev.onclick = function() {
    if (currentPage > 1) renderProducts(currentPage - 1);
  };
  pag.appendChild(prev);

  var maxShow = 5;
  var start = Math.max(1, currentPage - 2);
  var end = Math.min(totalPages, start + maxShow - 1);
  if (end - start < maxShow - 1) 
    start = Math.max(1, end - maxShow + 1);
  for (var i = start; i <= end; i++) {
    var idx = document.createElement('button');
    idx.className = 'index' + (i === currentPage ? ' active' : '');
    idx.textContent = i;
    idx.disabled = (i === currentPage);
    idx.onclick = (function(pageNum) {
      return function() { renderProducts(pageNum); };
    })(i);
    pag.appendChild(idx);
  }

  var next = document.createElement('button');
  next.className = 'page-btn next';
  next.innerHTML = 'next &rarr;';
  next.disabled = currentPage >= totalPages;
  next.onclick = function() {
    if (currentPage < totalPages) renderProducts(currentPage + 1);
  };
  pag.appendChild(next);
}

function renderProductDetail() {
  var nameEl = document.getElementById('product-name');
  var imgEl = document.getElementById('product-image');
  var infoEl = document.getElementById('product-info');
  var priceEl = document.getElementById('product-price');

  if (!nameEl) return;

  var params = new URLSearchParams(location.search);
  var id = params.get('id');
  var all = getAllProducts();
  var prod = null;
  for (var i = 0; i < all.length; i++) {
    if (all[i].id === id) {
      prod = all[i];
      break;
    }
  }

  if (!prod) {
    nameEl.textContent = 'Không tìm thấy sản phẩm';
    return;
  }

  nameEl.textContent = prod.name;
  var imgSrc = prod.image || 'image/placeholder.png';
  imgEl.innerHTML = '<img src="' + imgSrc + '" alt="' + (prod.name||'') + '">';
  priceEl.textContent = (prod.price ? Number(prod.price).toLocaleString('vi-VN') + ' ₫' : '');
  var specs = prod.specs || {};
  infoEl.innerHTML =
    '<tr><td>Loại</td><td>' + (prod.type || prod.brand || '') + '</td></tr>' +
    '<tr><td>Chất liệu</td><td>' + (specs.caseMaterial || '') + '</td></tr>' +
    '<tr><td>Kháng nước</td><td>' + (specs.waterResistance || '') + '</td></tr>' +
    '<tr><td>Giới tính</td><td>' + (specs.gender || '') + '</td></tr>';

  var btnBuy = document.querySelector('.button-left');
  var btnAdd = document.querySelector('.button-right');
}

document.addEventListener('DOMContentLoaded', function() {
  seedProductsIfEmpty();
  populateWatchTypeSelects();
  renderProducts(1);
  renderProductDetail();
  if (typeof updateCartCountBadge === 'function') updateCartCountBadge();
});


document.addEventListener('DOMContentLoaded', function () {
  const title = document.querySelector('.watch-title');
  if (title) {
    title.style.cursor = 'pointer'; // cho biết có thể click
    title.addEventListener('click', function () {
      window.location.href = 'index.html';
    });
  }
});


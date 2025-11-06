document.addEventListener('DOMContentLoaded', function() {
  if (typeof updateCartCountBadge === 'function') updateCartCountBadge();

  var nameEl = document.getElementById('product-name');
  var imgEl = document.getElementById('product-image');
  var infoEl = document.getElementById('product-info');
  var priceEl = document.getElementById('product-price');
  var btnBuy = document.querySelector('.button-left');
  var btnAdd = document.querySelector('.button-right');

  var params = new URLSearchParams(location.search);
  var id = params.get('id');
  if (!id) {
    if (nameEl) nameEl.textContent = 'Không tìm thấy sản phẩm';
    return;
  }

  var all = (typeof getAllProducts === 'function') ? getAllProducts() : [];
  var prod = all.find(function(p) { return p.id === id; });
  if (!prod) {
    if (nameEl) nameEl.textContent = 'Không tìm thấy sản phẩm';
    return;
  }

  if (nameEl) nameEl.textContent = prod.name;
  if (imgEl) imgEl.innerHTML = '<img src="' + prod.image + '" alt="' + prod.name + '">';
  if (priceEl) priceEl.textContent = prod.price.toLocaleString('vi-VN') + ' ₫';
  if (infoEl) infoEl.innerHTML =
    '<tr><td>Thương hiệu</td><td>' + prod.brand + '</td></tr>' +
    '<tr><td>Chất liệu</td><td>' + prod.specs.caseMaterial + '</td></tr>' +
    '<tr><td>Kháng nước</td><td>' + prod.specs.waterResistance + '</td></tr>' +
    '<tr><td>Giới tính</td><td>' + prod.specs.gender + '</td></tr>';

  function addToCartDetail(pid) {
    var uid = window.getCurrentUserId ? getCurrentUserId() : 'guest';
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
  }

  if (btnAdd) {
    btnAdd.addEventListener('click', function(e) {
      e.preventDefault();
      addToCartDetail(prod.id);
    });
  }

  if (btnBuy) {
    btnBuy.addEventListener('click', function(e) {
      e.preventDefault();
      addToCartDetail(prod.id);
      window.location.href = 'GioHang.html';
    });
  }
});

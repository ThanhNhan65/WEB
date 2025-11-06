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
    if (window._addingToCart) return;
    window._addingToCart = true;

    var uid = (typeof getCurrentUserId === 'function') ? getCurrentUserId() : null;
    if (!uid) {
        alert('Vui lòng đăng nhập để sử dụng giỏ hàng.');
      window._addingToCart = false;
      window.location.href = 'login.html';
        return false;
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
    setTimeout(function(){ window._addingToCart = false; }, 200);
      return true;
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
        var ok = addToCartDetail(prod.id);
        if (ok) window.location.href = 'GioHang.html';
    });
  }
});

var CART_PREFIX = 'app_cart';
var ORDERS_PREFIX = 'app_orders';

function getCartkey(){
  if (typeof getCurrentUserId !== 'function') return null;
  var uid = getCurrentUserId();
  if (uid) return CART_PREFIX + uid;
  return null;
}

function getOrdersKey(){
  if (typeof getCurrentUserId !== 'function') return null;
  var uid = getCurrentUserId();
  if (uid) return ORDERS_PREFIX + uid;
  return null;
}

function requireLoginforCart(){
  if(typeof getCurrentUserId !== 'function')
    return false;

  var uid = getCurrentUserId();
  if(!uid){
    alert("Vui lòng đăng nhập để sử dụng giỏ hàng.");
    window.location.href ="login.html";
    return false;
  }
    return true;
}

function loadCart(){
  var key = getCartkey();
  if(!key)
    return [];
  var raw = localStorage.getItem(key);
  if(raw)
    return JSON.parse(raw);
  
  return [];
}

function savecart(items){
  var key = getCartkey();
  if(!key)
    return;
  localStorage.setItem(key, JSON.stringify(items));
}

function addToCart(productId, qty) {
    if (!requireLoginforCart())
      return;
    if (!qty) 
      qty = 1;
    var cart = loadCart();
    var found = false;

    for (var i = 0; i < cart.length; i++) {
        if (cart[i].productId == productId) {
            cart[i].qty += qty;
            found = true;
            break;
        }
    }

    if (!found) {
        cart.push({ productId: productId, qty: qty });
    }

    savecart(cart);
    alert("Đã thêm vào giỏ hàng!");
}


function updateCartQty(productId, qty) {
    if (!requireLoginforCart()) 
      return;
    var cart = loadCart();

    for (var i = 0; i < cart.length; i++) {
        if (cart[i].productId == productId) {
            if (qty <= 0) {
                cart.splice(i, 1);
            } else {
                cart[i].qty = qty;
            }
            break;
        }
    }
    savecart(cart);
}

function removeFromCart(productId) {
    if (!requireLoginforCart()) 
      return;
    var cart = loadCart();
    var newCart = [];
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].productId != productId) 
          newCart.push(cart[i]);
    }
    savecart(newCart);
}

function clearCart() {
  savecart([]);
}

function getCartDetailed(){
  var items = loadCart();
  var all = (typeof getAllProducts === 'function') ? getAllProducts() : [];
  var lines = [];
  var total =0;

  for(var i = 0; i <items.length;i++){
    var it = items[i];
    var p= null;

    for(var j=0; j<all.length;j++){
      if(all[j].id==it.productId){
        p=all[j];
        break;
      }
    }
    var price = p ? p.price : 0;
    var name = p ? p.name : "(đã xóa)";
    var image = p ? p.image : "";
    var lineTotal = price * it.qty;
    total += lineTotal;

    lines.push({
      productId: it.productId,
      name: name,
      price: price,
      qty: it.qty,
      lineTotal: lineTotal,
      image: image
    });
  }
  return { 
    lines : lines,
    total : total
  };
}

function requireLoginForCart(){
  return requireLoginforCart();
}

function saveOrder(order){
  var key = getOrdersKey();
  if(!key)
    return;
  var arr = JSON.parse(localStorage.getItem(key) || '[]');
  arr.unshift(order);
  localStorage.setItem(key, JSON.stringify(arr));
}

function loadOrders(){
  var key = getOrdersKey();
  if(!key)
    return [];
  return JSON.parse(localStorage.getItem(key) || '[]');
}

function initCartPage() {
    var tbody = document.getElementById("cart-body");
    var totalEl = document.getElementById("cart-total");

    if (!tbody) 
      return;
    if (!requireLoginforCart()) return;

    function render() {
        var result = getCartDetailed();
        var lines = result.lines;
        var total = result.total;
        var html = "";

        if (lines.length == 0) {
            html = "<tr><td colspan='5' align='center'>Giỏ hàng trống</td></tr>";
        } else {
            for (var i = 0; i < lines.length; i++) {
                var l = lines[i];
                html += "<tr>";
                html += "<td><img src='" + l.image + "' width='70'></td>";
                html += "<td>" + l.name + "</td>";
        html += "<td>" + (l.price || 0).toLocaleString('vi-VN') + "₫</td>";
                html += "<td><input type='number' min='1' value='" + l.qty + "' data-id='" + l.productId + "'></td>";
        html += "<td>" + (l.lineTotal || 0).toLocaleString('vi-VN') + "₫</td>";
                html += "<td><button onclick='removeFromCart(\"" + l.productId + "\"); initCartPage();'>Xóa</button></td>";
                html += "</tr>";
            }
        }
        tbody.innerHTML = html;
    if (totalEl) totalEl.innerHTML = "Tổng tiền: " + (total || 0).toLocaleString('vi-VN') + "₫";
    }

    render();

    tbody.addEventListener("change", function(e) {
        if (e.target.tagName.toLowerCase() == "input") {
            var id = e.target.getAttribute("data-id");
            var qty = parseInt(e.target.value);
            updateCartQty(id, qty);
            initCartPage();
        }
    });
    var contBtn = document.getElementById('cont-buy');
    if (contBtn) {
      contBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = 'products.html';
      });
    }

    var checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (!requireLoginforCart()) return;
        var detail = getCartDetailed();
        if (!detail.lines.length) {
          alert('Giỏ hàng trống!');
          return;
        }
        window.location.href = 'thanhtoan.html';
      });
    }
}

function initCheckoutPage() {
}

function initOrderHistoryPage() {
  var list = document.getElementById("order-list");
  if (!list) return;
  if (!requireLoginForCart()) return;

  var orders = loadOrders();
  list.innerHTML = "";

  if (orders.length === 0) {
    list.innerHTML = "<p style='text-align:center;'>Chưa có đơn hàng nào.</p>";
    return;
  }

  for (var i = 0; i < orders.length; i++) {
    var o = orders[i];

    var orderDiv = document.createElement("div");
    orderDiv.className = "order";

    var header = document.createElement("div");
    header.className = "order-header";
    header.textContent =
      "Mã đơn: " +
      o.id +
      " | Ngày: " +
      (o.createdAt ? new Date(o.createdAt).toLocaleString("vi-VN") : "Không rõ");

    var details = document.createElement("div");
    details.className = "order-details";

    var ul = document.createElement("ul");
    for (var j = 0; j < o.items.length; j++) {
      var it = o.items[j];
      var li = document.createElement("li");
      li.textContent = `${it.name} x${it.qty} - ${it.lineTotal.toLocaleString()}₫`;
      ul.appendChild(li);
    }
    details.appendChild(ul);


    if (o.shippingAddress) {
      var ship = document.createElement("p");
      ship.textContent = "Địa chỉ giao hàng: " + o.shippingAddress;
      details.appendChild(ship);
    }
    // Phương thức thanh toán (đen)
    if (o.paymentMethod) {
      var pm = document.createElement("p");
      var pmText = "";
      switch(o.paymentMethod) {
        case 'cod': pmText = 'Thanh toán khi nhận hàng (COD)'; break;
        case 'card': pmText = 'Thẻ tín dụng/ghi nợ'; break;
        case 'wallet': pmText = 'Ví điện tử'; break;
        case 'bank': pmText = 'Chuyển khoản ngân hàng'; break;
        default: pmText = o.paymentMethod;
      }
      pm.textContent = "Phương thức thanh toán: " + pmText;
      details.appendChild(pm);
    }
    var status = document.createElement("p");
    var st = (o.status || 'pending');
    var stText = 'Chờ xác nhận', stClass = 'pending';
    if (st === 'success') { stText = 'Thành công'; stClass = 'success'; }
  else if (st === 'cancel') { stText = 'Đã huỷ'; stClass = 'cancel'; }
  else if (st === 'processing') { stText = 'Đang xử lý'; stClass = 'processing'; }
    status.innerHTML = 'Tình trạng: <span class="order-status ' + stClass + '">' + stText + '</span>';
    details.appendChild(status);
    var total = document.createElement("p");
    total.className = "order-total";
    total.textContent = "Tổng tiền: " + o.total.toLocaleString() + "₫";
    details.appendChild(total);

    header.addEventListener("click", function () {
      var next = this.nextElementSibling;
      next.style.display = next.style.display === "block" ? "none" : "block";
    });

    orderDiv.appendChild(header);
    orderDiv.appendChild(details);
    list.appendChild(orderDiv);
  }
}


document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('cart-body')) initCartPage();
  if (window.location.pathname.endsWith('thanhtoan.html')) {
    renderOrderSummary();
    setupCheckoutForm();
  }
  if (document.getElementById('order-list')) initOrderHistoryPage();
});

// Listen for storage changes in other tabs/windows and refresh order history
window.addEventListener('storage', function(e){
  if (!e.key) return;
  try{
    if (e.key.indexOf('app_orders') === 0){
      if (document.getElementById('order-list')) initOrderHistoryPage();
    }
  }catch(ex){}
});

function renderOrderSummary() {
  if (typeof getCartDetailed !== 'function') return;
  var detail = getCartDetailed();
  var list = document.getElementById('order-items');
  var totalEl = document.getElementById('order-total');
  if (!list || !totalEl) return;
  list.innerHTML = '';
  detail.lines.forEach(function(line) {
    var li = document.createElement('li');
    li.innerHTML = `<span>${line.name} x${line.qty}</span><span>${line.lineTotal.toLocaleString('vi-VN')}₫</span>`;
    list.appendChild(li);
  });
  totalEl.textContent = detail.total.toLocaleString('vi-VN') + '₫';
}

function setupCheckoutForm() {
  var form = document.querySelector('.checkout-form');
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (typeof getCartDetailed !== 'function' || typeof saveOrder !== 'function' || typeof clearCart !== 'function') {
      alert('Không thể xử lý đơn hàng!');
      return;
    }
    var detail = getCartDetailed();
    if (!detail.lines.length) {
      alert('Giỏ hàng trống!');
      return;
    }
    var optionEl = document.querySelector('input[name="address_option"]:checked');
    var option = optionEl ? optionEl.value : 'default';
    var shippingAddress = '';
    if (option === 'default') {
      var sel = document.querySelector('input[name="ship_address_select"]:checked');
      if (sel) shippingAddress = sel.value.trim();
      if (!shippingAddress) {
        var defBox = document.getElementById('default-address-text');
        shippingAddress = defBox ? defBox.textContent.trim() : '';
      }
      if (!shippingAddress) {
        alert('Vui lòng chọn một địa chỉ giao hàng.');
        return;
      }
    } else {
      var a = (document.getElementById('ship-address')||{}).value || '';
      a = a.trim();
      if (!a) {
        alert('Vui lòng nhập địa chỉ giao hàng.');
        return;
      }
      shippingAddress = a;
      var saveNew = document.getElementById('save-new-address');
      if (saveNew && saveNew.checked && typeof getCurrentUserId === 'function') {
        var uid = getCurrentUserId();
        if (uid) {
          var key = 'app_addresses_' + uid;
          var list = JSON.parse(localStorage.getItem(key) || '[]');
          if (list.indexOf(shippingAddress) === -1) {
            list.unshift(shippingAddress);
            localStorage.setItem(key, JSON.stringify(list));
          }
        }
      }
    }

    var methodEl = document.getElementById('payment_method');
    var paymentMethod = methodEl ? methodEl.value : 'cod';
    if (paymentMethod === 'card') {
      var cnum = (document.getElementById('card-number')||{}).value || '';
      var cname = (document.getElementById('card-name')||{}).value || '';
      var cexp = (document.getElementById('card-exp')||{}).value || '';
      var ccvc = (document.getElementById('card-cvc')||{}).value || '';
      if (!cnum || !cname || !cexp || !ccvc) {
        alert('Vui lòng nhập đủ thông tin thẻ.');
        return;
      }
    }
    var order = {
      id: 'order_' + Date.now(),
      createdAt: Date.now(),
      status: 'pending',
      items: detail.lines,
      total: detail.total,
      shippingAddress: shippingAddress,
      paymentMethod: paymentMethod
    };
    saveOrder(order);
    try{
      if (typeof window.updateInventoryFromOrder === 'function'){
        window.updateInventoryFromOrder(order);
      }
    }catch(e){ console.error('Error updating inventory from order:', e); }
    clearCart();
    alert('Đặt hàng thành công!');
    window.location.href = 'lichsumuahang.html';
  });
}
if (window.location.pathname.endsWith('thanhtoan.html')) {
  document.addEventListener('DOMContentLoaded', function() {
    renderOrderSummary();
    setupCheckoutForm();
  });
}
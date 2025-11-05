const totalPriceEl = document.querySelector(".total-price");
const cartList = document.querySelector(".cart-list");
const cartEmptyEl = document.querySelector(".cart-empty");

const cartItems = [
    {
      "name": "HM-S110PG-1A",
      "brand": "G-SHOCK",
      "price": 529,
      "old_price": 999,
      "image": "./image/best-seller.png",
      "link": "chitietsanpham.html",
      "quantity": 1
    },
];

function renderCart() {
    cartList.innerHTML = "";
    let total = 0;

    if (cartItems.length === 0) {
        cartList.style.display = "none";
        cartEmptyEl.style.display = "block";
        cartEmptyEl.innerHTML += "<p>Giỏ hàng của bạn đang trống</p>";
        cartEmptyEl.innerHTML += `<a href="tatcasanpham.html" class="cont-buy" style="width: 48%">Tiếp tục mua hàng</a>`;
        return;
    }


    cartList.style.display = "flex";
    cartEmptyEl.style.display = "none";
    
    let table = `
        <table>
            <thead>
                <tr>
                    <th colspan="2">Sản phẩm</th>
                    <th>Giá</th>
                    <th>Số lượng</th>
                    <th>Thành tiền</th>
                    <th>Xóa</th>
                </tr>
            </thead>
            <tbody>
    `;
    

    cartItems.forEach((item, index) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    const row = `
        <tr>
            <td><img src="${item.image}" alt="${item.name}"></td>
            <td class="product">${item.name}</td>
            <td class="price" data-price="${item.price}">$${item.price}</td>
            <td>
                <button class="decrease" data-index="${index}">-</button>
                <input type="number" class="quantity" value="${item.quantity}" min="1" data-index="${index}">
                <button class="increase" data-index="${index}">+</button>
            </td>
            <td class="subtotal">$${subtotal}</td>
            <td><button class="remove" data-index="${index}"><i class="fa-solid fa-trash-can"></i></button></td>
        </tr>
    `;
    
    table += row;
    });

    table += `
            </tbody>
        </table>
    `;
    cartList.innerHTML = table;

    const cartFooter = `
        <div class="cart-footer">
            <div class="total-price"><b>Tổng tiền: </b>$${total}</div>
            <div class="cart-button">
                <a href="tatcasanpham.html" class="cont-buy">Tiếp tục mua hàng</a>
                <a href="thanhtoan.html" class="checkout">Thanh toán</a></button>
            </div>
        </div>
    `;

    cartList.insertAdjacentHTML('beforeend', cartFooter);
    addEventListeners();
}

function addEventListeners() {
    document.querySelectorAll(".increase").forEach(btn => {
        btn.addEventListener("click", () => {
            const index = btn.dataset.index;
            cartItems[index].quantity++;
            renderCart();
        });
    });

    document.querySelectorAll(".decrease").forEach(btn => {
        btn.addEventListener("click", () => {
            const index = btn.dataset.index;
            if (cartItems[index].quantity > 1) {
                cartItems[index].quantity--;
            } else {
                // Optional: confirm before removing
                if (confirm("Xóa sản phẩm này khỏi giỏ hàng?")) {
                    cartItems.splice(index, 1);
                }
            }
            renderCart();
        });
    });

    document.querySelectorAll(".remove").forEach(btn => {
        btn.addEventListener("click", () => {
            const index = btn.dataset.index;
            if (confirm("Xóa sản phẩm này khỏi giỏ hàng?")) {
                cartItems.splice(index, 1);
                renderCart();
            }
        });
    });

    document.querySelectorAll(".quantity").forEach(input => {
        input.addEventListener("change", (e) => {
            const index = input.dataset.index;
            const value = parseInt(e.target.value);
            if (value > 0) {
                cartItems[index].quantity = value;
            } else {
                cartItems[index].quantity = 1;
            }
            renderCart();
        });
    });
}

renderCart();


